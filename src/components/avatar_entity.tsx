"use client";
import Avatar, { genConfig } from "react-nice-avatar";

export default function AvatarEntity({ id }: { id: string }) {
	const config = genConfig(id);
	return <Avatar shape="square" className="w-full h-full" {...config} />;
}
