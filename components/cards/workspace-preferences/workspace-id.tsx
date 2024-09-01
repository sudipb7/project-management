"use client";

import React from "react";
import { toast } from "sonner";
import { Clipboard, ClipboardCheck } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { type WorkspacePreferencesProps } from ".";

export const WorkspaceId = ({ currentWorkspace }: WorkspacePreferencesProps) => {
  const [isCopied, setIsCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`workspace_${currentWorkspace.id}`);
    setIsCopied(true);
    toast.success("Workspace ID copied to clipboard");
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <Card className="mt-4">
      <CardHeader className="space-y-0.5 pb-2">
        <CardTitle className="text-sm tracking-[0.01em] font-medium font-mono">
          Workspace ID
        </CardTitle>
        <CardDescription className="text-[13px]">
          This is your workspace&apos;s ID within Mk-1.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative w-fit">
          <Input
            type="text"
            value={`workspace_${currentWorkspace.id}`}
            readOnly
            className="w-[330px] text-[13px] h-9"
          />
          <button onClick={handleCopy} className="absolute inset-y-0 right-0 h-9 px-3 rounded-lg">
            {isCopied ? <ClipboardCheck className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}
          </button>
        </div>
      </CardContent>
      <CardFooter className="border-t py-2">
        <p className="text-[13px] text-muted-foreground">
          Used when interacting with the Mk-1 API. (Coming soon)
        </p>
      </CardFooter>
    </Card>
  );
};
