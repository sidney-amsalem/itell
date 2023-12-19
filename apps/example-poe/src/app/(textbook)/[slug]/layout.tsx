import { allSectionsSorted } from "@/lib/sections";
import { Button } from "@/components/client-components";
import { notFound } from "next/navigation";
import { getModuleChapters } from "@/lib/sidebar";
import { Section } from "contentlayer/generated";
import { SectionLocation } from "@/types/location";
import { PageSummary } from "@/components/summary/page-summary";
import { ArrowUpIcon, PencilIcon } from "lucide-react";
import { ModuleSidebar } from "@/components/module-sidebar";

export const generateStaticParams = async () => {
	return allSectionsSorted.map((section) => {
		return {
			slug: section.page_slug,
		};
	});
};

export const generateMetadata = ({ params }: { params: { slug: string } }) => {
	const section = allSectionsSorted.find(
		(section) => section.page_slug === params.slug,
	);
	if (section) {
		return {
			title: section.title,
			description: section.body.raw.slice(0, 100),
		};
	}
};

const AnchorLink = ({
	text,
	href,
	icon,
}: { text: string; href: string; icon: React.ReactNode }) => {
	return (
		<a href={href}>
			<Button
				size="sm"
				variant="ghost"
				className="flex items-center gap-1 mb-0 py-1"
			>
				{icon}
				{text}
			</Button>
		</a>
	);
};

export default async function ({
	children,
	params,
}: { children: React.ReactNode; params: { slug: string } }) {
	const sectionIndex = allSectionsSorted.findIndex((section) => {
		return section.page_slug === params.slug;
	});

	if (sectionIndex === -1) {
		return notFound();
	}
	const section = allSectionsSorted[sectionIndex] as Section;
	const currentLocation = section.location as SectionLocation;
	const chapters = getModuleChapters(currentLocation.module);

	const requireSummary = section.summary;
	return (
		<>
			<div className="max-w-[1440px] mx-auto grid grid-cols-12 gap-6 px-2">
				<aside className="module-sidebar col-span-2 sticky top-20 h-fit">
					<div className="sticky top-20">
						<ModuleSidebar
							chapters={chapters}
							currentPage={{
								chapter: section.location.chapter,
								section: section.location.section,
								url: section.url,
							}}
						/>
						<div className="mt-12 flex flex-col gap-2">
							{requireSummary && (
								<AnchorLink
									icon={<PencilIcon className="w-4 h-4" />}
									text="Write a summary"
									href="#page-summary"
								/>
							)}
							<AnchorLink
								icon={<ArrowUpIcon className="w-4 h-4" />}
								text="Back to top"
								href="#page-title"
							/>
						</div>
					</div>
				</aside>

				{children}
			</div>
			{requireSummary && (
				<PageSummary location={section.location} pageSlug={section.page_slug} />
			)}
		</>
	);
}
