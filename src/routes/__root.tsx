import { Outlet, Link, createRootRoute, HeadContent, Scripts, useLocation } from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { MaratonaProvider } from "@/lib/maratona/store";
import { AuthProvider, useAuth } from "@/lib/maratona/auth";
import { Toaster } from "sonner";
import { AppLayout } from "@/components/maratona/Layout";
import { Landing } from "@/components/maratona/Landing";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Maratona Financeira -  sua jornada patrimonial em 42km" },
      {
        name: "description",
        content:
          "Acompanhe a evolução do seu patrimônio como uma maratona: progresso baseado em tempo, desempenho baseado em consistência.",
      },
      { name: "author", content: "Lovable" },
      { property: "og:title", content: "Maratona Financeira -  sua jornada patrimonial em 42km" },
      {
        property: "og:description",
        content: "Acompanhe sua jornada patrimonial mês a mês com motivação e clareza.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
      { name: "twitter:title", content: "Maratona Financeira -  sua jornada patrimonial em 42km" },
      { name: "description", content: "Acompanhe a evolução do seu patrimônio como uma maratona de 42 km: progresso por tempo, desempenho por consistência e projeções até a sua meta." },
      { property: "og:description", content: "Acompanhe a evolução do seu patrimônio como uma maratona de 42 km: progresso por tempo, desempenho por consistência e projeções até a sua meta." },
      { name: "twitter:description", content: "Acompanhe a evolução do seu patrimônio como uma maratona de 42 km: progresso por tempo, desempenho por consistência e projeções até a sua meta." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/c502de61-ee4f-4590-b064-2751c8cbb204/id-preview-23eae086--5efa16d2-f7d7-4a2e-884f-9f680b23e0be.lovable.app-1778464397421.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/c502de61-ee4f-4590-b064-2751c8cbb204/id-preview-23eae086--5efa16d2-f7d7-4a2e-884f-9f680b23e0be.lovable.app-1778464397421.png" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      {
        rel: "icon",
        type: "image/svg+xml",
        href: "/favicon.svg",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const location = useLocation();
  const isOnboarding = location.pathname.startsWith("/onboarding");
  const isAuth = location.pathname.startsWith("/auth");
  const isPrivacy = location.pathname.startsWith("/privacidade");
  const isHome = location.pathname === "/";

  return (
    <AuthProvider>
      <MaratonaProvider>
        {isAuth || isPrivacy ? (
          <Outlet />
        ) : (
          <AuthGate publicHome={isHome}>
            {isOnboarding ? <Outlet /> : <AppLayout />}
          </AuthGate>
        )}
        <Toaster position="top-center" richColors theme="dark" />
      </MaratonaProvider>
    </AuthProvider>
  );
}

function AuthGate({
  children,
  publicHome,
}: {
  children: React.ReactNode;
  publicHome?: boolean;
}) {
  const { ready, user } = useAuth();
  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground text-sm">
        Carregando…
      </div>
    );
  }
  if (!user) {
    if (publicHome) {
      return <Landing />;
    }
    if (typeof window !== "undefined") {
      window.location.replace("/auth");
    }
    return null;
  }
  return <>{children}</>;
}
