import React from "react";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { api } from "@/lib/api";
import { useModal } from "@/components/providers/modal-provider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const DeleteWorkpspaceModal = () => {
  const router = useRouter();
  const params = useParams();
  const session = useSession();
  const { isOpen, onClose, type } = useModal();

  const [value, setValue] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      setIsLoading(true);
      if (value !== "delete") {
        throw new Error("Invalid input");
      }

      if (!params.workspaceId) {
        throw new Error("Invalid workspace ID");
      }

      const adminId = session.data?.user.userId;
      if (!adminId) {
        throw new Error("Unauthorized");
      }

      await api.delete(`/workspaces/${params.workspaceId}`, { data: { adminId } });

      toast.success("Workspace deleted successfully");
      router.push("/");
      router.refresh();
    } catch (error: any) {
      toast.error("Failed to delete workspace.");
    } finally {
      setIsLoading(false);
      onModalClose();
    }
  };

  const isModalOpen = isOpen && type === "delete-workspace";

  const onModalClose = () => {
    setValue("");
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onModalClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader className="space-y-0.5">
          <DialogTitle className="text-base text-destructive">
            Confirm Workspace Deletion
          </DialogTitle>
          <DialogDescription className="text-sm">
            Type <strong className="italic">delete</strong> to confirm deletion of this workspace.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-2" onSubmit={onSubmit}>
          <div className="space-y-1.5">
            <Input
              type="text"
              value={value}
              placeholder="type 'delete' to confirm"
              disabled={isLoading}
              onChange={(e) => setValue(e.target.value)}
            />
            {value === "delete" && (
              <p className="text-xs text-destructive">This action cannot be undone.</p>
            )}
            {value !== "delete" && (
              <p className="text-xs text-muted-foreground">
                This action cannot be undone. Please be careful.
              </p>
            )}
          </div>
          <Button
            type="submit"
            variant="destructive"
            disabled={isLoading || value !== "delete"}
            size="sm"
            className="w-full text-[13px] "
          >
            {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? "Deleting..." : "Confirm"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
