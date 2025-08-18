"use client";

import clsx from "clsx";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { HTMLAttributes } from "react";
import { useState } from "react";
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
	const [hoveredActivity, setHoveredActivity] = useState<string | null>(null);

	return (
		<nav
			{...rest}
			className={clsx(
				"flex items-center gap-4 overflow-auto h-auto flex-wrap justify-center",
				className,
			)}
		>
			{/* Botão de voltar quando há entity selecionada */}
			{entity ? (
				<div className="flex justify-center items-center mb-6 w-full">
					<Link
						href="/"
						className="group flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 hover:from-slate-200 hover:to-slate-300 dark:hover:from-slate-600 dark:hover:to-slate-500 transition-all duration-200 shadow-sm hover:shadow-md"
					>
						<ArrowLeft className="w-5 h-5 text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
					</Link>
				</div>
			) : (
				/* Lista de atividades */
				<div className="flex items-center gap-4 overflow-x-auto pb-2 w-full justify-center">
					{activities?.map((activity, index) => (
						<Link
							key={activity.id}
							href={{ pathname: "/", query: { entity: activity.entityId } }}
							className="group relative flex flex-col items-center transition-all duration-200 hover:scale-105"
							style={{ animationDelay: `${index * 100}ms` }}
							onMouseEnter={() => setHoveredActivity(activity.id)}
							onMouseLeave={() => setHoveredActivity(null)}
						>
							<div className="relative">
								<AvatarBlock activity={activity} size="g" />
								<div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-200 blur-sm"></div>
							</div>

							{/* Tooltip - aparece apenas quando hoveredActivity === activity.id */}
							{hoveredActivity === activity.id && (
								<div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs rounded opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-20">
									{activity.entity?.name || "Entidade"}
									<div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-3 border-r-3 border-t-3 border-transparent border-t-slate-900 dark:border-t-slate-100"></div>
								</div>
							)}
						</Link>
					))}
				</div>
			)}
		</nav>
	);
}
