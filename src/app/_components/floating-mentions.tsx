"use client";

import type { Prisma } from "@prisma/client";
import Link from "next/link";
import { useState } from "react";
import AvatarBlock from "@/components/avata_block";

type PostEntityWithEntity = Prisma.PostEntityGetPayload<{
	include: { entity: true };
}>;

interface FloatingMentionsProps {
	postEntities: PostEntityWithEntity[];
}

export function FloatingMentions({ postEntities }: FloatingMentionsProps) {
	const [hoveredEntity, setHoveredEntity] = useState<string | null>(null);

	return (
		<div className="absolute -top-4 left-20 transform -translate-x-1/2 z-10 select-none animate-in slide-in-from-top-4 duration-500">
			<div className="flex items-center space-x-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-full px-4 py-2 shadow-xl border border-slate-200/50 dark:border-slate-600/50 hover:shadow-2xl transition-all duration-300 hover:scale-105">
				{/* Indicador visual */}
				<div className="w-1.5 h-1.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse"></div>

				{/* Texto indicativo */}
				<span className="text-xs font-medium text-slate-600 dark:text-slate-400 mr-1">
					Mencionado em:
				</span>

				{/* Avatares das entidades */}
				<div className="flex items-center space-x-1">
					{postEntities.map((pe, index) => (
						<Link
							key={pe.id}
							href={{ pathname: "/", query: { entity: pe.entityId } }}
							className="group relative"
							onMouseEnter={() => setHoveredEntity(pe.id)}
							onMouseLeave={() => setHoveredEntity(null)}
						>
							<div
								className="relative transition-all duration-200 hover:scale-110"
								style={{ animationDelay: `${index * 50}ms` }}
							>
								<AvatarBlock activity={pe} size={"p"} />
								<div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-200 blur-sm"></div>
							</div>

							{/* Tooltip - aparece apenas quando hoveredEntity === pe.id */}
							{hoveredEntity === pe.id && (
								<div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs rounded opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-20">
									{pe.entity?.name || "Entidade"}
									<div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-3 border-r-3 border-t-3 border-transparent border-t-slate-900 dark:border-t-slate-100"></div>
								</div>
							)}
						</Link>
					))}
				</div>
			</div>
		</div>
	);
}
