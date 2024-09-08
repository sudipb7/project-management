"use client";

import React from "react";
import { toast } from "sonner";
import { useAuth } from "@clerk/nextjs";
import axios, { AxiosError } from "axios";
import { MemberRole } from "@prisma/client";
import { Row } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { Check, MoreHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { MemberTable } from "@/types";
import { Button } from "@/components/ui/button";
import { useModal } from "@/components/providers/modal-provider";

export const MemberDropdownMenu = ({ row }: { row: Row<MemberTable> }) => {
  const router = useRouter();
  const { userId } = useAuth();
  const { onOpen } = useModal();

  const data = row.original;
  const isLoggedInMember = userId === data.userId;
  const loggedInMember = data.members.find((member) => member.profile.userId === userId);
  const isAdmin = loggedInMember?.role === MemberRole.ADMIN;

  const handleRoleChange = async (role: MemberRole) => {
    try {
      if (!isAdmin) {
        throw new Error("Unauthorized");
      }

      if (role === data.role) {
        return;
      }

      await axios.patch(`/api/workspaces/${data.workspaceId}/roles`, {
        adminId: loggedInMember?.id,
        memberId: data.id,
        role,
      });

      toast.success("Role updated successfully.");

      router.refresh();
    } catch (error: AxiosError | any) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data);
      } else {
        toast.error(error?.message || "Failed to update workspace name.");
      }
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-3.5 w-3.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={() => router.push(`/profile/${data.profileId}`)}
          className="text-xs cursor-pointer"
        >
          Profile
        </DropdownMenuItem>
        {isAdmin && (
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="text-xs cursor-pointer">
              Roles
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem
                  onClick={() => handleRoleChange(MemberRole.MEMBER)}
                  className="text-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Check
                    className={cn("h-3.5 w-3.5", data.role === MemberRole.ADMIN && "opacity-0")}
                  />{" "}
                  MEMBER
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleRoleChange(MemberRole.ADMIN)}
                  className="text-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Check
                    className={cn("h-3.5 w-3.5", data.role !== MemberRole.ADMIN && "opacity-0")}
                  />{" "}
                  ADMIN
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        )}
        {isAdmin && !isLoggedInMember && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() =>
                onOpen("kick-member", {
                  workspaceId: data.workspaceId,
                  memberId: data.id,
                  adminId: loggedInMember?.id,
                  name: data.name,
                })
              }
              className="text-destructive focus:bg-destructive/15 focus:text-destructive text-xs cursor-pointer"
            >
              Kick {data.name}
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
