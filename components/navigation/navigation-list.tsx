"use client";

import React from "react";
import Link from "next/link";
import { Profile } from "@prisma/client";
import { useParams, usePathname } from "next/navigation";
import { Briefcase, Headphones, Home, MessageCircle, Settings, Users } from "lucide-react";

import { cn } from "@/lib/utils";
import { WorkspaceWithMembers } from "@/types";

interface SideNavigationListProps {
  profile: Profile;
  workspaces: WorkspaceWithMembers[];
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SideNavigationList = ({ profile, workspaces, setIsOpen }: SideNavigationListProps) => {
  const params = useParams();
  const pathname = usePathname();
  const currentWorkspace = workspaces.find(
    (workspace: any) => workspace.id === params?.workspaceId
  );

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
      comingSoon: true,
    },
    {
      href: `/workspace/${currentWorkspace?.id}/members`,
      label: "Members",
      Icon: Users,
    },
    {
      href: `/workspace/${currentWorkspace?.id}/huddle`,
      label: "Huddle",
      Icon: Headphones,
      comingSoon: true,
    },
    {
      href: `/workspace/${currentWorkspace?.id}/preferences`,
      label: "Preferences",
      Icon: Settings,
    },
  ];

  return (
    <nav className="grid items-start gap-y-1 px-4 text-sm font-medium pt-0.5 transition-all">
      {links.map(({ Icon, href, label, comingSoon }) => {
        const isActive = label === "Home" ? pathname === href : pathname?.includes(href);
        return (
          <Link
            key={href}
            href={href}
            {...(setIsOpen && { onClick: () => setTimeout(() => setIsOpen?.(false), 100) })}
            className={cn(
              "relative flex items-center gap-3 rounded-lg px-3 py-2 transition-all h-8 group",
              isActive ? "text-primary bg-muted" : "text-muted-foreground"
            )}
          >
            <Icon className="h-4 w-4 group-hover:animate-jiggle transition-all" />
            {label}{" "}
            {comingSoon && (
              <span className="bg-foreground text-background text-[9px] font-mono px-1.5 rounded-full">
                Coming soon
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
};
