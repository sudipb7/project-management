"use client";

import React from "react";
import Image from "next/image";
import { useParams } from "next/navigation";

import { getUserWorkspaces } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { SideNavigationList } from "./navigation/navigation-list";
import { UserDropdownMenu } from "./user-dropdown-menu";
import { SideNavigationHeader } from "./navigation/navigation-header";

export const WorkspaceHeader = ({ user }: { user: any }) => {
  const params = useParams();
  const [isOpen, setIsOpen] = React.useState(false);
  const [workspaces, setWorkspaces] = React.useState<any[]>([]);

  React.useEffect(() => {
    const fetchWorkspaces = async () => {
      const fetchedWorkspaces = await getUserWorkspaces(user.id, { includeMembers: true });
      setWorkspaces(fetchedWorkspaces);
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
            <Button size="sm" variant="outline" className="h-7">
              <span className="text-[11px]">Feedback</span>
            </Button>
            {
              // TODO: Add more buttons here
            }
          </div>
        </div>
      </header>
      {comboboxData?.length > 0 && (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetContent side="left" className="w-64 px-0 pb-3 pt-10 flex flex-col gap-2">
            <SideNavigationHeader data={comboboxData} />
            <div className="flex-1">
              <SideNavigationList user={user} workspaces={workspaces} />
            </div>
            <div className="px-2">
              <UserDropdownMenu user={user} />
            </div>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
};
