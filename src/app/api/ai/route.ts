import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { EntityType, PostScope, Sentiment } from "@prisma/client";
import z from "zod";
import prismaClient, { prisma } from "@/lib/prisma";

const ideologyEnum = z.enum([
    // Neutral
    "neutral",

    // Política geral
    "left",
    "right",
    "center",
    "liberal",
    "conservative",
    "progressive",
    "authoritarian",
    "libertarian",
    "populist",
    "technocratic",

    // Economia/mercado
    "protectionist",
    "socialist",
    "capitalist",
    "free_market",
    "social_market",
    "state_controlled",
    "crypto_friendly",

    // Social/Cultural
    "feminist",
    "traditionalist",
    "multiculturalist",
    "secular",
    "religious",
    "environmentalist",

    // Tecnologia/Inovação
    "tech_progressive",
    "tech_skeptic",
    "ai_ethics",

    // Internacional/Geopolítica
    "globalist",
    "nationalist",
    "interventionist",
    "isolationist",
    "pro_union",
]);

const postSchema = z.object({
    title: z
        .string()
        .describe(
            "A short and objective title of the news, without sensationalism.",
        ),
    content: z
        .string()
        .min(500)
        .describe(
            "A minimalist but informative summary between 500 and 800 characters. Impartial, factual, covering the main points of the news, optionally comparing with similar past situations.",
        ),
    entities: z
        .array(z.object({
            name: z
                .string()
                .describe(
                    "The **full and exact name** of the entity as mentioned in the article. Do not shorten, abbreviate, or merge similar names (e.g., 'Jair Bolsonaro' and 'Eduardo Bolsonaro' must remain distinct)."
                ),
            type: z
                .enum(["PERSON", "ORGANIZATION"])
                .describe("The type of the entity."),
            sentiment: z
                .enum(["POSITIVE", "NEGATIVE", "NEUTRAL"])
                .describe(
                    "The sentiment expressed toward the entity in the article."
                ),
        }))
        .describe(
            "A list of entities explicitly mentioned in the news. Include only the most relevant individuals and organizations. Always use their full and unambiguous names without abbreviations, acronyms, or partial references.",
        ),
    spectrum: ideologyEnum
        .describe(
            "Political or economic spectrum classification of the news. Choose the most fitting option. If not clear, return 'neutral'.",
        ),
});

const promptTemplate = ChatPromptTemplate.fromMessages([
    [
        "system",
        `You are an algorithm that writes minimalist social media posts.
Your job is to read the given news article and generate a title, a summary, entities, and a spectrum classification.

Rules:
- Be fully impartial: ignore opinions, adjectives, or ideological tone from the source.
- Only mention the main facts (dates, places, numbers, results).
- When possible, compare with similar situations or past results.
- Use clear and accessible language.
- Do not use sensationalist titles.
- The "content" must be between 500 and 800+ characters long, detailed but concise.
- The "title" and "content" must be in Portuguese.
- Research similar topics or parties that may be impacted and add them to the content.
- If appropriate, at the end of the content you can add some questions about the news presented to provoke debate between different political spectrums (these comments may exceed the defined limit of the "content").
- For "spectrum", classify the news using the provided enum categories only. If unclear, return "neutral".
- For "entities":
   • Always extract the **full and exact name** as written in the article (e.g., "Jair Bolsonaro" ≠ "Eduardo Bolsonaro" ≠ "Flávio Bolsonaro").
   • Do not shorten, abbreviate, or merge similar names. Each unique person or organization must remain distinct.
   • Every post must explicitly mention at least one concrete entity (company, institution, court, party, group, or organization) directly involved in the event.
- Do NOT mention or allude to:
   • temporal organizations or governments (e.g., "governo Trump", "governo Bolsonaro", "gestão X", "administração Y");
   • abstract or ideological entities such as "censorship", "freedom of expression", "open internet".`,
    ],
    ["human", "{text}"],
]);


const entitiesToCommentSchema = z
    .array(
        z.object({
            entityIds: ideologyEnum.describe(
                "Select the ideology that this comment should reflect."
            ),
            content: z
                .string()
                .min(1, { message: "Comment content cannot be empty." })
                .max(500, {
                    message: "Comment content cannot exceed 500 characters.",
                })
                .describe(
                    "The content of the comment, which should reflect the ideology selected in `entityIds`."
                ),
        })
    )
    .min(1, { message: "You must provide at least one comment object." })
    .max(3, { message: "You can provide up to three comment objects." })
    .describe(
        "An array of comment objects. Each object must select a single ideology and contain a comment reflecting that ideology."
    );

const promptTemplateComment = ChatPromptTemplate.fromMessages([
    [
        "system",
        `You are an algorithm that analyzes a news article and generates ideological comments about it.

Rules:
- Choose between 1 and 3 ideologies from this list: [${ideologyEnum.options.join(", ")}].
- Each comment must be written in **Portuguese**.
- Each comment must strongly reflect the worldview of the chosen ideology, as if written by a passionate defender of that perspective.
- The comments must be **clearly distinct** from each other in tone, arguments, and focus. Do not recycle similar sentences or ideas.
- Always create contrast: if one defends, another must criticize, and a third can be neutral or analytical.
- Avoid shallow comments. Instead, use values, principles, and consequences typical of the chosen ideology.
- Never mention temporal organizations, governments, leaders, or trending political events.
- Output must follow the schema with entityIds + content.`,
    ],
    ["user", "{text}"],
]);

export async function GET() {
    // que não contenha post
    const lastNews = await prismaClient.newspaper.findFirst({
        where: {
            post: {
                none: {} // garante que não existe nenhum post vinculado
            }
        },
        include: {
            post: true // inclui o campo post (vai vir sempre [])
        },
        orderBy: {
            publishedAt: "desc"
        }
    })

    if (!lastNews) {
        return new Response("No new news found", { status: 404 });
    }

    const llm = new ChatGoogleGenerativeAI({
        model: "gemini-2.0-flash",
        temperature: 0.2, // ligeiramente mais criativo p/ garantir completude
        apiKey: process.env.GOOGLE_API_KEY,
    });

    const structured_llm = llm.withStructuredOutput(postSchema);

    const prompt = await promptTemplate.invoke({
        text: `Check this webpage: "${lastNews?.url}" \n content: "${lastNews?.title} - ${lastNews?.description}"`,
    });

    const response = await structured_llm.invoke(prompt);

    if (!response) {
        return new Response("Failed to generate response", { status: 500 });
    }

    if (response.entities.length === 0) {
        return new Response("No entities found in the response", { status: 500 });
    }

    const post = await prismaClient.post.create({
        data: {
            title: response.title,
            content: response.content,
            spectrum: response.spectrum,
            link: lastNews?.url || "unknown",
            newspaperId: lastNews?.id || null,
            scope:
                response.entities.length > 1
                    ? PostScope.MULTI_ENTITY
                    : PostScope.SINGLE_ENTITY,
        },
    });

    for (const entity of response.entities) {
        let one = await prismaClient.entity.findFirst({
            where: {
                name: {
                    mode: 'default',
                    contains: entity.name
                }
            },
        });

        if (!one) {
            one = await prismaClient.entity.create({
                data: {
                    name: entity.name,
                    type: entity.type.toUpperCase() === "PERSON" ? EntityType.PERSON : EntityType.ORGANIZATION,
                },
            });
        }

        await prismaClient.postEntity.create({
            data: {
                postId: post.id,
                entityId: one.id,
                sentiment:
                    entity.sentiment.toUpperCase() === "POSITIVE"
                        ? Sentiment.POSITIVE
                        : entity.sentiment.toUpperCase() === "NEGATIVE"
                            ? Sentiment.NEGATIVE
                            : Sentiment.NEUTRAL,
            },
        });
    }

    const postwithPostEntity = await prismaClient.post.findUnique({
        where: { id: post.id },
        include: {
            PostEntity: { include: { entity: true } },
        },
    });

    if (postwithPostEntity) {
        const llmComment = new ChatGoogleGenerativeAI({
            model: "gemini-2.0-flash",
            temperature: 0.75, // more creative & diverse
            topP: 0.9,         // reduces generic repetition
            apiKey: process.env.GOOGLE_API_KEY,
        });

        const structured_llm_comment = llmComment.withStructuredOutput(entitiesToCommentSchema);

        const promptComment = await promptTemplateComment.invoke({
            text: `Analyze this post: "${postwithPostEntity.title} - ${postwithPostEntity.content}" entities: "${postwithPostEntity.PostEntity.map(
                (e) => e.entityId
            ).join(", ")}"`,
        });

        const responseComment = await structured_llm_comment.invoke(promptComment);

        if (!responseComment) {
            return new Response("Failed to generate comments", { status: 500 });
        }

        for (const commentData of responseComment) {
            await prisma.comment.create({
                data: {
                    content: commentData.content,
                    commentator: commentData.entityIds,
                    postId: postwithPostEntity.id,
                    ai: true,
                },
            });
        }

    }

    await prismaClient.$disconnect();

    return new Response(JSON.stringify(response, null, 2), {
        headers: { "Content-Type": "application/json" },
    });
}
