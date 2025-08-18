"use client";

import { FileText } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState, Suspense } from "react";
import { getActivities, getPosts } from "./_components/actions";
import ActivitySidebar from "./_components/activity-sidebar";
import { PostCard } from "./_components/post-card";

type PostsType = Awaited<ReturnType<typeof getPosts>>;
type ActivitiesType = Awaited<ReturnType<typeof getActivities>>;

// Custom hook para posts
function usePosts(entity?: string | null) {
	const [posts, setPosts] = useState<PostsType>([]);
	const [loading, setLoading] = useState(true);

	const fetchPosts = useCallback(async () => {
		setLoading(true);
		try {
			const resp = await getPosts(entity ? { entityId: entity } : {});
			setPosts(resp);
		} catch (error) {
			console.error("Erro ao carregar posts:", error);
		} finally {
			setLoading(false);
		}
	}, [entity]);

	useEffect(() => {
		fetchPosts();
	}, [fetchPosts]);

	return { posts, loading };
}

// Custom hook para atividades
function useActivities() {
	const [activities, setActivities] = useState<ActivitiesType>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		(async () => {
			setLoading(true);
			try {
				const data = await getActivities({});
				if (data) setActivities(data);
			} catch (error) {
				console.error("Erro ao carregar atividades:", error);
			} finally {
				setLoading(false);
			}
		})();
	}, []);

	return { activities, loading };
}

// Componente principal que usa useSearchParams
function HomePageContent() {
	const searchParams = useSearchParams();
	const entity = searchParams.get("entity");

	const { posts, loading: postsLoading } = usePosts(entity);
	const { activities, loading: activitiesLoading } = useActivities();

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
			{/* Background decorativo */}
			<div className="fixed inset-0 overflow-hidden pointer-events-none">
				<div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl"></div>
				<div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-pink-600/20 rounded-full blur-3xl"></div>
			</div>

			<div className="relative z-10 w-full max-w-6xl mx-auto">
				<main className="flex flex-col min-h-screen">
					{/* Cabeçalho melhorado */}
					<header className="sticky top-0 z-20 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/50 dark:border-slate-700/50">
						<div className="flex items-center justify-between py-6 px-6 lg:px-8">
							<div className="flex items-center space-x-3">
								<div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
									<span className="text-white font-bold text-lg">S</span>
								</div>
								<h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
									Social Feed
								</h1>
							</div>

							{entity && (
								<div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
									<span>Visualizando entidade específica</span>
								</div>
							)}
						</div>
					</header>

					{/* Conteúdo principal */}
					<div className="flex-1 px-6 lg:px-8 py-8">
						{/* Sidebar de atividades */}
						<div className="mb-8">
							{activitiesLoading ? (
								<div className="flex justify-center">
									<div className="animate-pulse flex space-x-4">
										{[...Array(5)].map((_, i) => (
											<div
												key={`activity-skeleton-${i}`}
												className="w-16 h-16 bg-slate-200 dark:bg-slate-700 rounded-full"
											></div>
										))}
									</div>
								</div>
							) : (
								<ActivitySidebar
									activities={activities}
									className="h-24 min-h-24 w-full flex gap-4 overflow-auto justify-center pb-4"
								/>
							)}
						</div>

						{/* Feed de posts */}
						<div className="max-w-3xl mx-auto space-y-8">
							{postsLoading ? (
								<div className="space-y-6">
									{[...Array(3)].map((_, i) => (
										<div key={`post-skeleton-${i}`} className="animate-pulse">
											<div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200/50 dark:border-slate-700/50">
												<div className="space-y-4">
													<div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
													<div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
													<div className="space-y-2">
														<div className="h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
														<div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
													</div>
												</div>
											</div>
										</div>
									))}
								</div>
							) : posts?.length > 0 ? (
								<div className="space-y-8">
									{posts.map((post, index) => (
										<div
											key={`post-${post.id}`}
											className="animate-in slide-in-from-bottom-4 duration-500"
											style={{ animationDelay: `${index * 100}ms` }}
										>
											<PostCard post={post} />
										</div>
									))}
								</div>
							) : (
								<div className="text-center py-16">
									<div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 rounded-full flex items-center justify-center">
										<FileText className="w-12 h-12 text-slate-400 dark:text-slate-500" />
									</div>
									<h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
										Nenhum post encontrado
									</h3>
									<p className="text-slate-600 dark:text-slate-400">
										{entity
											? "Esta entidade ainda não possui posts."
											: "Ainda não há posts no feed."}
									</p>
								</div>
							)}
						</div>
					</div>
				</main>
			</div>
		</div>
	);
}

// Componente de fallback para o Suspense
function HomePageFallback() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
			<div className="text-center">
				<div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
					<span className="text-white font-bold text-xl">S</span>
				</div>
				<h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
					Social Feed
				</h1>
				<p className="text-slate-600 dark:text-slate-400">
					Carregando...
				</p>
			</div>
		</div>
	);
}

// Componente principal com Suspense
export default function HomePage() {
	return (
		<Suspense fallback={<HomePageFallback />}>
			<HomePageContent />
		</Suspense>
	);
}














