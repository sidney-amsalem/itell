import React from "react";
import { cn } from "@itell/utils";
import { ScrollProgress } from "@/components/scroll-progress";

type PageNavProps = {
  leftChild: React.ReactNode;
  children: React.ReactNode;
};

export function PageNav({ leftChild, children }: PageNavProps) {
  return (
    <header 
      className={cn(
        "fixed top-0 z-50 bg-background border-b h-8 flex flex-col items-center w-full"
      )}
      style={{ marginTop: "var(--nav-height)" }}
      
    >
      <div className="flex items-center justify-between w-full h-full px-4">
        <div className="flex items-center">{leftChild}</div>
        <div className="flex-grow" />
        <div className="flex items-center gap-12">{children}</div>
      </div>
      <div className="w-full">
        <ScrollProgress />
      </div>
    </header>
  );
}

export default PageNav;
