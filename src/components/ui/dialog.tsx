"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

const Dialog: React.FC<DialogProps> = ({ open, onClose, children, className }) => {
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div
            className="fixed inset-0 bg-foreground/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            className={cn(
              "relative z-50 mx-4 w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-xl",
              className
            )}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
Dialog.displayName = "Dialog";

interface DialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

const DialogHeader: React.FC<DialogHeaderProps> = ({ className, ...props }) => (
  <div
    className={cn("mb-4 flex flex-col space-y-1.5", className)}
    {...props}
  />
);
DialogHeader.displayName = "DialogHeader";

interface DialogTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

const DialogTitle: React.FC<DialogTitleProps> = ({ className, ...props }) => (
  <h2
    className={cn("text-xl font-extrabold leading-tight", className)}
    {...props}
  />
);
DialogTitle.displayName = "DialogTitle";

interface DialogDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

const DialogDescription: React.FC<DialogDescriptionProps> = ({
  className,
  ...props
}) => (
  <p
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
);
DialogDescription.displayName = "DialogDescription";

interface DialogCloseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const DialogClose: React.FC<DialogCloseProps> = ({
  className,
  onClick,
  ...props
}) => (
  <button
    type="button"
    className={cn(
      "absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary",
      className
    )}
    aria-label="Close dialog"
    onClick={onClick}
    {...props}
  >
    <X className="h-4 w-4" />
  </button>
);
DialogClose.displayName = "DialogClose";

export { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogClose };
export type { DialogProps };
