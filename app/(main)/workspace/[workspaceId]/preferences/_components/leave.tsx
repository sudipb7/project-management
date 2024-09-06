"use client";

import React from "react";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { WorkspacePreferencesProps } from "../page";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export const WorkspaceLeave = ({
  isAdmin,
  admins,
  members,
  profile,
  currentWorkspace,
  workspaces,
}: WorkspacePreferencesProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleLeave = async () => {
    try {
      setIsLoading(true);
      if (!profile) {
        throw new Error("Unauthorized");
      }

      if (workspaces.length === 1) {
        throw new Error("You cannot leave the workspace as it is the only workspace you are in.");
      }

      const currentMember = members.find((member) => member.profileId === profile.id);
      if (!currentMember) {
        throw new Error("Unauthorized");
      }

      if (currentMember.role === "ADMIN") {
        throw new Error("You cannot leave the workspace as you are an admin.");
      }

      if (members.length === 1) {
        throw new Error("You cannot leave the workspace as you are the only member.");
      }

      await axios.delete(`/api/workspaces/${currentWorkspace.id}/leave`, {
        data: { memberId: currentMember.id },
      });

      toast.success("You have left the workspace.");
      router.push("/workspace");

      router.refresh();
    } catch (error: AxiosError | any) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data);
      } else {
        toast.error(error?.message || "Failed to update workspace name.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mt-4">
      <CardHeader className="space-y-0.5 py-3">
        <CardTitle className="text-sm tracking-[0.01em] font-medium font-mono">
          Leave Workspace
        </CardTitle>
        <CardDescription className="text-[0.8rem]">
          Revoke your access to this Workspace. Any resources you&apos;ve added to the Workspace
          will remain.
        </CardDescription>
      </CardHeader>
      <CardFooter className="border-t py-2 justify-between">
        {isAdmin && admins.length === 1 ? (
          <p className="text-[0.8rem] text-muted-foreground">
            To leave this Workspace, ensure at least one more Member has the Admin role.
          </p>
        ) : (
          <>
            <p className="text-[0.8rem] text-muted-foreground">
              You can rejoin this Workspace at any time.
            </p>
            <Button
              disabled={isLoading}
              onClick={handleLeave}
              size="sm"
              className="text-[0.8rem] h-8"
            >
              {isLoading ? <Loader className="h-[13px] w-[13px] animate-spin" /> : "Leave"}
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};
