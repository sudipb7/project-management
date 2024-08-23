"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { Settings } from "lucide-react";

import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "./ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useModal } from "@/components/providers/modal-provider";

export const UserDropdownMenu = ({ user }: { user: any }) => {
  const { setTheme, theme } = useTheme();
  const { onOpen } = useModal();

  const themes = ["light", "dark", "system"];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="w-full h-[3.25rem] inline-flex gap-2 group">
          <span className="h-8 w-8 rouned-full relative overflow-hidden rounded-full grid place-items-center border-2 border-muted-foreground">
            {user?.image ? (
              <Image
                src={user?.image}
                alt={`${user.name}'s profile picture`}
                fill
                className="object-cover"
              />
            ) : (
              <span className="w-full h-full grid place-items-center bg-foreground text-background text-xs font-medium">
                {user?.name[0]}
              </span>
            )}
          </span>
          <span className="text-start">
            <h6 className="text-[13px] font-medium">
              {user.name.length > 20 ? user.name.slice(0, 20) + "..." : user.name}
            </h6>
            <p className="text-muted-foreground text-xs">
              {user.email.length > 24 ? user.email.slice(0, 24) + "..." : user.email}
            </p>
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" className="w-60">
        <DropdownMenuLabel className="flex flex-col">
          <span className="text-[13px] font-medium">
            {user.name.length > 20 ? user.name.slice(0, 20) + "..." : user.name}
          </span>
          <span className="text-xs text-muted-foreground">
            {user.email.length > 24 ? user.email.slice(0, 24) + "..." : user.email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link
              href={`/account/${user.id}/preferences`}
              className="flex items-center gap-2 text-xs cursor-pointer text-muted-foreground hover:text-foreground transition-all"
            >
              <Settings size={12} />
              Account preferences
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-xs">Theme</DropdownMenuLabel>
          {themes.map((t) => (
            <DropdownMenuItem
              key={t}
              onClick={() => setTheme(t)}
              className="text-xs text-muted-foreground capitalize flex items-center gap-2 cursor-pointer"
            >
              <div
                className={cn(
                  "h-2 w-2 rounded-full bg-muted-foreground",
                  t !== theme && "opacity-0"
                )}
              />
              {t}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => onOpen("logout")}
            className="text-xs cursor-pointer text-muted-foreground"
          >
            Log out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
