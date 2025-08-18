"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { getActivities, getPosts } from "./_components/actions";
import ActivitySidebar from "./_components/activity-sidebar";
import { PostCard } from "./_components/post-card";

type PostsType = Awaited<ReturnType<typeof getPosts>>;
type ActivitiesType = Awaited<ReturnType<typeof getActivities>>;

// Custom hook para posts
function usePosts(entity?: string | null) {
	const [posts, setPosts] = useState<PostsType>([]);

	const fetchPosts = useCallback(async () => {
		const resp = await getPosts(entity ? { entityId: entity } : {});
		setPosts(resp);
	}, [entity]);

	useEffect(() => {
		fetchPosts();
	}, [fetchPosts]);

	return posts;
}

// Custom hook para atividades
function useActivities() {
	const [activities, setActivities] = useState<ActivitiesType>([]);

	useEffect(() => {
		(async () => {
			const data = await getActivities({});
			if (data) setActivities(data);
		})();
	}, []);

	return activities;
}

export default function HomePage() {
	const searchParams = useSearchParams();
	const entity = searchParams.get("entity");

	const posts = usePosts(entity);
	const activities = useActivities();

	return (
		<div className="w-screen h-screen overflow-hidden flex">
			<main className="flex-1 flex flex-col">
				{/* Cabeçalho fixo */}
				<header className="flex items-center justify-center gap-2 py-4 px-3 border-b bg-white sticky top-0 z-10">
					<h1 className="text-2xl font-bold text-gray-900 flex-1 text-center lg:text-left">
						Feed Social
					</h1>
				</header>

				{/* Área scrollável */}
				<section className="flex-1 overflow-auto px-4 lg:px-10 py-6 space-y-10">
					<ActivitySidebar
						activities={activities}
						className="h-20 min-h-20 w-full flex gap-3 overflow-auto justify-center"
					/>

					{posts?.length > 0 ? (
						posts.map((post) => <PostCard post={post} key={post.id} />)
					) : (
						<p className="text-center text-gray-500">Nenhum post encontrado.</p>
					)}
				</section>
			</main>
		</div>
	);
}
