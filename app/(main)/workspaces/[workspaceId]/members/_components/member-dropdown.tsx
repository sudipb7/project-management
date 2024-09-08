"use client";

import React from "react";
import { useAuth } from "@clerk/nextjs";
import { MemberRole } from "@prisma/client";
import { Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MemberTable } from "@/types";
import { Button } from "@/components/ui/button";

export const MemberDropdown = ({ row }: { row: Row<MemberTable> }) => {
  const member = row.original;
  const isAdmin = member.role === MemberRole.ADMIN;
  const { userId } = useAuth();
  const isLoggedInMember = userId === member.userId;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-3.5 w-3.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {isAdmin ? (
          <DropdownMenuItem onClick={() => {}} className="text-xs cursor-pointer">
            Demote to member
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={() => {}} className="text-xs cursor-pointer">
            Promote to admin
          </DropdownMenuItem>
        )}
        {!isAdmin && !isLoggedInMember && (
          <DropdownMenuItem onClick={() => {}} className="text-xs cursor-pointer">
            Remove from workspace
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
