import React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/components/providers/modal-provider";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

export const LogOutModal = () => {
  const { isOpen, onClose, type } = useModal();

  const isModalOpen = isOpen && type === "logout";

  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      alert("Something went wrong. Please try again.");
    } finally {
      onClose();
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xs">
        <DialogHeader className="space-y-0.5">
          <DialogTitle className="text-base">Logout</DialogTitle>
          <DialogDescription className="text-sm">
            Are you sure you want to logout?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleLogout}
            className="w-full text-[13px]"
          >
            Log out
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
