import React from "react";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useModal } from "@/components/providers/modal-provider";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export const KickMemberModal = () => {
  const router = useRouter();
  const { isOpen, onClose, type, data } = useModal();

  const [isLoading, setIsLoading] = React.useState(false);

  const handleKickMember = async () => {
    try {
      setIsLoading(true);

      await axios.post(`/api/workspaces/${data?.workspaceId}/kick`, {
        adminId: data?.adminId,
        memberId: data?.memberId,
      });

      toast.success(`${data?.name} has been kicked out successfully.`);
      router.refresh();
    } catch (error: AxiosError | any) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data);
      } else {
        toast.error(error?.message || `Failed to kick ${data?.name} out.`);
      }
    } finally {
      setIsLoading(false);
      onModalClose();
    }
  };

  const isModalOpen = isOpen && type === "kick-member";

  const onModalClose = () => {
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onModalClose}>
      <DialogContent hideCloseBtn className="max-w-xs sm:max-w-sm">
        <DialogHeader className="space-y-0.5">
          <DialogTitle className="text-center text-base text-destructive">
            Are you sure you want to kick out {data?.name}?
          </DialogTitle>
        </DialogHeader>
        <Button
          size="sm"
          variant="destructive"
          onClick={handleKickMember}
          disabled={isLoading}
          className="w-full text-[0.8rem] "
        >
          {isLoading && <Loader className="mr-2 h-[0.8rem] w-[0.8rem] animate-spin" />}
          {isLoading ? `Kicking out ${data?.name}` : `Kick out ${data?.name}`}
        </Button>
      </DialogContent>
    </Dialog>
  );
};
