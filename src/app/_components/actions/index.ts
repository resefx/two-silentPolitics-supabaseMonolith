"use server";

import prismaClient from "@/lib/prisma";

export async function getPosts({ page = 1, limit = 10, entityId }: { page?: number; limit?: number; entityId?: string }) {
    return await prismaClient.post.findMany({
        include: {
            comments: {
                take: 3,
                include: { entity: true },
            },
            PostEntity: {
                include: {
                    entity: true,
                },
            },
        },
        where: entityId ? {
            PostEntity: {
                some: {
                    entityId
                }
            }
        } : {},
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
            createdAt: "desc",
        },
    });
}

export async function getActivities({ page = 1, limit = 10 }: { page?: number; limit?: number }) {
    return await prismaClient.postEntity.findMany({
        include: {
            entity: true
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
            createdAt: "desc",
        },
    });
}