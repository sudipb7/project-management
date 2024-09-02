import React from "react";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useModal } from "@/components/providers/modal-provider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const DeleteWorkpspaceModal = () => {
  const router = useRouter();
  const params = useParams();
  const { isOpen, onClose, type, data } = useModal();

  const [value, setValue] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      setIsLoading(true);
      if (value !== "delete") {
        throw new Error("Invalid input");
      }

      if (!params?.workspaceId) {
        throw new Error("Invalid workspace ID");
      }

      if (!data?.profile?.id) {
        throw new Error("Unauthorized");
      }

      await axios.delete(`/api/workspaces/${params.workspaceId}`, {
        data: { adminId: data?.profile?.id },
      });

      toast.success("Workspace deleted successfully");
      router.push("/workspace");
      router.refresh();
    } catch (error: AxiosError | any) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data);
      } else {
        toast.error(error?.message || "Failed to delete workspace.");
      }
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
      <DialogContent className="max-w-xs sm:max-w-sm">
        <DialogHeader className="space-y-0.5">
          <DialogTitle className="text-base text-destructive">
            Confirm Workspace Deletion
          </DialogTitle>
        </DialogHeader>
        <form className="space-y-2" onSubmit={onSubmit}>
          <div className="space-y-1.5">
            <Input
              type="text"
              value={value}
              placeholder="type 'delete' to confirm deletion"
              disabled={isLoading}
              onChange={(e) => setValue(e.target.value)}
            />
          </div>
          <Button
            type="submit"
            variant="destructive"
            disabled={isLoading || value !== "delete"}
            size="sm"
            className="w-full text-[0.8rem] "
          >
            {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? "Deleting..." : "Confirm"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
