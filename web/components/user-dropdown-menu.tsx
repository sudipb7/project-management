import React from "react";
import Link from "next/link";
import Image from "next/image";

import { Button } from "./ui/button";

export const UserDropdownMenu = ({ user }: { user: any }) => {
  return (
    <Button asChild variant="ghost" size="sm">
      <Link href={`/users/${user?.id}/preferences`} className="w-full h-12 inline-flex gap-2 group">
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
        <span>
          <h6 className="text-[13px] font-medium">
            {user.name.length > 18 ? user.name.slice(0, 18) + "..." : user.name}
          </h6>
          <p className="text-muted-foreground text-xs">
            {user.email.length > 20 ? user.email.slice(0, 20) + "..." : user.email}
          </p>
        </span>
      </Link>
    </Button>
  );
};
