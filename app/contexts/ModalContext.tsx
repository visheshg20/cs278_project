"use client";

import React, { createContext, useState } from "react";

// Define the shape of the context value
interface ModalContextValue {
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
  modalContent: React.ReactNode | null;
  setModalContent: (modalContent: React.ReactNode | null) => void;
}

// Create the context
export const ModalContext = createContext<ModalContextValue>({
  showModal: false,
  setShowModal: () => {},
  modalContent: null,
  setModalContent: () => {},
});

// Create the provider component
export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState<React.ReactNode | null>(
    null
  );
  return (
    <ModalContext.Provider
      value={{ showModal, setShowModal, modalContent, setModalContent }}
    >
      {children}
    </ModalContext.Provider>
  );
};
