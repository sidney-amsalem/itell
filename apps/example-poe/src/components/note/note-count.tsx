import {
	Button,
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/client-components";
import { SessionUser } from "@/lib/auth";
import db from "@/lib/db";
import { Skeleton } from "@itell/ui/server";
import pluralize from "pluralize";

type Props = {
	user: SessionUser;
	pageSlug: string;
};

// rendered by TocSidebar
export const NoteCount = async ({ user, pageSlug }: Props) => {
	if (!user) {
		return null;
	}
	const res = (await db.$queryRaw`
			SELECT COUNT(*),
					CASE WHEN note_text IS NULL THEN 'highlight' ELSE 'note' END as type
			FROM notes
			WHERE user_id = ${user.id} AND page_slug = ${pageSlug}
			GROUP BY CASE WHEN note_text IS NULL THEN 'highlight' ELSE 'note' END`) as {
		count: number;
		type: string;
	}[];

	const noteCount = res.find((r) => r.type === "note")?.count || 0;
	const highlightCount = res.find((r) => r.type === "highlight")?.count || 0;

	return (
		<HoverCard>
			<HoverCardTrigger>
				<Button variant={"link"} className="text-sm px-0 text-left">
					<span>
						{`${pluralize("note", noteCount, true)}, ${pluralize(
							"highlight",
							highlightCount,
							true,
						)}`}
					</span>
				</Button>
			</HoverCardTrigger>
			<HoverCardContent className="w-48 text-sm">
				<p>Leave a note or highlight by selecting the text</p>
			</HoverCardContent>
		</HoverCard>
	);
};

NoteCount.Skeleton = () => (
	<HoverCard>
		<HoverCardTrigger>
			<Skeleton className="w-24 h-6" />
		</HoverCardTrigger>
		<HoverCardContent className="w-48 text-sm">
			<p>Leave a note or highlight by selecting the text</p>
		</HoverCardContent>
	</HoverCard>
);
