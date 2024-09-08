"use client";

import Image from "next/image";
import { InviteStatus } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";

import type { MemberTable } from "@/types";
import { MemberDropdownMenu } from "./member-dropdown-menu";

export const columns: ColumnDef<MemberTable>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell({ row }) {
      return (
        <div className="flex items-center gap-x-2">
          <div className="relative overflow-hidden rounded-full h-[25px] w-[25px]">
            {row.original.image ? (
              <Image
                src={row.original.image}
                alt={row.original.name}
                fill
                className="object-cover"
              />
            ) : (
              <span className="h-full w-full grid place-items-center bg-foreground text-background">
                {row.original.name[0].toUpperCase()}
              </span>
            )}
          </div>
          <span>{row.original.name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    id: "joinMethod",
    header: "Join Method",
    cell({ row }) {
      const invite = row.original.invites.filter(
        (invite) =>
          invite.profileId === row.original.profileId && invite.status === InviteStatus.ACCEPTED
      )[0];
      return invite ? invite.member.profile.name : "N/A";
    },
  },
  {
    accessorKey: "createdAt",
    header: "Member since",
    cell({ row }) {
      return new Date(row.original.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },
  },
  {
    id: "dropdown",
    cell: ({ row }) => <MemberDropdownMenu row={row} />,
    enableSorting: false,
    enableHiding: false,
  },
];
