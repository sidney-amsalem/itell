import { SiteConfig } from "@/config/site";
import { ImageResponse } from "next/og";
const size = {
	width: 1200,
	height: 630,
};
export const runtime = "edge";

export const GET = async (req: Request) => {
	const url = new URL(req.url);
	const isDashboard = url.searchParams.get("dashboard") === "true";

	const heading = url.searchParams.get("title") || SiteConfig.title;
	const footer = isDashboard
		? "Learning statistics"
		: url.searchParams.get("title") && `A chapter from "${SiteConfig.title}"`;

	const font = fetch(
		new URL("../../../public/fonts/kaisei-tokumin-bold.ttf", import.meta.url),
	).then((res) => res.arrayBuffer());

	const image = fetch(
		new URL("../../../public/images/itell.png", import.meta.url),
	).then((res) => res.arrayBuffer());
	const fontData = await font;
	const imageData = await image;
	return new ImageResponse(
		<div
			style={{
				background:
					"linear-gradient(to bottom right, #2d1b4e, #1c1c28, #1e3a5f)",
				height: "100%",
				width: "100%",
				display: "flex",
				flexDirection: "column",
				padding: "40px 40px",
			}}
		>
			<header
				style={{
					fontSize: 20,
					fontStyle: "normal",
					color: "gray",
				}}
			>
				<p>{SiteConfig.host}</p>
			</header>
			<div
				style={{
					display: "flex",
					alignItems: "center",
					gap: "40px",
				}}
			>
				<img
					width="96"
					height="96"
					// @ts-ignore
					src={imageData}
					alt="itell icon"
				/>
				<h1
					style={{
						fontSize: 60,
						whiteSpace: "pre-wrap",
						fontFamily: "Kaisei Tokumin",
						letterSpacing: "-0.05em",
						fontStyle: "normal",
						color: "white",
					}}
				>
					{heading}
				</h1>
			</div>
			{isDashboard && (
				<img
					height="250"
					style={{ marginTop: "auto", width: "100%" }}
					// @ts-ignore
					src={
						await fetch(
							new URL("../../../public/images/chart.png", import.meta.url),
						).then((res) => res.arrayBuffer())
					}
					alt="example line chart"
				/>
			)}
			<footer
				style={{
					display: "flex",
					color: "white",
					marginTop: "auto",
				}}
			>
				<p>{footer}</p>
				<p
					style={{
						marginLeft: "auto",
					}}
				>
					An intelligent textbook by LearLab
				</p>
			</footer>
		</div>,
		{
			...size,
			fonts: [
				{
					name: "Kaisei Tokumin",
					data: fontData,
					style: "normal",
				},
			],
		},
	);
};
