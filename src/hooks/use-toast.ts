
import { toast as sonnerToast } from "sonner";
import * as React from "react";

type ToastProps = React.ComponentPropsWithoutRef<typeof sonnerToast>;

const useToast = () => {
  return {
    toast: sonnerToast,
  };
};

export { useToast, sonnerToast as toast };
