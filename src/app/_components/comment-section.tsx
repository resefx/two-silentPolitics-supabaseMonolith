import type { Prisma } from "../../../generated/prisma";
import { CommentItem } from "./comment-item";

type CommentsWithEntity = Prisma.CommentGetPayload<{
	include: { entity: true };
}>;

interface CommentSectionProps {
	comments: CommentsWithEntity[];
	postId: string;
	handleVote: (
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
			{/* Linha conectora */}
			<div className="absolute -left-4 top-0 bottom-0 w-0.5 bg-gray-300"></div>
			<div className="absolute -left-6 top-4 w-4 h-0.5 bg-gray-300"></div>

			<div className="space-y-3">
				{comments.slice(0, 3).map((comment) => (
					<CommentItem
						key={comment.id}
						comment={comment}
						postId={postId}
						handleVote={handleVote}
					/>
				))}
			</div>
		</div>
	);
}
