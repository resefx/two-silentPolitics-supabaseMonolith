import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import z from "zod";
import prisma from "@/lib/prisma";

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
    "pro_union"
]);


const entitiesToCommentSchema = z
    .array(
        z
            .object({
                entityIds: ideologyEnum.describe(
                    "Select the ideology that this comment should reflect.",
                ),
                content: z
                    .string()
                    .min(1, { message: "Comment content cannot be empty." })
                    .max(500, {
                        message: "Comment content cannot exceed 500 characters.",
                    })
                    .describe(
                        "The content of the comment, which should reflect the ideology selected in `entityIds`.",
                    ),
            })
            .refine((data) => data.content.trim().length > 0, {
                message:
                    "The comment content must reflect the selected ideology and cannot be empty.",
                path: ["content"],
            }),
    )
    .min(1, { message: "You must provide at least one comment object." })
    .max(3, { message: "You can provide up to three comment objects." })
    .describe(
        "An array of comment objects. Each object must select a single ideology and contain a comment reflecting that ideology.",
    );
const promptTemplate = ChatPromptTemplate.fromMessages([
    [
        "system",
        `You are an algorithm that analyzes a news article and determines the relevant political/economic ideologies for commenting on it.

Rules:
- Choose between 1 and 3 ideologies from this list: [${ideologyEnum.options.join(", ")}].
- Only select ideologies that reflect the political/economic aspect revealed in the news.
- Do not generate titles, summaries, or any other text.
- The "content" must be in Portuguese.
- All comments must be made with deep opinions based on one's own ideology, without shallow comments against other ideologies.
- Always contain ideologies and comments contrary to other ideologies.
- If possible, you should choose an ideology that you will defend, one that is neutral and one that is against.
- Avoid mentioning temporal organizations, governments, or trending political events.`,
    ],
    ["user", "{text}"],
]);

export async function GET() {
    const postwithoutcomments = await prisma.post.findMany({
        where: {
            comments: {
                none: {},
            },
        },
        include: {
            PostEntity: { include: { entity: true } },
        },
        take: 3,
        orderBy: { createdAt: "desc" },
    });

    if (postwithoutcomments.length === 0) {
        return new Response("No posts without comments found", { status: 404 });
    }

    const llm = new ChatGoogleGenerativeAI({
        model: "gemini-2.0-flash",
        temperature: 0.2, // ligeiramente mais criativo p/ garantir completude
        apiKey: process.env.GOOGLE_API_KEY,
    });

    const structured_llm = llm.withStructuredOutput(entitiesToCommentSchema);

    for (const information of postwithoutcomments) {
        const prompt = await promptTemplate.invoke({
            text: `Check this post: "${information.title} - ${information.content}" entities: "${information.PostEntity.map((e) => e.entityId).join(", ")}"`,
        });

        const response = await structured_llm.invoke(prompt);

        if (!response) {
            console.error("Failed to generate response for post:", information.id);
        }

        for (const commentData of response) {
            await prisma.comment.create({
                data: {
                    content: commentData.content,
                    commentator: commentData.entityIds,
                    postId: information.id,
                    ai: true,
                },
            });
        }

    }

    return new Response("Ok");
}
