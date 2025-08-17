"use client";

import { EntityType } from "@prisma/client";
import AvatarEntity from "./avatar_entity";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

interface Activity {
	entityId: string;
	entity: {
		type: EntityType;
		name: string;
	};
}

export default function AvatarBlock({
	activity,
	size = "g",
}: {
	activity: Activity;
	size?: "p" | "g";
}) {
	const sizeClass = size === "p" ? "h-8 w-8" : "h-15 w-15";

	return (
		<Tooltip>
			<TooltipTrigger className="w-full h-full">
				<Avatar
					className={
						activity.entity.type === EntityType.PERSON
							? sizeClass
							: `${sizeClass} rounded-lg overflow-hidden bg-gray-200`
					}
				>
					<AvatarImage
						src={`/api/avatar/entity/${activity.entityId}`}
						alt={activity.entity.name}
					/>
					<AvatarFallback className="rounded-none">
						{activity.entity.type === EntityType.PERSON ? (
							<AvatarEntity id={activity.entity.name} />
						) : (
							activity.entity.name.charAt(0) + activity.entity.name.charAt(1)
						)}
					</AvatarFallback>
				</Avatar>
			</TooltipTrigger>
			<TooltipContent>
				<p>{activity.entity.name}</p>
			</TooltipContent>
		</Tooltip>
	);
}
