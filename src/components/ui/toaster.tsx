"use client";

import { useToast } from "@/hooks/use-toast";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider data-oid="xw_51rp">
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props} data-oid="u0312-d">
            <div className="grid gap-1" data-oid="u3j3.20">
              {title && <ToastTitle data-oid="y9qpqis">{title}</ToastTitle>}
              {description && (
                <ToastDescription data-oid="i7dlhiw">
                  {description}
                </ToastDescription>
              )}
            </div>
            {action}
            <ToastClose data-oid="ypzgrow" />
          </Toast>
        );
      })}
      <ToastViewport data-oid="sui8vd1" />
    </ToastProvider>
  );
}
