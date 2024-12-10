import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Elements } from "@itell/constants";
import { PageTitle } from "@itell/ui/page-title";
import { ScrollArea } from "@itell/ui/scroll-area";
import { ChatLoader } from "@textbook/chat-loader";
import { EventTracker } from "@textbook/event-tracker";
import { NoteCount } from "@textbook/note/note-count";
import { NoteLoader } from "@textbook/note/note-loader";
import { PageAssignments } from "@textbook/page-assignments";
import { PageContent } from "@textbook/page-content";
import { PageInfo } from "@textbook/page-info";
import { PageStatusModal } from "@textbook/page-status-modal";
import { PageToc } from "@textbook/page-toc";
import { Pager } from "@textbook/pager";
import { QuestionControl } from "@textbook/question/question-control";
import { SelectionPopover } from "@textbook/selection-popover";
import { getPagesWithStatus, TextbookTocList, PageControl} from "@textbook/textbook-toc";

import { TextbookToc } from "@textbook/textbook-toc";
import { PageNav } from "@textbook/page-nav";
import { CurrentSection } from "@textbook/current-section";

import { MobilePopup } from "@/components/mobile-popup";
import { PageProvider } from "@/components/provider/page-provider";
import { Sidebar, SidebarLayout, SidebarFooter, SidebarItem, SidebarTrigger, SidebarContent} from "@/components/sidebar";

import { getSession } from "@/lib/auth";
import { getUserCondition } from "@/lib/auth/conditions";
import { Condition, isProduction } from "@/lib/constants";
import { routes } from "@/lib/navigation";
import { getPageStatus } from "@/lib/page-status";
import { getPage } from "@/lib/pages/pages.server";

export default async function Page(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const { slug } = routes.textbook.$parseParams(params);
  const { user } = await getSession();
  const page = getPage(slug);

  if (!page) {
    return notFound();
  }

  const pageSlug = page.slug;

  const userId = user?.id ?? null;
  const userFinished = user?.finished ?? false;
  const userPageSlug = user?.pageSlug ?? null;
  const userCondition = user
    ? getUserCondition(user, pageSlug)
    : Condition.STAIRS;
  const pageStatus = getPageStatus({
    pageSlug,
    userPageSlug,
    userFinished,
  });

  return (
    <PageProvider condition={userCondition} page={page} pageStatus={pageStatus}>
      <SidebarLayout defaultOpen>

       <PageNav
          leftChild={<CurrentSection chunks={page.chunks} />}
        >
          <PageInfo pageSlug={pageSlug} user={user} />
          <NoteCount />
        </PageNav>
        <div className="fixed z-50 ml-3 mt-20 pt-9">
          <SidebarTrigger/>
        </div>

        <main
          id={Elements.TEXTBOOK_MAIN_WRAPPER}
          className="mx-auto max-w-[1800px]"
          style={{gridTemplateColumns: "1fr 6fr 1fr", paddingTop: "50px", maxWidth: "1150px"}}
        >
          <div> </div>
          <Sidebar className="sidebar h-screen">
            <SidebarContent className="flex flex-col h-full" >
              <div id={Elements.TEXTBOOK_NAV} style={{borderRightWidth: "0px", paddingLeft: "10px"}}>
                <SidebarItem className="mb-auto">
                  <TextbookTocList page={page} pages={getPagesWithStatus(userPageSlug, userFinished)} />
                </SidebarItem>
              </div>
            </SidebarContent>
            <SidebarFooter className="h-30">
              <PageControl assignment={page.summary} pageSlug={page.slug} />
            </SidebarFooter>
          </Sidebar>


          <MobilePopup />

          <div id={Elements.TEXTBOOK_MAIN} tabIndex={-1}>
            <PageTitle className="mb-8 pt-10 mt-10">{page.title}</PageTitle>
            <PageContent title={page.title} html={page.html} />
            {user && page.summary ? (
              <PageAssignments
                pageSlug={pageSlug}
                pageStatus={pageStatus}
                user={user}
                condition={userCondition}
              />
            ) : null}
            <SelectionPopover user={user} pageSlug={pageSlug} />
            <Pager pageIndex={page.order} userPageSlug={user?.pageSlug ?? null} />
            <p className="mt-4 text-right text-sm text-muted-foreground">
              <span>Last updated at </span>
              <time>{page.last_modified}</time>
            </p>
          </div>
        </main>

        <Suspense fallback={<ChatLoader.Skeleton />}>
          <ChatLoader user={user} pageSlug={pageSlug} pageTitle={page.title} />
        </Suspense>

        {user ? <NoteLoader pageSlug={pageSlug} /> : null}
        

        {isProduction ? (
          <PageStatusModal user={user} pageStatus={pageStatus} />
        ) : null}
        <QuestionControl
          userId={userId}
          pageSlug={pageSlug}
          hasAssignments={page.assignments.length > 0}
          condition={userCondition}
        />
        {user ? <EventTracker pageSlug={pageSlug} /> : null}
      </SidebarLayout>
    </PageProvider>
  );
}
