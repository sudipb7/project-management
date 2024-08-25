"use client";

import Image from "next/image";
import { ArrowUpDown } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

import type { ModifiedMember } from "@/types";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export const columns: ColumnDef<ModifiedMember>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell({ row }) {
      return (
        <div className="flex items-center space-x-2">
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
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="h-9"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Joined at
          <ArrowUpDown className="ml-1.5 h-3.5 w-3.5" />
        </Button>
      );
    },
    cell({ row }) {
      return new Date(row.original.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },
  },
];
