"use client";

import clsx from "clsx";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { HTMLAttributes } from "react";
import AvatarBlock from "@/components/avata_block";
import type { getActivities } from "./actions";

type ActivitySidebarProps = HTMLAttributes<HTMLDivElement> & {
	activities: Awaited<ReturnType<typeof getActivities>>;
};

export default function ActivitySidebar({
	activities,
	className,
	...rest
}: ActivitySidebarProps) {
	const searchParams = useSearchParams();
	const entity = searchParams.get("entity");

	return (
		<nav
			{...rest}
			className={clsx(
				"flex items-center gap-3 overflow-auto h-auto flex-wrap",
				className,
			)}
		>
			{/* Botão de voltar quando há entity selecionada */}
			{entity ? (
				<div className="flex justify-center items-center mb-4 lg:mb-6">
					<Link
						href="/"
						className="flex items-center justify-center w-10 h-10 rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
					>
						<ArrowLeft className="w-6 h-6 text-gray-900 dark:text-gray-100" />
					</Link>
				</div>
			) : (
				/* Lista de atividades */
				activities?.map((activity) => (
					<Link
						key={activity.id}
						href={{ pathname: "/", query: { entity: activity.entityId } }}
						className="flex justify-center items-center"
					>
						<AvatarBlock activity={activity} size="g" />
					</Link>
				))
			)}
		</nav>
	);
}
