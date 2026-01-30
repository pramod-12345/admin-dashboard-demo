import { useToast } from "@/hooks/use-toast";
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "@/components/ui/toast";

const DEFAULT_TOAST_DURATION = 3000;

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, duration = DEFAULT_TOAST_DURATION, ...props }) {
        return (
          <Toast key={id} {...props} className="flex-col overflow-hidden p-0">
            <div className="flex w-full items-center justify-between space-x-4 p-6 pr-8">
              <div className="grid gap-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && <ToastDescription>{description}</ToastDescription>}
              </div>
              {action}
              <ToastClose />
            </div>
            {duration > 0 && (
              <div
                className="h-1.5 w-full overflow-hidden mx-0 space-x-0 rounded-b-md bg-secondary"
                style={{ ["--toast-duration" as string]: `${duration}ms`, ["--toast-margin" as string]: "0px", marginLeft: "0px" }}
              >
                <div className="toast-progress-bar h-full w-full bg-primary rounded-b-md" />
              </div>
            )}
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
