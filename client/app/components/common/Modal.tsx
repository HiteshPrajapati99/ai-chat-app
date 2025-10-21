import { type ReactNode } from "react";
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  className?: string;
  children: ReactNode;
};

const Modal = ({ open, onClose, children, className }: ModalProps) => {
  const handleClose = () => onClose();
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className={className}>
        <DialogClose onClick={handleClose} />
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
