"use client";
import { useEditor } from "@/app/home-provider";
import {
	Label,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@itell/ui/client";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { examples } from "#content";

examples.sort((a, b) => a.order - b.order);

const options = examples.map((example) => ({
	slug: example.slug,
	title: example.title,
}));

const defaultExample = examples.find(
	(example) => example.slug === "basic-markdown",
);

const findExample = (slug: string) =>
	examples.find((example) => example.slug === slug);

export const ExampleSelect = ({ text }: { text: string | undefined }) => {
	const [slug, setSlug] = useState(() =>
		text ? undefined : defaultExample?.slug,
	);
	const { setValue } = useEditor();

	useEffect(() => {
		if (text) {
			setValue(atob(text));
		}
	}, [text]);

	useEffect(() => {
		if (slug) {
			setValue(findExample(slug)?.content || "");
		}
	}, [slug]);

	return (
		<form className="my-4">
			<Label className="flex gap-2 items-center">
				<p className="font-semibold">Example</p>
				<Select value={slug} onValueChange={setSlug}>
					<SelectTrigger className="w-[300px]">
						<SelectValue placeholder="Select an example" />
					</SelectTrigger>
					<SelectContent>
						{options.map((opt) => (
							<SelectItem key={opt.slug} value={opt.slug}>
								{opt.title}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</Label>
		</form>
	);
};
