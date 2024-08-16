import { Editor } from "@/components/editor";
import { ExampleSelect } from "@/components/example-select";
import { PageCard } from "@/components/page-card";
import { Preview } from "@/components/preview";
import { Reference } from "@/components/reference";
import { SearchStrapi } from "@/components/search-strapi";
import { Share } from "@/components/share";
import { ThemeToggle } from "@/components/theme-toggle";
import { Split } from "@/components/ui/split";
import { getPage } from "@/lib/strapi";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@itell/ui/client";
import { examples } from "#content";
import { HomeProvider } from "./home-provider";

type PageProps = {
	params: { slug: string };
	searchParams?: { [key: string]: string | string[] | undefined };
};

const defaultExample = examples.find(
	(example) => example.slug === "basic-markdown",
);

export default async function Home({ searchParams }: PageProps) {
	const id = searchParams?.page;
	const page = await getPage(Number(id));
	const placeholder = page
		? page.content.join("\n")
		: typeof searchParams?.text === "string"
			? atob(searchParams?.text)
			: undefined;

	return (
		<HomeProvider>
			<main className="flex flex-col gap-4 py-8 px-16 lg:px-32 ">
				<div className="flex justify-center gap-4 items-center">
					<h1 className="text-2xl tracking-tight font-extrabold leading-tight text-center">
						iTELL Markdown Preview
					</h1>
					<ThemeToggle />
				</div>

				{page && <PageCard title={page.title} volume={page.volume} />}

				<Tabs defaultValue="preview">
					<TabsList>
						<TabsTrigger value="preview">Preview</TabsTrigger>
						<TabsTrigger value="reference">Reference</TabsTrigger>
					</TabsList>
					<TabsContent value="preview">
						<div className="flex items-center justify-between">
							<ExampleSelect
								initialSlug={placeholder ? undefined : defaultExample?.slug}
								placeholder={placeholder}
							/>
							<div className="space-x-2">
								<SearchStrapi />
								<Share />
							</div>
						</div>
						<Split
							direction="horizontal"
							minSize={100}
							expandToMin={false}
							sizes={[50, 50]}
							gutterSize={10}
							snapOffset={30}
							className="flex gap-4"
						>
							<section aria-label="editor" className="basis-[100%]">
								<Editor />
							</section>
							<section aria-label="preview" className="basis-[100%]">
								<Preview />
							</section>
						</Split>
					</TabsContent>
					<TabsContent value="reference">
						<Reference />
					</TabsContent>
				</Tabs>
			</main>
		</HomeProvider>
	);
}
