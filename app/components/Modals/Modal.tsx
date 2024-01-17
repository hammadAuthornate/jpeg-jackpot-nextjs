"use client";
import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";

function Modal({
  onClose,
  children,
  title,
}: {
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle>
        {title}
        <IconButton
          style={{ position: "absolute", right: "8px", top: "8px" }}
          onClick={onClose}
        ></IconButton>
      </DialogTitle>
      <DialogContent>{children}</DialogContent>
    </Dialog>
  );
}

export default Modal;
