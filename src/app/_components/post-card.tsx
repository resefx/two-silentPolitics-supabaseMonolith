import { PostScope, type Prisma } from "@prisma/client";
import { MessageCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatTimeAgo } from "@/lib/formattimeago";
import { getPostDescription } from "@/lib/getpostdescription";
import { CommentSection } from "./comment-section";
import { FloatingMentions } from "./floating-mentions";

type PostWithPostEntity = Prisma.PostGetPayload<{
	include: {
		PostEntity: { include: { entity: true } };
		comments: { include: { entity: true } };
	};
}>;

interface PostCardProps {
	post: PostWithPostEntity;
	handleVote?: (
		postId: string,
		type: "like" | "dislike",
		commentId?: string,
	) => void;
}

export function PostCard({ post, handleVote }: PostCardProps) {
	return (
		<div className="relative group">
			{post.scope !== PostScope.PLATFORM && post.PostEntity.length > 0 && (
				<FloatingMentions postEntities={post.PostEntity} />
			)}

			{/* Container principal */}
			<div className="space-y-4">
				{/* Card do Post */}
				<Card className="w-full transition-all duration-300 hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-slate-800/50 border-slate-200/50 dark:border-slate-700/50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
					<CardContent className="p-6">
						{/* Header do post */}
						<div className="mb-6">
							{/* Descrição das citações */}
							<div className="flex items-center justify-between mb-3">
								<div className="flex items-center space-x-2">
									<div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
									<p className="text-sm font-medium text-slate-600 dark:text-slate-400">
										{getPostDescription(post.PostEntity)}
									</p>
								</div>
								<span className="text-xs text-slate-500 dark:text-slate-500 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full">
									{formatTimeAgo(post.createdAt)}
								</span>
							</div>

							{/* Título do post */}
							<h2 className="text-xl font-bold text-slate-900 dark:text-white leading-tight mb-4">
								{post.title}
							</h2>
						</div>

						{/* Conteúdo do Post */}
						<div className="prose prose-slate dark:prose-invert max-w-none">
							<p className="text-slate-700 dark:text-slate-300 leading-relaxed text-base">
								{post.content}
							</p>
						</div>

						{/* Footer do post */}
						<div className="mt-6 pt-6 border-t border-slate-200/50 dark:border-slate-700/50">
							<div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-500">
								<div className="flex items-center space-x-4">
									<span className="flex items-center space-x-1">
										<MessageCircle className="w-4 h-4" />
										<span>{post.comments.length} comentários</span>
									</span>
								</div>

								<div className="flex items-center space-x-2">
									<span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-md text-xs font-medium">
										{post.scope === PostScope.PLATFORM ? "Plataforma" : "Entidade"}
									</span>
								</div>
							</div>
						</div>

						{/* <PostActions
							postId={post.id}
							likes={post.likes}
							dislikes={post.dislikes}
							commentsLength={post.comments.length}
							handleVote={handleVote}
						/> */}
					</CardContent>
				</Card>

				{/* Comentários */}
				{post.comments.length > 0 && (
					<CommentSection comments={post.comments} postId={post.id} />
				)}
			</div>
		</div>
	);
}
