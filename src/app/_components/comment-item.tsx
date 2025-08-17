"use client";

import AvatarEntity from "@/components/avatar_entity";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatTimeAgo } from "@/lib/formattimeago";
import { EntityType, type Prisma } from "../../../generated/prisma";

type CommentsWithEntity = Prisma.CommentGetPayload<{
	include: { entity: true };
}>;

interface CommentItemProps {
	comment: CommentsWithEntity;
	postId: string;
	handleVote: (
		postId: string,
		type: "like" | "dislike",
		commentId: string,
	) => void;
}

export function CommentItem({ comment, postId, handleVote }: CommentItemProps) {
	return (
		<div className="bg-gray-50 rounded-lg p-4">
			<div className="flex items-start space-x-3">
				<Avatar
					className={
						comment.entity?.type === EntityType.PERSON
							? "h-10 w-10"
							: "h-10 w-10 rounded-lg overflow-hidden bg-gray-200"
					}
				>
					<AvatarImage
						src={`/api/avatar/entity/${comment.entityId}`}
						alt={comment.entity?.name}
					/>
					<AvatarFallback>
						<AvatarEntity
							id={comment.entity?.name || comment.userId || comment.id}
						/>
					</AvatarFallback>
				</Avatar>

				<div className="flex-1">
					<div className="flex items-center space-x-2 mb-1">
						<span className="font-medium text-sm">
							{comment.entity?.name || "Usuário Desconhecido"}
						</span>
						{comment.ai && (
							<Badge variant="outline" className="bg-blue-100 text-blue-700">
								IA
							</Badge>
						)}
						<span className="text-xs text-gray-500">
							{formatTimeAgo(comment.createdAt)}
						</span>
					</div>
					<p className="text-sm text-gray-700 mb-2">{comment.content}</p>
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
