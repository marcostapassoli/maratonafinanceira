import { Activity, Flag, LineChart, Trophy, Wallet } from "lucide-react";

export function Landing() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="border-b border-border/50">
        <div className="mx-auto max-w-5xl px-4 h-14 flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          <h1 className="text-base font-bold tracking-tight">
            Maratona <span className="text-primary">Financeira</span>
          </h1>
          <a
            href="/auth"
            className="ml-auto text-sm font-medium text-primary hover:underline"
          >
            Entrar
          </a>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto max-w-3xl px-4 pt-16 pb-12 text-center">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-primary font-semibold mb-4">
            <Flag className="h-3.5 w-3.5" /> Sua jornada patrimonial em 42 km
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight">
            Acompanhe seu patrimônio como uma{" "}
            <span className="text-primary">maratona</span>.
          </h2>
          <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            O Maratona Financeira transforma sua jornada de acúmulo de
            patrimônio em uma corrida de 42,195 km. Atualize seu saldo mês a
            mês e visualize o progresso, o ritmo e a previsão da sua
            independência financeira.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <a
              href="/auth"
              className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Começar agora
            </a>
            <a
              href="/auth"
              className="inline-flex items-center justify-center rounded-md border border-border px-5 py-2.5 text-sm font-semibold hover:bg-secondary/40 transition-colors"
            >
              Já tenho conta
            </a>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-12 grid sm:grid-cols-3 gap-4">
          <Feature
            icon={<Wallet className="h-5 w-5" />}
            title="Patrimônio mês a mês"
            text="Registre o saldo do mês e veja seus aportes e rentabilidade separados automaticamente."
          />
          <Feature
            icon={<LineChart className="h-5 w-5" />}
            title="Ritmo e projeções"
            text="Saiba se está adiantado, no ritmo ou atrasado em relação ao seu plano e quando vai chegar à meta."
          />
          <Feature
            icon={<Trophy className="h-5 w-5" />}
            title="Marcos no caminho"
            text="5K, 10K, 21K, 42K — celebre cada marco até a sua independência financeira."
          />
        </section>

        <section className="mx-auto max-w-3xl px-4 py-12 text-center">
          <h3 className="text-2xl font-bold">Para quem é?</h3>
          <p className="mt-3 text-muted-foreground">
            Para quem quer planejar a aposentadoria ou a independência
            financeira com clareza, sem planilhas complicadas. Você define
            sua meta de renda mensal e o app calcula o patrimônio
            necessário, o tempo restante e o ritmo ideal de aportes.
          </p>
        </section>
      </main>

      <footer className="border-t border-border/50">
        <div className="mx-auto max-w-5xl px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <div>
            © {new Date().getFullYear()} Maratona Financeira
          </div>
          <div className="flex items-center gap-4">
            <a href="/privacidade" className="hover:text-foreground">
              Política de Privacidade
            </a>
            <a
              href="mailto:contato@maratonafinanceira.com.br"
              className="hover:text-foreground"
            >
              Contato
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Feature({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-5">
      <div className="h-10 w-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center">
        {icon}
      </div>
      <div className="mt-3 font-semibold">{title}</div>
      <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{text}</p>
    </div>
  );
}
