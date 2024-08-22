import React from "react";
import { ModalContext } from "@/components/providers/modal-provider";

export function useModal() {
  const context = React.useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
}
