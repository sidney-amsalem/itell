import { Elements } from "@itell/constants";
import { buttonVariants } from "@itell/ui/button";
import { cn } from "@itell/utils";
import { ArrowUpIcon, PencilIcon } from "lucide-react";

import { getSession } from "@/lib/auth";
import { isAdmin } from "@/lib/auth/role";
import { AdminTools } from "../admin-tools";
import { RestartPageButton } from "./restart-page-button";

interface LinkProps extends React.HTMLAttributes<HTMLAnchorElement> {
  text: string;
  href: string;
  icon: React.ReactNode;
}

function AnchorLink({ text, href, icon, className, ...rest }: LinkProps) {
  return (
    <a
      href={href}
      className={cn(
        buttonVariants({ variant: "ghost" }),
        "flex items-center justify-start p-2 xl:text-lg",
        className
      )}
      {...rest}
    >
      <span className="flex items-center gap-2 xl:gap-4">
        {icon}
        {text}
      </span>
    </a>
  );
}

export async function PageControl({
  assignment,
  pageSlug,
}: {
  assignment: boolean;
  pageSlug: string;
}) {
  const { user } = await getSession();
  return (
    <div className="mt-auto space-y-2">
      <p className="sr-only">page control</p>
      {user && isAdmin(user.role) ? (
        <AdminTools user={user} pageSlug={pageSlug} />
      ) : null}
      {assignment ? (
        <AnchorLink
          icon={<PencilIcon className="size-4 xl:size-4" />}
          text={<span className="text-sm">Assignment</span>}          
          href={`#${Elements.PAGE_ASSIGNMENTS}`}
          aria-label="assignments for this page"
        />
      ) : null}
      <RestartPageButton pageSlug={pageSlug} />

      <AnchorLink
        icon={<ArrowUpIcon className="size-4 xl:size-4" />}
        text={<span className="text-sm">Back to top</span>}          
        href={`#${Elements.PAGE_TITLE}`}
      />
    </div>
  );
}
