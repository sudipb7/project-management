"use client";

import React from "react";

import { useModal } from "@/components/providers/modal-provider";
import { Button } from "@/components/ui/button";
import { type WorkspacePreferencesProps } from ".";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export const WorkspaceDeletion = ({ isAdmin, workspaces }: WorkspacePreferencesProps) => {
  const { onOpen } = useModal();

  return (
    <>
      {isAdmin && workspaces.length === 1 && (
        <Card className="mt-4 bg-destructive/85 dark:bg-destructive/20 border-destructive/50">
          <CardHeader className="space-y-0.5 py-3">
            <CardTitle className="text-sm tracking-[0.01em] font-medium font-mono text-white">
              You are about to delete your last workspace
            </CardTitle>
            <CardDescription className="text-[13px] text-secondary dark:text-muted-foreground">
              You can&apos;t delete your last workspace. Please create a new workspace before
              deleting
            </CardDescription>
          </CardHeader>
        </Card>
      )}
      {isAdmin && workspaces.length > 1 && (
        <Card className="mt-4 bg-destructive/85 dark:bg-destructive/20 border-destructive/50">
          <CardHeader className="space-y-0.5 py-3">
            <CardTitle className="text-white text-sm tracking-[0.01em] font-medium font-mono">
              Delete Workspace
            </CardTitle>
            <CardDescription className="text-[13px] text-secondary dark:text-muted-foreground">
              Deleting this workspace will remove all data and cannot be undone. Please be careful.
            </CardDescription>
          </CardHeader>
          <CardFooter className="border-t bg-white/15 border-destructive/50 dark:bg-destructive/40 justify-between py-2">
            <p className="text-[13px] text-secondary dark:text-muted-foreground">
              This action cannot be undone.
            </p>
            <Button
              onClick={() => onOpen("delete-workspace")}
              size="sm"
              variant="destructive"
              className="text-[13px] h-8"
            >
              Delete
            </Button>
          </CardFooter>
        </Card>
      )}
    </>
  );
};
