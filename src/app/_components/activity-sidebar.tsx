"use client";

import type { ClassAttributes, HTMLAttributes, JSX } from "react";
import AvatarBlock from "@/components/avata_block";
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
			<div className="flex w-full h-full justify-center py-3">
				<div className="space-y-3">
					{props.activities?.map((activity) => (
						<div
							key={activity.entity.id}
							className="flex items-center space-x-3"
						>
							<div className="relative">
								<AvatarBlock activity={activity} size={"g"} />
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
