"use client";

import * as React from "react";
import { LogOutModal } from "@/components/modals/log-out";
import { DeleteWorkpspaceModal } from "@/components/modals/delete-workspace";
import { CreateWorkpspaceModal } from "@/components/modals/create-workspace";

export type ModalType = "logout" | "create-workspace" | "delete-workspace";

export type ModalState = {
  isOpen: boolean;
  type: ModalType | null;
  onOpen: (type: ModalType) => void;
  onClose: () => void;
};

export const ModalContext = React.createContext<ModalState>({
  isOpen: false,
  type: null,
  onOpen: () => {},
  onClose: () => {},
});

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [type, setType] = React.useState<ModalType | null>(null);

  const onOpen = React.useCallback((type: ModalType) => {
    setType(type);
    setIsOpen(true);
  }, []);

  const onClose = React.useCallback(() => {
    setType(null);
    setIsOpen(false);
  }, []);

  const value = React.useMemo(
    () => ({ isOpen, type, onOpen, onClose }),
    [isOpen, onClose, onOpen, type]
  );

  return (
    <ModalContext.Provider value={value}>
      <Modals />
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = React.useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
}

function Modals() {
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <LogOutModal />
      <CreateWorkpspaceModal />
      <DeleteWorkpspaceModal />
    </>
  );
}
