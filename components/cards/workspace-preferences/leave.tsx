import React from "react";

import { Button } from "@/components/ui/button";
import { type WorkspacePreferencesProps } from ".";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export const WorkspaceLeave = ({ isAdmin, admins }: WorkspacePreferencesProps) => {
  return (
    <Card className="mt-4">
      <CardHeader className="space-y-0.5 py-3">
        <CardTitle className="text-sm tracking-[0.01em] font-medium font-mono">
          Leave Workspace
        </CardTitle>
        <CardDescription className="text-[13px]">
          Revoke your access to this Workspace. Any resources you&apos;ve added to the Workspace
          will remain.
        </CardDescription>
      </CardHeader>
      <CardFooter className="border-t py-2 justify-between">
        {isAdmin && admins.length === 1 ? (
          <p className="text-[13px] text-muted-foreground">
            To leave this Workspace, ensure at least one more Member has the Admin role.
          </p>
        ) : (
          <>
            <p className="text-[13px] text-muted-foreground">
              You can rejoin this Workspace at any time.
            </p>
            <Button size="sm" className="text-[13px] h-8">
              Leave
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};
