"use client";

import { EntityType, type Prisma } from "@prisma/client";

type PostEntityWithEntity = Prisma.PostEntityGetPayload<{
    include: { entity: true }
}>;

export const getPostDescription = (postEntities: PostEntityWithEntity[]): string => {
    const people = postEntities.filter(
        (pe) => pe.entity.type === EntityType.PERSON,
    ).length;
    const organizations = postEntities.filter(
        (pe) => pe.entity.type === EntityType.ORGANIZATION,
    ).length;

    let description = "";
    if (people > 0) {
        description += `${people} ${people === 1 ? "pessoa citada" : "pessoas citadas"}`;
    }
    if (organizations > 0) {
        if (description) description += " e ";
        description += `${organizations} ${organizations === 1 ? "organização citada" : "organizações citadas"}`;
    }
    return description;
};
