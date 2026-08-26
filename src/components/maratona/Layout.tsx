import { Link, Outlet, useLocation } from "@tanstack/react-router";
import { Activity, Home, LineChart, ListChecks, Settings, Plus, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut, useAuth } from "@/lib/maratona/auth";
import { toast } from "sonner";

const tabs = [
  { to: "/", label: "Pista", icon: Home },
  { to: "/atualizar", label: "Atualizar", icon: Plus },
  { to: "/historico", label: "Histórico", icon: ListChecks },
  { to: "/cenarios", label: "Cenários", icon: LineChart },
  { to: "/configuracoes", label: "Ajustes", icon: Settings },
] as const;

export function AppLayout() {
  const location = useLocation();
  const { user } = useAuth();

  async function handleLogout() {
    await signOut();
    toast.success("Até a próxima!");
    if (typeof window !== "undefined") window.location.replace("/auth");
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border/50 bg-background/80 backdrop-blur">
        <div className="mx-auto max-w-3xl px-4 h-14 flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          <h1 className="text-base font-bold tracking-tight">
            Maratona <span className="text-primary">Financeira</span>
          </h1>
          {user && (
            <button
              type="button"
              onClick={handleLogout}
              className="ml-auto inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              title={user.email ?? "Sair"}
            >
              <span className="hidden sm:inline max-w-[180px] truncate">{user.email}</span>
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 mx-auto w-full max-w-3xl px-4 pb-28 pt-4">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 inset-x-0 z-30 border-t border-border/50 bg-background/95 backdrop-blur">
        <div className="mx-auto max-w-3xl grid grid-cols-5">
          {tabs.map(({ to, label, icon: Icon }) => {
            const active =
              to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  "flex flex-col items-center gap-1 py-2.5 text-[11px] transition-colors",
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className={cn("h-5 w-5", active && "drop-shadow-[0_0_6px_var(--primary)]")} />
                <span>{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
