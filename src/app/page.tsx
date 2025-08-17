"use client";

import { useEffect, useState } from "react";
import { getActivities, getPosts } from "./_components/actions";
import ActivitySidebar from "./_components/activity-sidebar";
import { PostCard } from "./_components/post-card";

export default function HomePage() {
	const [posts, setPosts] = useState<Awaited<ReturnType<typeof getPosts>>>([]);
	const [activities, setActivities] = useState<
		Awaited<ReturnType<typeof getActivities>>
	>([]);

	useEffect(() => {
		async function fetchPost() {
			const resp = await getPosts({});
			setPosts(resp);
		}

		fetchPost();
	}, []);

	useEffect(() => {
		async function fetchActivities() {
			const data = await getActivities({});
			if (data) setActivities(data);
		}

		fetchActivities();
	}, []);

	return (
		<div className="w-screen h-screen overflow-hidden flex flex-row">
			<div className="overflow-auto p-10 w-full">
				<div className="p-4 space-y-8">
					<div className="text-center py-4">
						<h1 className="text-2xl font-bold text-gray-900">Feed Social</h1>
					</div>
					<div className="space-y-8">
						{posts?.map((post) => (
							<PostCard post={post} key={post.id} />
						))}
					</div>
				</div>
			</div>
			<ActivitySidebar
				activities={activities}
				className="w-20 min-w-20 bg-gray-300"
			/>
		</div>
	);
}
