/** biome-ignore-all lint/style/noNonNullAssertion: <explanation> */
import { z } from "zod";
import prismaClient from "@/lib/prisma";

export async function GET() {
    const ArticleSchema = z.object({
        title: z.string(),
        description: z.string(),
        author: z.string(),
        url: z.string(),
        urlToImage: z.string(),
        publishedAt: z.union([z.string(), z.number(), z.date()]),
        content: z.string(),
        source: z.object({
            id: z.string().nullable().optional(),
            name: z.string(),
        }),
    });
    type Article = z.infer<typeof ArticleSchema>;
    //Check last 7 days of news articles
    const lastNews = await prismaClient.newspaper.findFirst({
        orderBy: { publishedAt: "desc" },
    });

    if (
        lastNews &&
        lastNews.publishedAt > new Date(Date.now() - ((6 * 24 + 20) * 60 * 60 * 1000))
    ) {
        return new Response("Ok", {
            headers: { "Content-Type": "application/json" },
        });
    }

    const date = new Date();
    date.setDate(date.getDate() - 7);
    const fromDate = date.toISOString().split("T")[0];

    const resp = await fetch(
        `https://newsapi.org/v2/everything?q=governo&from=${fromDate}&sortBy=publishedAt&apiKey=${process.env.NEWSAPI}`,
    );

    if (!resp.ok) {
        return new Response("Failed to fetch news", { status: 500 });
    }

    const data = await resp.json();

    if (!data.articles?.length) {
        return new Response("No news articles found", { status: 404 });
    }

    const validArticles: Article[] = [];
    for (const article of data.articles) {
        const parsed = ArticleSchema.safeParse(article);
        if (!parsed.success) {
            console.warn("Invalid article skipped:", parsed.error.format());
            continue;
        }
        validArticles.push(parsed.data);
    }

    // Normaliza artigos e filtra duplicados antes de inserir
    const articlesToInsert = [];
    for (const article of validArticles) {
        const publishedAt = new Date(article.publishedAt);

        const exists = await prismaClient.newspaper.findFirst({
            where: {
                title: article.title,
                author: article.author!,
                publishedAt,
            },
        });

        if (!exists) {
            articlesToInsert.push({
                title: article.title,
                description: article.description,
                url: article.url,
                urlToImage: article.urlToImage,
                publishedAt,
                content: article.content,
                source: JSON.stringify(article.source),
                author: article.author!,
            });
        }
    }

    if (articlesToInsert.length > 0) {
        await prismaClient.newspaper.createMany({
            data: articlesToInsert,
            skipDuplicates: true, // segurança extra
        });
    }

    await prismaClient.$disconnect();

    return new Response('Ok', {
        headers: { "Content-Type": "application/json" },
    });
}
