"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
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
	const searchParams = useSearchParams();
	const entity = searchParams.get("entity");

	return (
		<div {...props}>
			{entity && (
				<div className="flex justify-center items-center mb-4 lg:mb-6">
					<Link
						href="/"
						className="flex items-center justify-center w-10 h-10 rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
					>
						<ArrowLeft className="w-6 h-6 text-gray-900 dark:text-gray-100" />
					</Link>
				</div>
			)}

			{!entity &&
				props.activities?.map((activity) => (
					<Link
						key={activity.id}
						href={{ pathname: "/", query: { entity: activity.entityId } }}
					>
						<div className="flex justify-center items-center">
							<div className="relative">
								<AvatarBlock activity={activity} size="g" />
							</div>
						</div>
					</Link>
				))}
		</div>
	);
}
