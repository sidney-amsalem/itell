"use client";

import { useEffect, useState } from "react";
import { type Page } from "#content";

type CurrentSectionProps = {
  chunks: Page["chunks"];
};

export function CurrentSection({ chunks }: CurrentSectionProps) {
  const [currentSection, setCurrentSection] = useState<string | null>(null);

  useEffect(() => {
    let mostRecentHeading: string | null = null;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.id;
          if (entry.isIntersecting) {
            mostRecentHeading = id;
            setCurrentSection(id);
          }
        });

        // Fallback if no sections are currently intersecting
        if (
          entries
            .map((entry) => entry.isIntersecting)
            .every((isIntersecting) => !isIntersecting)
        ) {
          setCurrentSection(mostRecentHeading);
        }
      },
      {
        rootMargin: "0px 0px -70% 0px", // Adjusts the intersection trigger point
        threshold: 0.1, // Trigger when 10% of the element is visible
      }
    );

    // Safely observe each chunk and its headings
    chunks.forEach((chunk) => {
      const chunkElement = document.getElementById(chunk.slug || "");
      if (chunkElement) {
        observer.observe(chunkElement);
      }

      chunk.headings?.forEach((heading) => {
        const headingElement = document.getElementById(heading.slug || "");
        if (headingElement) {
          observer.observe(headingElement);
        }
      });
    });

    return () => {
      observer.disconnect();
    };
  }, [chunks]);

  const currentChunkTitle = chunks.find(
    (chunk) =>
      chunk.slug === currentSection ||
      chunk.headings?.some((h) => h.slug === currentSection)
  )?.title;

  const currentHeadingTitle = chunks
    .flatMap((chunk) => chunk.headings ?? [])
    .find((heading) => heading.slug === currentSection)?.title;

  return <div>{currentHeadingTitle ?? currentChunkTitle ?? ""}</div>;
}
