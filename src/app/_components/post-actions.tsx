"use client";

import {
	MessageCircle,
	MoreHorizontal,
	Share2,
	ThumbsDown,
	ThumbsUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface PostActionsProps {
	postId: string;
	likes: number;
	dislikes: number;
	commentsLength: number;
	handleVote: (postId: string, type: "like" | "dislike") => void;
}

export function PostActions({
	postId,
	likes,
	dislikes,
	commentsLength,
	handleVote,
}: PostActionsProps) {
	return (
		<div className="flex items-center justify-between pt-4 border-t">
			<div className="flex items-center space-x-4">
				<Button
					variant="ghost"
					size="sm"
					onClick={() => handleVote(postId, "like")}
					className="text-green-600 hover:text-green-700 hover:bg-green-50"
				>
					<ThumbsUp className="h-4 w-4 mr-1" />
					{likes}
				</Button>
				<Button
					variant="ghost"
					size="sm"
					onClick={() => handleVote(postId, "dislike")}
					className="text-red-600 hover:text-red-700 hover:bg-red-50"
				>
					<ThumbsDown className="h-4 w-4 mr-1" />
					{dislikes}
				</Button>
				<Button variant="ghost" size="sm">
					<MessageCircle className="h-4 w-4 mr-1" />
					{commentsLength}
				</Button>
				<Button variant="ghost" size="sm">
					<Share2 className="h-4 w-4 mr-1" />
					Compartilhar
				</Button>
			</div>
			<Button variant="ghost" size="sm">
				<MoreHorizontal className="h-4 w-4" />
			</Button>
		</div>
	);
}
