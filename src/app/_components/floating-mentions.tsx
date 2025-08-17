import type { Prisma } from "@prisma/client";
import AvatarBlock from "@/components/avata_block";

type PostEntityWithEntity = Prisma.PostEntityGetPayload<{
	include: { entity: true };
}>;

interface FloatingMentionsProps {
	postEntities: PostEntityWithEntity[];
}

export function FloatingMentions({ postEntities }: FloatingMentionsProps) {
	return (
		<div className="absolute -top-6 left-20 transform -translate-x-1/2 z-10 select-none">
			<div className="flex items-center space-x-2 bg-white rounded-full px-5 py-3 shadow-lg border">
				{postEntities.map((pe) => (
					<div key={pe.id} className="relative">
						<AvatarBlock activity={pe} size={"p"} />
					</div>
				))}
			</div>
		</div>
	);
}
