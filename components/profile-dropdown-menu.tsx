"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { Settings } from "lucide-react";
import { Profile } from "@prisma/client";
import { SignOutButton } from "@clerk/nextjs";

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

export const ProfileDropdownMenu = ({ profile }: { profile: Profile }) => {
  const { setTheme, theme } = useTheme();
  const themes = ["light", "dark", "system"];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="w-full h-[3.25rem] inline-flex gap-2 group">
          <span className="h-8 w-8 rouned-full relative overflow-hidden rounded-full grid place-items-center border-2 border-muted-foreground">
            {profile?.image ? (
              <Image
                src={profile?.image}
                alt={`${profile.name}'s profile picture`}
                fill
                className="object-cover"
              />
            ) : (
              <span className="w-full h-full grid place-items-center bg-foreground text-background text-xs font-medium">
                {profile?.name[0]}
              </span>
            )}
          </span>
          <span className="text-start">
            <h6 className="text-[0.8rem] font-medium">
              {profile.name.length > 20 ? profile.name.slice(0, 20) + "..." : profile.name}
            </h6>
            <p className="text-muted-foreground text-xs">
              {profile.email.length > 24 ? profile.email.slice(0, 24) + "..." : profile.email}
            </p>
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" className="w-60">
        <DropdownMenuLabel className="flex flex-col">
          <span className="text-[0.8rem] font-medium">
            {profile.name.length > 20 ? profile.name.slice(0, 20) + "..." : profile.name}
          </span>
          <span className="text-xs text-muted-foreground">
            {profile.email.length > 24 ? profile.email.slice(0, 24) + "..." : profile.email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link
              href={`/account/${profile.id}/preferences`}
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
          <SignOutButton>
            <DropdownMenuItem className="text-xs cursor-pointer text-muted-foreground">
              Log out
            </DropdownMenuItem>
          </SignOutButton>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
