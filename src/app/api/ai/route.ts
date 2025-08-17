import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { EntityType, PostScope, Sentiment } from "@prisma/client";
import z from "zod";
import prismaClient from "@/lib/prisma";

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
            name: z.string().describe("The full name of the entity."),
            type: z.enum(["PERSON", "ORGANIZATION"]).describe("The type of the entity."),
            sentiment: z.enum(["POSITIVE", "NEGATIVE", "NEUTRAL"]).describe("The feeling associated with the entity by the news presented."),
        }))
        .describe(
            "A list of entities mentioned in the news, such as individuals or organizations. Include only the most relevant entities, including their full names without abbreviations or acronyms.",
        ),
    spectrum: z
        .enum([
            "neutral",
            "left",
            "right",
            "center",
            "liberal",
            "conservative",
            "progressive",
            "protectionist",
        ])
        .describe(
            "Political or economic spectrum classification of the news. Choose the most fitting option. If not clear, return 'neutral'.",
        ),
});

const promptTemplate = ChatPromptTemplate.fromMessages([
    [
        "system",
        `You are an algorithm that writes minimalist social media posts.
Your job is to read the given news article and generate a title, a summary, and a spectrum classification.

Rules:
- Be fully impartial: ignore opinions, adjectives, or ideological tone from the source.
- Only mention the main facts (dates, places, numbers, results).
- When possible, compare with similar situations or past results.
- Use clear and accessible language.
- Do not use sensationalist titles.
- The "content" must be between 500 and 800+ characters long, detailed but concise.
- The "title" and "content" must be in Portuguese.
- Research similar topics or parties that may be impacted and add them to the content.
- If appropriate, at the end of the content you can add some questions about the news presented to question people from different political spectrums, these comments may exceed the defined limit of the "content".
- For "spectrum", classify the news using the provided enum categories only. If unclear, return "neutral".`,
    ],
    ["human", "{text}"],
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

    const post = await prismaClient.post.create({
        data: {
            content: `### ${response.title}. ### \n ${response.content}`,
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

    await prismaClient.$disconnect();

    return new Response(JSON.stringify(response, null, 2), {
        headers: { "Content-Type": "application/json" },
    });
}
