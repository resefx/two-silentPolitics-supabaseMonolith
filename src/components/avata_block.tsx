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
			<TooltipTrigger className="w-full h-full group">
				<Avatar
					className={
						activity.entity.type === EntityType.PERSON
							? `${sizeClass} ring-2 ring-slate-200 dark:ring-slate-600 group-hover:ring-blue-300 dark:group-hover:ring-blue-500 transition-all duration-200`
							: `${sizeClass} rounded-lg overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-600 dark:to-slate-700 ring-2 ring-slate-200 dark:ring-slate-600 group-hover:ring-blue-300 dark:group-hover:ring-blue-500 transition-all duration-200`
					}
				>
					<AvatarImage
						src={`/api/avatar/entity/${activity.entityId}`}
						alt={activity.entity.name}
						className="object-cover"
					/>
					<AvatarFallback className="rounded-none bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-600 dark:to-slate-700 text-slate-700 dark:text-slate-300 font-semibold">
						{activity.entity.type === EntityType.PERSON ? (
							<AvatarEntity id={activity.entity.name} />
						) : (
							<div className="flex items-center justify-center w-full h-full text-xs font-bold">
								{activity.entity.name.charAt(0) + activity.entity.name.charAt(1)}
							</div>
						)}
					</AvatarFallback>
				</Avatar>
			</TooltipTrigger>
			<TooltipContent className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border-slate-700 dark:border-slate-300">
				<p className="font-medium">{activity.entity.name}</p>
				<p className="text-xs opacity-75">
					{activity.entity.type === EntityType.PERSON ? "Pessoa" : "Organização"}
				</p>
			</TooltipContent>
		</Tooltip>
	);
}
