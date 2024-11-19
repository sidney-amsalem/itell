"use client";

import { startTransition, useOptimistic, useState } from "react";
import { Elements } from "@itell/constants";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@itell/ui/accordion";
import { type Page } from "#content";

import { type TocPagesWithStatus } from ".";
import { TocItem } from "./toc-item";

type Props = {
  page: Page;
  pages: TocPagesWithStatus;
};

export function TextbookTocList({ page, pages }: Props) {
  const [activePage, setActivePage] = useOptimistic(page.slug);
  const [openItem, setOpenItem] = useState<string | undefined>(undefined); 
  return (
    <nav aria-label="textbook primary">
      <a className="sr-only" href={`#${Elements.TEXTBOOK_MAIN}`}>
        skip to main content
      </a>
      <ol
        aria-label="list of chapters"
        className="leading-relaxed tracking-tight"
      >
        {pages.map((item) => {
          if (!item.group) {
            return (
              <TocItem
                key={item.slug}
                inGroup={false}
                onClick={(slug) => {
                  startTransition(() => {
                    setActivePage(slug);
                  });
                }}
                activePage={activePage}
                item={item}
              />
            );
          }

          return (
            <Accordion
              type="single"
              collapsible
              value={openItem}
              onValueChange={setOpenItem}
              key={item.title}
              defaultValue={page.parent?.slug}
              className="pb-0"
            >
              <AccordionItem value={item.slug} className="border-none">
                <AccordionTrigger className="px-2 py-4 text-left text-base hover:bg-accent hover:no-underline lg:text-sm 2xl:text-lg"> {/*Change here*/}
                  {item.title}
                </AccordionTrigger>
                <AccordionContent className="pb-0">
                  {item.pages.map((p) => (
                    <TocItem
                      key={p.slug}
                      onClick={() => {
                        startTransition(() => {
                          setActivePage(p.slug);
                        });
                      }}
                      item={p}
                      inGroup
                      activePage={activePage}
                    />
                  ))}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          );
        })}
      </ol>
    </nav>
  );
}
