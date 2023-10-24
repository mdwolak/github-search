import React from "react";

import ReactDom from "react-dom";

interface ModalProps {
  openDialog: boolean;
  setOpenDialog: (openDialog: boolean) => void;
  children: React.ReactNode;
}

const Modal = ({ openDialog, setOpenDialog, children }: ModalProps) => {
  if (!openDialog) return null;
  return ReactDom.createPortal(
    <>
      <div
        className="fixed inset-0 z-[1000] bg-[rgba(0,0,0,.5)]"
        onClick={() => setOpenDialog(false)}></div>
      <div className="fixed left-1/2 top-0 z-[1001] w-full max-w-lg -translate-x-1/2 rounded-md bg-white p-6 xl:top-[10%]">
        {children}
      </div>
    </>,
    document.getElementById("main-modal") as HTMLElement
  );
};

export default Modal;
