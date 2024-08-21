"use client";

import React from "react";
import Image from "next/image";
import { Settings } from "lucide-react";
import { useParams } from "next/navigation";

import { getWorkSpaceById } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { SideNavigationList } from "./navigation/navigation-list";
import { UserDropdownMenu } from "./user-dropdown-menu";

export const DashboardHeader = ({ user }: { user: any }) => {
  const params = useParams();
  const [isOpen, setIsOpen] = React.useState(false);
  const [workspace, setWorkspace] = React.useState<any>(null);

  React.useEffect(() => {
    const fetchWorkspace = async () => {
      const fetchedWorkspace = await getWorkSpaceById(params.workspaceId as string);
      setWorkspace(fetchedWorkspace);
    };
    fetchWorkspace();
  }, [params.workspaceId]);

  return (
    <>
      <header className="sticky top-0 inset-x-0 z-20 border-b bg-card h-14">
        <div className="flex items-center justify-between h-full px-4 lg:px-6">
          <div
            role="button"
            onClick={() => setIsOpen(true)}
            className="h-8 w-8 rounded-full relative overflow-hidden md:hidden"
          >
            {workspace?.image ? (
              <Image
                src={workspace.image}
                alt={workspace.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <span className="w-full h-full grid place-items-center bg-muted text-white text-xs font-medium">
                {workspace?.name[0]}
              </span>
            )}
          </div>
          <div className="max-md:hidden" />
          <div className="flex items-center gap-2.5">
            <Button size="sm" variant="outline" className="h-7">
              <span className="text-[11px]">Feedback</span>
            </Button>
            <Button size="icon" variant="outline" className="h-7 w-7">
              <Settings className="h-3" />
            </Button>
          </div>
        </div>
      </header>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="left" className="w-full max-w-60 px-0 pb-3 pt-14 flex flex-col">
          <div className="flex-1">
            <SideNavigationList workspaces={[workspace]} />
          </div>
          <div className="px-2">
            <UserDropdownMenu user={user} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};
