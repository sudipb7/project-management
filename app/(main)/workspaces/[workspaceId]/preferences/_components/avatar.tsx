"use client";

import React from "react";
import axios, { AxiosError } from "axios";
import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { WorkspacePreferencesProps } from "../page";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const WorkspaceImage = ({
  isAdmin,
  currentWorkspace,
  profile,
}: WorkspacePreferencesProps) => {
  const router = useRouter();

  const updateImage = async (file: File) => {
    try {
      const adminId = profile.id;
      if (!adminId || !isAdmin) {
        throw new Error("Unauthorized");
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileType", file.type);

      await axios.post(`/api/workspaces/${currentWorkspace.id}/avatar`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Workspace avatar updated successfully.");
      router.refresh();
    } catch (error: AxiosError | any) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data);
      } else {
        toast.error(error?.message || "Failed to update wporkspace avatar.");
      }
    }
  };

  const createInput = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        await updateImage(file);
      } else return;
    };
    input.click();
  };

  return (
    <Card className="mt-4">
      <div className="flex items-center justify-between">
        <CardHeader className="space-y-0.5 py-3">
          <CardTitle className="text-sm tracking-[0.01em] font-medium font-mono">
            Workspace Avatar
          </CardTitle>
          <CardDescription className="text-[0.8rem]">
            This is your workspace&apos;s avatar.
            <br />
            {isAdmin
              ? "Click on the avatar to upload a custom one from your files."
              : " You don't have permission to change the avatar."}
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-0">
          <div
            onClick={createInput}
            className="h-12 w-12 md:w-16 md:h-16 relative overflow-hidden rounded-full bg-foreground grid place-items-center"
          >
            {currentWorkspace.image ? (
              <Image
                src={currentWorkspace.image}
                alt="Your workspace avatar"
                fill
                className="object-cover"
              />
            ) : (
              <span className="text-background font-medium text-lg md:text-xl">
                {currentWorkspace.name[0].toUpperCase()}
              </span>
            )}
          </div>
        </CardContent>
      </div>
      <CardFooter className="border-t py-2">
        <p className="text-[0.8rem] text-muted-foreground">
          An avatar is optional but strongly recommended.
        </p>
      </CardFooter>
    </Card>
  );
};
