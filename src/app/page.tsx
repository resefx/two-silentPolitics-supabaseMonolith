"use client";

import {
	MessageCircle,
	MoreHorizontal,
	Send,
	Share2,
	ThumbsDown,
	ThumbsUp,
} from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface User {
	id: string;
	name: string;
	avatar: string;
	type: "person" | "organization";
}

interface Comment {
	id: string;
	user: User;
	content: string;
	likes: number;
	dislikes: number;
	timestamp: string;
}

interface Post {
	id: string;
	mentionedUsers: User[];
	content: string;
	likes: number;
	dislikes: number;
	comments: Comment[];
	timestamp: string;
}

const mockUsers: User[] = [
	{
		id: "1",
		name: "Ana Silva",
		avatar: "/placeholder.svg?height=40&width=40",
		type: "person",
	},
	{
		id: "2",
		name: "João Santos",
		avatar: "/placeholder.svg?height=40&width=40",
		type: "person",
	},
	{
		id: "3",
		name: "TechCorp",
		avatar: "/placeholder.svg?height=40&width=40",
		type: "organization",
	},
	{
		id: "4",
		name: "Maria Costa",
		avatar: "/placeholder.svg?height=40&width=40",
		type: "person",
	},
	{
		id: "5",
		name: "InnovateHub",
		avatar: "/placeholder.svg?height=40&width=40",
		type: "organization",
	},
	{
		id: "6",
		name: "Carlos Lima",
		avatar: "/placeholder.svg?height=40&width=40",
		type: "person",
	},
	{
		id: "7",
		name: "StartupXYZ",
		avatar: "/placeholder.svg?height=40&width=40",
		type: "organization",
	},
];

const mockPosts: Post[] = [
	{
		id: "1",
		mentionedUsers: [mockUsers[0], mockUsers[1], mockUsers[2]], // 2 pessoas + 1 organização
		content:
			"Projeto colaborativo finalizado com sucesso! A sinergia entre as equipes foi fundamental para alcançarmos os objetivos propostos dentro do prazo estabelecido.",
		likes: 24,
		dislikes: 2,
		timestamp: "2h",
		comments: [
			{
				id: "1",
				user: mockUsers[3],
				content: "Parabéns pelo projeto! Ficou excelente.",
				likes: 5,
				dislikes: 0,
				timestamp: "1h",
			},
			{
				id: "2",
				user: mockUsers[4],
				content: "Trabalho de qualidade como sempre!",
				likes: 3,
				dislikes: 0,
				timestamp: "45min",
			},
			{
				id: "3",
				user: mockUsers[5],
				content: "Inspirador! Mal posso esperar para ver os próximos projetos.",
				likes: 7,
				dislikes: 1,
				timestamp: "30min",
			},
		],
	},
	{
		id: "2",
		mentionedUsers: [mockUsers[2], mockUsers[6]], // 1 pessoa + 1 organização
		content:
			"Nova parceria estratégica estabelecida! Estamos animados com as possibilidades que essa colaboração trará para ambas as partes.",
		likes: 45,
		dislikes: 3,
		timestamp: "4h",
		comments: [
			{
				id: "4",
				user: mockUsers[0],
				content: "Ótima oportunidade! Parabéns pela parceria.",
				likes: 8,
				dislikes: 0,
				timestamp: "3h",
			},
			{
				id: "5",
				user: mockUsers[1],
				content: "Empresa com excelente reputação no mercado.",
				likes: 12,
				dislikes: 0,
				timestamp: "2h",
			},
			{
				id: "6",
				user: mockUsers[4],
				content: "Esperamos ver grandes resultados dessa colaboração!",
				likes: 4,
				dislikes: 0,
				timestamp: "1h",
			},
		],
	},
];

export default function SocialNetworkInterface() {
	const [posts, setPosts] = useState<Post[]>(mockPosts);
	const [message, setMessage] = useState("");

	const handleVote = (
		postId: string,
		type: "like" | "dislike",
		commentId?: string,
	) => {
		setPosts((prevPosts) =>
			prevPosts.map((post) => {
				if (post.id === postId) {
					if (commentId) {
						return {
							...post,
							comments: post.comments.map((comment) =>
								comment.id === commentId
									? {
											...comment,
											[type === "like" ? "likes" : "dislikes"]:
												comment[type === "like" ? "likes" : "dislikes"] + 1,
										}
									: comment,
							),
						};
					} else {
						return {
							...post,
							[type === "like" ? "likes" : "dislikes"]:
								post[type === "like" ? "likes" : "dislikes"] + 1,
						};
					}
				}
				return post;
			}),
		);
	};

	const handleSendMessage = () => {
		if (message.trim()) {
			console.log("Mensagem enviada:", message);
			setMessage("");
		}
	};

	const getPostDescription = (mentionedUsers: User[]) => {
		const people = mentionedUsers.filter(
			(user) => user.type === "person",
		).length;
		const organizations = mentionedUsers.filter(
			(user) => user.type === "organization",
		).length;

		let description = "";
		if (people > 0) {
			description += `${people} ${people === 1 ? "pessoa citada" : "pessoas citadas"}`;
		}
		if (organizations > 0) {
			if (description) description += " e ";
			description += `${organizations} ${organizations === 1 ? "organização citada" : "organizações citadas"}`;
		}
		return description;
	};

	return (
		<div className="min-h-screen bg-gray-50 flex">
			{/* Bloco Principal - Feed */}
			<div className="flex-1 max-w-2xl mx-auto">
				<div className="p-4 space-y-8">
					{/* Header */}
					<div className="text-center py-4">
						<h1 className="text-2xl font-bold text-gray-900">Feed Social</h1>
					</div>

					{/* Posts */}
					<div className="space-y-8">
						{posts.map((post) => (
							<div key={post.id} className="relative">
								{/* Ícones Flutuantes - 50% fora, 50% em cima do post */}
								<div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-10">
									<div className="flex items-center space-x-2 bg-white rounded-full px-4 py-2 shadow-lg border">
										{post.mentionedUsers.map((user, index) => (
											<div key={user.id} className="relative">
												{user.type === "person" ? (
													<Avatar className="h-8 w-8 border-2 border-white">
														<AvatarImage
															src={user.avatar || "/placeholder.svg"}
															alt={user.name}
														/>
														<AvatarFallback className="text-xs">
															{user.name.charAt(0)}
														</AvatarFallback>
													</Avatar>
												) : (
													<div className="h-8 w-8 rounded-md overflow-hidden bg-gray-200 border-2 border-white">
														<img
															src={user.avatar || "/placeholder.svg"}
															alt={user.name}
															className="h-full w-full object-cover"
														/>
													</div>
												)}
											</div>
										))}
									</div>
								</div>

								{/* Container dos dois quadrados */}
								<div className="space-y-4 pt-4">
									{/* Quadrado do Post */}
									<Card className="w-full">
										<CardContent className="p-6">
											{/* Descrição das citações */}
											<div className="mb-4">
												<p className="text-sm text-gray-600 font-medium">
													{getPostDescription(post.mentionedUsers)}
												</p>
												<p className="text-xs text-gray-400">
													{post.timestamp}
												</p>
											</div>

											{/* Conteúdo do Post */}
											<p className="text-gray-900 mb-4">{post.content}</p>

											{/* Botões de Ação do Post */}
											<div className="flex items-center justify-between pt-4 border-t">
												<div className="flex items-center space-x-4">
													<Button
														variant="ghost"
														size="sm"
														onClick={() => handleVote(post.id, "like")}
														className="text-green-600 hover:text-green-700 hover:bg-green-50"
													>
														<ThumbsUp className="h-4 w-4 mr-1" />
														{post.likes}
													</Button>
													<Button
														variant="ghost"
														size="sm"
														onClick={() => handleVote(post.id, "dislike")}
														className="text-red-600 hover:text-red-700 hover:bg-red-50"
													>
														<ThumbsDown className="h-4 w-4 mr-1" />
														{post.dislikes}
													</Button>
													<Button variant="ghost" size="sm">
														<MessageCircle className="h-4 w-4 mr-1" />
														{post.comments.length}
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
										</CardContent>
									</Card>

									{/* Comentários - com espaço lateral */}
									<div className="ml-8 relative">
										{/* Linha conectora */}
										<div className="absolute -left-4 top-0 bottom-0 w-0.5 bg-gray-300"></div>
										<div className="absolute -left-6 top-4 w-4 h-0.5 bg-gray-300"></div>

										<div className="space-y-3">
											{post.comments.slice(0, 3).map((comment) => (
												<div
													key={comment.id}
													className="bg-gray-50 rounded-lg p-4"
												>
													<div className="flex items-start space-x-3">
														{comment.user.type === "person" ? (
															<Avatar className="h-8 w-8">
																<AvatarImage
																	src={
																		comment.user.avatar || "/placeholder.svg"
																	}
																	alt={comment.user.name}
																/>
																<AvatarFallback className="text-xs">
																	{comment.user.name.charAt(0)}
																</AvatarFallback>
															</Avatar>
														) : (
															<div className="h-8 w-8 rounded-md overflow-hidden bg-gray-200">
																<img
																	src={
																		comment.user.avatar || "/placeholder.svg"
																	}
																	alt={comment.user.name}
																	className="h-full w-full object-cover"
																/>
															</div>
														)}
														<div className="flex-1">
															<div className="flex items-center space-x-2 mb-1">
																<span className="font-medium text-sm">
																	{comment.user.name}
																</span>
																<span className="text-xs text-gray-500">
																	{comment.timestamp}
																</span>
															</div>
															<p className="text-sm text-gray-700 mb-2">
																{comment.content}
															</p>
															<div className="flex items-center space-x-2">
																<Button
																	variant="ghost"
																	size="sm"
																	onClick={() =>
																		handleVote(post.id, "like", comment.id)
																	}
																	className="text-green-600 hover:text-green-700 hover:bg-green-100 h-6 px-2"
																>
																	<ThumbsUp className="h-3 w-3 mr-1" />
																	{comment.likes}
																</Button>
																<Button
																	variant="ghost"
																	size="sm"
																	onClick={() =>
																		handleVote(post.id, "dislike", comment.id)
																	}
																	className="text-red-600 hover:text-red-700 hover:bg-red-100 h-6 px-2"
																>
																	<ThumbsDown className="h-3 w-3 mr-1" />
																	{comment.dislikes}
																</Button>
															</div>
														</div>
													</div>
												</div>
											))}
										</div>
									</div>
								</div>
							</div>
						))}
					</div>

					{/* Área de Input (Chat IA) - Parte Inferior */}
					<div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 shadow-lg">
						<div className="flex items-center space-x-2">
							<Input
								placeholder="Faça uma pergunta ou inicie uma conversa..."
								value={message}
								onChange={(e) => setMessage(e.target.value)}
								onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
								className="flex-1"
							/>
							<Button onClick={handleSendMessage} size="sm">
								<Send className="h-4 w-4" />
							</Button>
						</div>
					</div>
				</div>
			</div>

			{/* Bloco Lateral Direito - Atividades Recentes */}
			<div
				className="w-20 bg-white border-l border-gray-200 p-4"
				style={{ minWidth: "40px" }}
			>
				<div className="space-y-4">
					<div className="space-y-3">
						{mockUsers.map((user) => (
							<div key={user.id} className="flex items-center space-x-3">
								<div className="relative">
									{user.type === "person" ? (
										<Avatar className="h-10 w-10">
											<AvatarImage
												src={user.avatar || "/placeholder.svg"}
												alt={user.name}
											/>
											<AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
										</Avatar>
									) : (
										<div className="h-10 w-10 rounded-lg overflow-hidden bg-gray-200">
											<img
												src={user.avatar || "/placeholder.svg"}
												alt={user.name}
												className="h-full w-full object-cover"
											/>
										</div>
									)}
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
