import { EntityType, type Prisma } from "@prisma/client";
import AvatarEntity from "@/components/avatar_entity";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type PostEntityWithEntity = Prisma.PostEntityGetPayload<{
	include: { entity: true };
}>;

interface FloatingMentionsProps {
	postEntities: PostEntityWithEntity[];
}

export function FloatingMentions({ postEntities }: FloatingMentionsProps) {
	return (
		<div className="absolute -top-6 left-20 transform -translate-x-1/2 z-10">
			<div className="flex items-center space-x-2 bg-white rounded-full px-5 py-3 shadow-lg border">
				{postEntities.map((pe) => (
					<div key={pe.id} className="relative">
						<Avatar
							className={
								pe.entity.type === EntityType.PERSON
									? "h-8 w-8 border-2 border-white"
									: "h-8 w-8 rounded-md overflow-hidden bg-gray-200 border-2 border-white"
							}
						>
							{/* <AvatarImage
								src={`/api/avatar/entity/${pe.entityId}`}
								alt={`avatar ${pe.entity.name}`}
							/> */}
							<AvatarFallback className="text-xs">
								<AvatarEntity id={pe.entity.name} />
							</AvatarFallback>
						</Avatar>
					</div>
				))}
			</div>
		</div>
	);
}
