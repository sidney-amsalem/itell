import { notFound } from "next/navigation";
import { guides } from "#content";

import { incrementViewHandler } from "@/actions/dashboard";
import { TextbookComponents } from "@/components/content-components";
import { HtmlRenderer } from "@/components/html-renderer";
import { getSession } from "@/lib/auth";
import { Condition } from "@/lib/constants";
// import "research-methods-in-psychology/src/app/guide/page.tsx"
import "../../../src/styles/globals.css"

export default async function () {
  const { user } = await getSession();
  const userCondition = Condition.STAIRS;
  const guide = guides.find((g) => g.condition === userCondition);

  if (!guide) {
    return notFound();
  }

  // Use the handler directly instead of action here because we allow
  // unauthenticated users to access this page
  incrementViewHandler(
    user?.id ?? "",
    "guide",
    {
      condition: userCondition,
    },
    "guide_page_view"
  );

  // Sidebar sections based on your markdown structure (this can be extracted dynamically)
  const sidebarLinks = [
    { name: "Getting Started", href: "#gettingStarted" },
    { name: "Making Progress in iTELL", href: "#makingProgress" },
    { name: "iTELL AI", href: "#iTellAI" },
    { name: "Dashboard", href: "#dashboard" },
    { name: "Notes and Highlights", href: "#notes" },
    { name: "Other Features", href: "#otherFeatures" },
    { name: "Others", href: "#others" }
  ];

  return (
    <>
      <div className="sidebar-container">
      <div style={{ display: "flex", minHeight: "100vh"}}>
        <div className="sidebar"
        >
          <ul className="space-y-4">
            {sidebarLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="text-black-500 hover:text-blue-700">
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div style={{ width: "75%", padding: "16px" }}>
          <h2 className="mb-4 text-balance text-center text-2xl font-extrabold tracking-tight md:text-3xl 2xl:text-4xl">
            iTELL User Guide
          </h2>
          <HtmlRenderer components={TextbookComponents} html={guide.html} />
        </div>
      </div>
      </div>
    </>
  );
}
