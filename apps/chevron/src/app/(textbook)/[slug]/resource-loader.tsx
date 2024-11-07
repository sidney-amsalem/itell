"use client";

import { useEffect } from "react";
import { volume } from "#content";
import { preconnect } from "react-dom";

import { env } from "@/env.mjs";
import { Condition } from "@/lib/constants";

export function ResourceLoader({ condition }: { condition: string }) {
  useEffect(() => {
    preconnect(env.NEXT_PUBLIC_API_URL);

    if (condition !== Condition.SIMPLE) {
      addStylesheet("/driver.css");
    }

    if (volume.latex) {
      addStylesheet("/katex.min.css");
    }
  }, []);

  return <></>;
}

function addStylesheet(href: string) {
  if (document.getElementById(href)) {
    return;
  }
  const link = document.createElement("link");
  link.id = href;
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
}
