import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { Toaster } from "sonner";
import appCss from "../styles.css?url";

const APP_NAME = "Loddtrekning";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: APP_NAME },
      {
        name: "description",
        content: "Loddtrekning. Trekk blant solgte lodd — aldri samme lodd to ganger.",
      },
      { name: "theme-color", content: "#9f1d2c" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Oswald:wght@500;600;700&display=swap",
      },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
    ],
  }),
  component: RootDocument,
});

function RootDocument() {
  return (
    <html lang="nb" className="antialiased" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="paper-grain min-h-dvh">
        <PreviewHostBridge />
        <AuthProvider>
          <Outlet />
        </AuthProvider>
        <Toaster
          position="top-center"
          offset={16}
          toastOptions={{
            className: "!font-sans !bg-surface !text-fg !border-border !shadow-[var(--shadow-border)]",
          }}
        />
        <Scripts />
      </body>
    </html>
  );
}
