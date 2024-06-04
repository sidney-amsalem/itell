"use client";
import { SessionUser } from "@/lib/auth";
import { useSession } from "@/lib/auth/context";
import { PageStatus } from "@/lib/page-status";
import { isLastPage } from "@/lib/pages";
import { PageData } from "@/lib/utils";
import { Warning } from "@itell/ui/server";
import * as Sentry from "@sentry/nextjs";
import { ArrowRightIcon, CheckSquare2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { useFormStatus } from "react-dom";
import { useFormState } from "react-dom";
import { toast } from "sonner";
import { StatusButton } from "../client-components";
import { useConstructedResponse } from "../provider/page-provider";

type Props = {
	user: NonNullable<SessionUser>;
	pageStatus: PageStatus;
	page: PageData;
};

const SubmitButton = ({
	children,
	disabled,
}: { children: React.ReactNode; disabled?: boolean }) => {
	const { pending } = useFormStatus();

	return (
		<StatusButton pending={pending} disabled={disabled} className="w-44">
			{children}
		</StatusButton>
	);
};

type FormState = { finished: boolean; error: string | null };

export const SummaryFormSimple = ({ user, pageStatus, page }: Props) => {
	const { currentChunk, chunks } = useConstructedResponse((state) => ({
		currentChunk: state.currentChunk,
		chunks: state.chunks,
	}));
	const isReady = pageStatus.unlocked || currentChunk === chunks.at(-1);
	const { setUser } = useSession();
	const router = useRouter();
	const [state, action] = useFormState<FormState>(
		async (state) => {
			try {
				if (state.finished) {
					if (page.nextPageSlug) {
						router.push(page.nextPageSlug);
					}
				} else {
					const res = await fetch("/api/user", {
						method: "POST",
						body: JSON.stringify({
							userId: user.id,
							pageSlug: page.page_slug,
						}),
					});
					if (!res.ok) {
						throw new Error(await res.text());
					}
					const { nextSlug } = (await res.json()) as { nextSlug: string };
					if (isLastPage(page.page_slug)) {
						setUser({ ...user, finished: true });
						toast.info("You have finished the entire textbook!");
					} else {
						setUser({ ...user, pageSlug: nextSlug });
					}
				}
				return { finished: true, error: null };
			} catch (err) {
				Sentry.captureMessage("summary error", {
					extra: {
						msg: JSON.stringify(err),
					},
				});
				return { finished: false, error: "internal" };
			}
		},
		{ finished: pageStatus.unlocked, error: null },
	);

	if (!isReady) {
		return (
			<section className="max-w-2xl mx-auto">
				<p>Finish the entire page to move on.</p>
			</section>
		);
	}

	return (
		<section className="max-w-2xl mx-auto space-y-4">
			<p className="font-light text-lg mb-4">
				Below is a reference summary for this page. Please read it carefully to
				better understand the information presented.
			</p>
			<p>{page.referenceSummary}</p>

			<form className="flex justify-end gap-2" action={action}>
				<SubmitButton disabled={state.finished && !page.nextPageSlug}>
					{state.error && (
						<Warning>
							An internal error occurred. Please try again later.
						</Warning>
					)}
					{!state.finished ? (
						<span className="inline-flex gap-1 items-center">
							<CheckSquare2Icon className="size-4" /> Mark as completed
						</span>
					) : page.nextPageSlug ? (
						<span className="inline-flex gap-1 items-center">
							<ArrowRightIcon className="size-4" /> Go to next page
						</span>
					) : (
						<span>Textbook finished</span>
					)}
				</SubmitButton>
			</form>
		</section>
	);
};
