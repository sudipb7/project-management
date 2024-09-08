"use client";

import * as React from "react";
import { MemberRole, Profile } from "@prisma/client";

import { DeleteWorkpspaceModal } from "@/components/modals/delete-workspace";
import { CreateWorkpspaceModal } from "@/components/modals/create-workspace";
import { KickMemberModal } from "../modals/kick-member";

export type ModalType = "create-workspace" | "delete-workspace" | "kick-member";

export type ModalData = {
  profile?: Profile;
  workspaceId?: string;
  memberId?: string;
  adminId?: string;
  role?: MemberRole;
  name?: string;
};

export type ModalState = {
  isOpen: boolean;
  type: ModalType | null;
  data: ModalData | null;
  onOpen: (type: ModalType, data?: ModalData) => void;
  onClose: () => void;
};

export const ModalContext = React.createContext<ModalState>({
  isOpen: false,
  type: null,
  data: null,
  onOpen: () => {},
  onClose: () => {},
});

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [data, setData] = React.useState<ModalData | null>(null);
  const [type, setType] = React.useState<ModalType | null>(null);

  const onOpen = React.useCallback((type: ModalType, data?: ModalData) => {
    if (data) {
      setData(data);
    }
    setType(type);
    setIsOpen(true);
  }, []);

  const onClose = React.useCallback(() => {
    setType(null);
    setData(null);
    setIsOpen(false);
  }, []);

  const value = React.useMemo(
    () => ({ isOpen, type, onOpen, onClose, data }),
    [isOpen, onClose, onOpen, type, data]
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
      <CreateWorkpspaceModal />
      <DeleteWorkpspaceModal />
      <KickMemberModal />
    </>
  );
}
