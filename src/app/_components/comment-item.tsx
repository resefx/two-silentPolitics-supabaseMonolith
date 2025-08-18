"use client";

import { EntityType, type Prisma } from "@prisma/client";
import AvatarEntity from "@/components/avatar_entity";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatTimeAgo } from "@/lib/formattimeago";

type CommentsWithEntity = Prisma.CommentGetPayload<{
	include: { entity: true };
}>;

interface CommentItemProps {
	comment: CommentsWithEntity;
	postId: string;
	handleVote?: (
		postId: string,
		type: "like" | "dislike",
		commentId: string,
	) => void;
}

export function CommentItem({ comment, postId, handleVote }: CommentItemProps) {
	return (
		<div className="group bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-700/50 rounded-xl p-4 border border-slate-200/50 dark:border-slate-600/50 hover:shadow-sm transition-all duration-200 hover:scale-[1.02]">
			<div className="flex items-start space-x-3">
				<Avatar
					className={
						comment.entity?.type === EntityType.PERSON
							? "h-10 w-10 ring-2 ring-slate-200 dark:ring-slate-600"
							: "h-10 w-10 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-600 ring-2 ring-slate-200 dark:ring-slate-600"
					}
				>
					<AvatarImage
						src={`/api/avatar/entity/${comment.entityId}`}
						alt={comment.entity?.name}
					/>
					<AvatarFallback>
						<AvatarEntity
							id={
								comment.entity?.name ||
								comment.commentator ||
								comment.userId ||
								comment.id
							}
						/>
					</AvatarFallback>
				</Avatar>

				<div className="flex-1 min-w-0">
					<div className="flex items-center space-x-2 mb-2">
						<span className="font-semibold text-sm text-slate-900 dark:text-white truncate">
							{comment.entity?.name ||
								comment.commentator ||
								"Usuário Desconhecido"}
						</span>
						{comment.ai && (
							<Badge variant="outline" className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700 text-xs px-2 py-0.5">
								IA
							</Badge>
						)}
						<span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-200/50 dark:bg-slate-600/50 px-2 py-0.5 rounded-full">
							{formatTimeAgo(comment.createdAt)}
						</span>
					</div>

					<div className="prose prose-slate dark:prose-invert max-w-none">
						<p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
							{comment.content}
						</p>
					</div>

					{/* Ações do comentário (comentadas por enquanto) */}
					{/* <div className="flex items-center space-x-2">
						<Button
							variant="ghost"
							size="sm"
							onClick={() => handleVote(postId, "like", comment.id)}
							className="text-green-600 hover:text-green-700 hover:bg-green-100 h-6 px-2"
						>
							<ThumbsUp className="h-3 w-3 mr-1" />
							{comment.likes}
						</Button>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => handleVote(postId, "dislike", comment.id)}
							className="text-red-600 hover:text-red-700 hover:bg-red-100 h-6 px-2"
						>
							<ThumbsDown className="h-3 w-3 mr-1" />
							{comment.dislikes}
						</Button>
					</div> */}
				</div>
			</div>
		</div>
	);
}
