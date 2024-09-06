"use client";

import React from "react";

import { useModal } from "@/components/providers/modal-provider";
import { Button } from "@/components/ui/button";
import { WorkspacePreferencesProps } from "../page";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export const WorkspaceDeletion = ({
  profile,
  workspaces,
  currentWorkspace,
}: WorkspacePreferencesProps) => {
  const { onOpen } = useModal();

  return (
    <Card className="mt-4 bg-destructive/15 border-destructive/30 shadow-red-300">
      {workspaces.length === 1 && (
        <CardHeader className="space-y-0.5 py-3">
          <CardTitle className="text-sm tracking-[0.01em] font-medium font-mono text-destructive">
            You can&apos;t delete your last workspace. Please create a new workspace before deleting
          </CardTitle>
        </CardHeader>
      )}
      {workspaces.length > 1 && (
        <>
          <CardHeader className="space-y-0.5 py-3">
            <CardTitle className="text-destructive text-sm tracking-[0.01em] font-medium font-mono">
              Delete {currentWorkspace?.name}
            </CardTitle>
            <CardDescription className="text-[0.8rem] text-muted-foreground">
              Deleting this workspace will remove all data and cannot be undone. Please be careful.
            </CardDescription>
          </CardHeader>
          <CardFooter className="border-t border-destructive/30 bg-destructive/15 justify-between py-2">
            <p className="text-[0.8rem] text-muted-foreground">This action cannot be undone.</p>
            <Button
              onClick={() => onOpen("delete-workspace", { profile })}
              size="sm"
              variant="destructive"
              className="text-[0.8rem] h-8"
            >
              Delete
            </Button>
          </CardFooter>
        </>
      )}
    </Card>
  );
};
