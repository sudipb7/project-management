"use client";

import axios from "axios";
import React from "react";
import Image from "next/image";
import { Profile } from "@prisma/client";
import { useParams } from "next/navigation";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { WorkspaceWithMembers } from "@/types";
import { Button } from "@/components/ui/button";
import { SideNavigationList } from "./navigation/navigation-list";
import { ProfileDropdownMenu } from "./profile-dropdown-menu";
import { SideNavigationHeader } from "./navigation/navigation-header";
import { Inbox } from "lucide-react";

export const WorkspaceHeader = ({ profile }: { profile: Profile }) => {
  const params = useParams();
  const [isOpen, setIsOpen] = React.useState(false);
  const [workspaces, setWorkspaces] = React.useState<WorkspaceWithMembers[]>([]);

  React.useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const { data: fetchedWorkspaces } = await axios.get(
          `/api/workspaces/profile/${profile.id}?includeMembers=true`
        );
        setWorkspaces(fetchedWorkspaces);
      } catch (error) {
        console.error("[WorkspaceHeader]", error);
        setWorkspaces([]);
      }
    };
    fetchWorkspaces();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentWorkspace = workspaces?.find((w) => w.id === params?.workspaceId);
  const comboboxData = workspaces?.map((workspace: any) => ({
    value: workspace.id,
    label: workspace.name,
    ...workspace,
  }));

  return (
    <>
      <header className="sticky top-0 inset-x-0 z-20 border-b bg-background h-[3.75rem]">
        <div className="flex items-center justify-between h-full px-4 lg:px-6">
          <div
            role="button"
            onClick={() => setIsOpen(true)}
            className="h-8 w-8 rounded-full relative overflow-hidden md:hidden"
          >
            {currentWorkspace?.image ? (
              <Image
                src={currentWorkspace?.image}
                alt={currentWorkspace?.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <span className="w-full h-full grid place-items-center bg-foreground text-background text-xs font-medium">
                {currentWorkspace?.name[0]}
              </span>
            )}
          </div>
          <div className="max-md:hidden" />
          <div className="flex items-center gap-2.5">
            <Button size="icon" variant="outline" className="h-7 w-8">
              <Inbox className="h-3.5 w-3.5" />
            </Button>
            <Button size="sm" variant="outline" className="h-7">
              <span className="text-[11px]">Feedback</span>
            </Button>
          </div>
        </div>
      </header>
      {comboboxData?.length > 0 && (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetContent
            hideCloseBtn
            side="left"
            className="w-64 px-0 pb-2.5 pt-0.5 flex flex-col gap-2"
          >
            <SheetHeader className="sr-only">
              <SheetTitle>Workspace Navigation</SheetTitle>
              <SheetDescription>Select a workspace to navigate</SheetDescription>
            </SheetHeader>
            <SideNavigationHeader data={comboboxData} profile={profile} />
            <div className="flex-1">
              <SideNavigationList setIsOpen={setIsOpen} profile={profile} workspaces={workspaces} />
            </div>
            <div className="px-2">
              <ProfileDropdownMenu profile={profile} />
            </div>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
};
