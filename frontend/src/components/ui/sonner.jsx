import { Toaster as Sonner, toast } from "sonner";

// The original (shadcn/ui template) read the theme from next-themes' useTheme(),
// but the app never mounts a <ThemeProvider>, so it always fell back to "system"
// and toasts turned dark for visitors whose OS is in dark mode, clashing with the
// light-only cream design. The site has no dark mode, so pin the theme to "light"
// and drop the next-themes dependency.
const Toaster = ({ ...props }) => (
  <Sonner
    theme="light"
    className="toaster group"
    toastOptions={{
      classNames: {
        toast:
          "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
        description: "group-[.toast]:text-muted-foreground",
        actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
        cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
      },
    }}
    {...props}
  />
);

export { Toaster, toast };
