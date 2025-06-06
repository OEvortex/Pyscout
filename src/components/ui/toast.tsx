"use client";

import * as React from "react";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { cva, type VariantProps } from "class-variance-authority";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

import { cn } from "@/lib/utils";

const ToastProvider = ToastPrimitives.Provider;

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
      className,
    )}
    {...props}
  />
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center space-x-3 overflow-hidden rounded-xl border backdrop-blur-sm p-4 pr-6 shadow-xl transition-all duration-300 ease-out data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95 hover:shadow-2xl hover:scale-[1.02]",
  {
    variants: {
      variant: {
        default: "border-border/50 bg-background/95 text-foreground shadow-lg",
        destructive:
          "destructive group border-red-200/50 bg-red-50/95 text-red-900 shadow-red-200/50 dark:border-red-900/50 dark:bg-red-950/95 dark:text-red-100",
        success:
          "border-green-200/50 bg-green-50/95 text-green-900 shadow-green-200/50 dark:border-green-900/50 dark:bg-green-950/95 dark:text-green-100",
        warning:
          "border-amber-200/50 bg-amber-50/95 text-amber-900 shadow-amber-200/50 dark:border-amber-900/50 dark:bg-amber-950/95 dark:text-amber-100",
        info:
          "border-blue-200/50 bg-blue-50/95 text-blue-900 shadow-blue-200/50 dark:border-blue-900/50 dark:bg-blue-950/95 dark:text-blue-100",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants> & {
      showIcon?: boolean;
      showProgress?: boolean;
      duration?: number;
    }
>(({ className, variant, showIcon = true, showProgress = true, duration = 5000, ...props }, ref) => {
  const [progress, setProgress] = React.useState(100);

  React.useEffect(() => {
    if (!showProgress || !props.open) return;

    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, duration - elapsed);
      setProgress((remaining / duration) * 100);

      if (remaining <= 0) {
        clearInterval(timer);
      }
    }, 50);

    return () => clearInterval(timer);
  }, [props.open, duration, showProgress]);

  const getIcon = () => {
    if (!showIcon) return null;
    
    switch (variant) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />;
      case "destructive":
        return <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />;
      case "info":
        return <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />;
      default:
        return <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />;
    }
  };

  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    >
      {getIcon()}
      <div className="flex-1 min-w-0">
        {props.children}
      </div>
      
      {showProgress && props.open && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/10 dark:bg-white/10 overflow-hidden rounded-b-xl">
          <div 
            className={cn(
              "h-full transition-all duration-75 ease-linear",
              variant === "success" && "bg-green-500",
              variant === "destructive" && "bg-red-500", 
              variant === "warning" && "bg-amber-500",
              variant === "info" && "bg-blue-500",
              variant === "default" && "bg-primary"
            )}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </ToastPrimitives.Root>
  );
});
Toast.displayName = ToastPrimitives.Root.displayName;

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-lg border-0 bg-transparent px-3 text-sm font-medium ring-offset-background transition-all duration-200 hover:bg-white/20 dark:hover:bg-black/20 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:hover:bg-red-600/20 group-[.destructive]:focus:ring-red-400 group-[.success]:hover:bg-green-600/20 group-[.success]:focus:ring-green-400 group-[.warning]:hover:bg-amber-600/20 group-[.warning]:focus:ring-amber-400 group-[.info]:hover:bg-blue-600/20 group-[.info]:focus:ring-blue-400",
      className,
    )}
    {...props}
  />
));
ToastAction.displayName = ToastPrimitives.Action.displayName;

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute right-2 top-2 rounded-lg p-1.5 text-foreground/50 opacity-0 transition-all duration-200 hover:text-foreground hover:bg-white/20 dark:hover:bg-black/20 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-primary group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:hover:bg-red-600/20 group-[.destructive]:focus:ring-red-400 group-[.success]:text-green-300 group-[.success]:hover:text-green-50 group-[.success]:hover:bg-green-600/20 group-[.success]:focus:ring-green-400 group-[.warning]:text-amber-300 group-[.warning]:hover:text-amber-50 group-[.warning]:hover:bg-amber-600/20 group-[.warning]:focus:ring-amber-400 group-[.info]:text-blue-300 group-[.info]:hover:text-blue-50 group-[.info]:hover:bg-blue-600/20 group-[.info]:focus:ring-blue-400",
      className,
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
));
ToastClose.displayName = ToastPrimitives.Close.displayName;

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn("text-sm font-semibold", className)}
    {...props}
  />
));
ToastTitle.displayName = ToastPrimitives.Title.displayName;

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn("text-sm opacity-90", className)}
    {...props}
  />
));
ToastDescription.displayName = ToastPrimitives.Description.displayName;

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>;

type ToastActionElement = React.ReactElement<typeof ToastAction>;

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
};
