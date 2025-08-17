import { PostScope, type Prisma } from "@prisma/client";
import { Card, CardContent } from "@/components/ui/card";
import { formatTimeAgo } from "@/lib/formattimeago";
import { getPostDescription } from "@/lib/getpostdescription";
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
		<div className="relative">
			{post.scope !== PostScope.PLATFORM && post.PostEntity.length > 0 && (
				<FloatingMentions postEntities={post.PostEntity} />
			)}

			{/* Container dos dois quadrados */}
			<div className="space-y-4 pt-4">
				{/* Quadrado do Post */}
				<Card className="w-full">
					<CardContent className="p-6">
						{/* Descrição das citações */}
						<div className="mb-4">
							<p className="text-sm text-gray-600 font-medium">
								{getPostDescription(post.PostEntity)}
							</p>
							<p className="text-xs text-gray-400">
								{formatTimeAgo(post.createdAt)}
							</p>
						</div>

						<h2 className=" font-bold p-3">{post.title}</h2>

						{/* Conteúdo do Post */}
						<p className="text-gray-900 mb-4">{post.content}</p>

						{/* <PostActions
							postId={post.id}
							likes={post.likes}
							dislikes={post.dislikes}
							commentsLength={post.comments.length}
							handleVote={handleVote}
						/> */}
					</CardContent>
				</Card>

				{/* Comentários - com espaço lateral */}
				{/* <CommentSection
					comments={post.comments}
					postId={post.id}
					handleVote={handleVote}
				/> */}
			</div>
		</div>
	);
}
