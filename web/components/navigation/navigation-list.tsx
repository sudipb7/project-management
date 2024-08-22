"use client";

import React from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { Briefcase, Headphones, Home, MessageCircle, Users } from "lucide-react";

import { cn } from "@/lib/utils";

export const SideNavigationList = ({ workspaces }: { workspaces: Record<string, any> }) => {
  const params = useParams();
  const pathname = usePathname();
  const currentWorkspace = workspaces.find((workspace: any) => workspace.id === params.workspaceId);

  const links = [
    {
      href: `/workspace/${currentWorkspace?.id}`,
      label: "Home",
      Icon: Home,
    },
    {
      href: `/workspace/${currentWorkspace?.id}/chat`,
      label: "Chat",
      Icon: MessageCircle,
    },
    {
      href: `/workspace/${currentWorkspace?.id}/projects`,
      label: "Projects",
      Icon: Briefcase,
    },
    {
      href: `/workspace/${currentWorkspace?.id}/people`,
      label: "People",
      Icon: Users,
    },
    {
      href: `/workspace/${currentWorkspace?.id}/huddle`,
      label: "Huddle",
      Icon: Headphones,
    },
  ];

  return (
    <nav className="grid items-start gap-y-1 px-4 text-sm font-medium pt-0.5 transition-all">
      {links.map(({ Icon, href, label }) => {
        const isActive = pathname.includes(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary h-8 group",
              isActive ? "text-primary bg-muted hover:text-primary" : "text-muted-foreground"
            )}
          >
            <Icon className="h-4 w-4 group-hover:animate-jiggle transition-all" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
};
