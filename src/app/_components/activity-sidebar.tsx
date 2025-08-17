"use client";

import { EntityType } from "@prisma/client";
import type { ClassAttributes, HTMLAttributes, JSX } from "react";
import AvatarEntity from "@/components/avatar_entity";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { getActivities } from "./actions";

export default function ActivitySidebar(
	props: JSX.IntrinsicAttributes &
		ClassAttributes<HTMLDivElement> &
		HTMLAttributes<HTMLDivElement> & {
			activities: Awaited<ReturnType<typeof getActivities>>;
		},
) {
	return (
		<div {...props}>
			<div className="space-y-4 py-2 flex justify-center">
				<div className="space-y-3">
					{props.activities?.map((activity) => (
						<div
							key={activity.entity.id}
							className="flex items-center space-x-3"
						>
							<div className="relative">
								<Avatar
									className={
										activity.entity.type === EntityType.PERSON
											? "h-15 w-15"
											: "h-15 w-15 rounded-lg overflow-hidden bg-gray-200"
									}
								>
									<AvatarImage
										src={`/api/avatar/entity/${activity.entityId}`}
										alt={activity.entity.name}
									/>
									<AvatarFallback>
										<AvatarEntity id={activity.entity.name} />
									</AvatarFallback>
								</Avatar>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
