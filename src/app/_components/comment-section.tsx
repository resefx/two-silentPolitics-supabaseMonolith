import type { Prisma } from "@prisma/client";
import { MessageSquare } from "lucide-react";
import { CommentItem } from "./comment-item";

type CommentsWithEntity = Prisma.CommentGetPayload<{
	include: { entity: true };
}>;

interface CommentSectionProps {
	comments: CommentsWithEntity[];
	postId: string;
	handleVote?: (
		postId: string,
		type: "like" | "dislike",
		commentId: string,
	) => void;
}

export function CommentSection({
	comments,
	postId,
	handleVote,
}: CommentSectionProps) {
	return (
		<div className="ml-8 relative">
			{/* Linha conectora melhorada */}
			<div className="absolute -left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-slate-300 via-slate-400 to-slate-300 dark:from-slate-600 dark:via-slate-500 dark:to-slate-600"></div>
			<div className="absolute -left-6 top-4 w-4 h-0.5 bg-gradient-to-r from-slate-300 to-slate-400 dark:from-slate-600 dark:to-slate-500"></div>

			{/* Container dos comentários */}
			<div className="space-y-4">
				{/* Header dos comentários */}
				<div className="flex items-center space-x-2 mb-4">
					<MessageSquare className="w-4 h-4 text-slate-400 dark:text-slate-500" />
					<h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
						Comentários ({comments.length})
					</h3>
				</div>

				{/* Lista de comentários */}
				<div className="space-y-4">
					{comments.slice(0, 3).map((comment, index) => (
						<div
							key={comment.id}
							className="animate-in slide-in-from-left-4 duration-300"
							style={{ animationDelay: `${index * 100}ms` }}
						>
							<CommentItem
								comment={comment}
								postId={postId}
							// handleVote={handleVote}
							/>
						</div>
					))}
				</div>

				{/* Mostrar mais comentários se houver */}
				{comments.length > 3 && (
					<div className="pt-2">
						<button
							type="button"
							className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors duration-200"
						>
							Ver mais {comments.length - 3} comentários...
						</button>
					</div>
				)}
			</div>
		</div>
	);
}
