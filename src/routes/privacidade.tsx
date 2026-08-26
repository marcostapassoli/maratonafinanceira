import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity } from "lucide-react";

export const Route = createFileRoute("/privacidade")({
  head: () => ({
    meta: [
      { title: "Política de Privacidade — Maratona Financeira" },
      {
        name: "description",
        content:
          "Política de Privacidade do Maratona Financeira: como coletamos, usamos e protegemos seus dados.",
      },
    ],
  }),
  component: Privacidade,
});

function Privacidade() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/50">
        <div className="mx-auto max-w-3xl px-4 h-14 flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            <span className="text-base font-bold tracking-tight">
              Maratona <span className="text-primary">Financeira</span>
            </span>
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-8 prose prose-invert">
        <h1 className="text-3xl font-bold mb-2">Política de Privacidade</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Última atualização: 11 de maio de 2026
        </p>

        <section className="space-y-4 text-sm leading-relaxed">
          <p>
            Esta Política de Privacidade descreve como o aplicativo{" "}
            <strong>Maratona Financeira</strong> (acessível em{" "}
            <a className="text-primary" href="https://maratonafinanceira.com.br">
              maratonafinanceira.com.br
            </a>
            ) coleta, utiliza e protege as informações dos usuários.
          </p>

          <h2 className="text-xl font-semibold mt-6">1. Informações que coletamos</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <strong>Dados de conta:</strong> nome e e-mail fornecidos no
              cadastro ou obtidos via login com Google.
            </li>
            <li>
              <strong>Dados financeiros do plano:</strong> valores de
              patrimônio, aportes, taxa de retorno, idade e meta de renda
              que você registra voluntariamente no app.
            </li>
            <li>
              <strong>Dados técnicos:</strong> informações mínimas de sessão
              necessárias para autenticação e funcionamento do app.
            </li>
          </ul>

          <h2 className="text-xl font-semibold mt-6">2. Como usamos seus dados</h2>
          <p>
            Os dados são usados exclusivamente para autenticar seu acesso,
            armazenar seu histórico de patrimônio e calcular projeções,
            ritmo e marcos da sua maratona financeira.
          </p>
          <p>
            Não vendemos, alugamos ou compartilhamos seus dados pessoais ou
            financeiros com terceiros para fins de marketing.
          </p>

          <h2 className="text-xl font-semibold mt-6">3. Login com Google</h2>
          <p>
            Quando você opta por entrar com sua conta Google, recebemos
            apenas seu nome, e-mail e identificador de usuário. Não acessamos
            sua agenda, contatos, e-mails, Drive ou qualquer outro serviço
            Google. Você pode revogar o acesso a qualquer momento em{" "}
            <a className="text-primary" href="https://myaccount.google.com/permissions">
              myaccount.google.com/permissions
            </a>
            .
          </p>

          <h2 className="text-xl font-semibold mt-6">4. Armazenamento e segurança</h2>
          <p>
            Seus dados são armazenados em provedor de nuvem com criptografia
            em trânsito (HTTPS) e em repouso. O acesso é protegido por
            políticas de segurança a nível de banco de dados (Row-Level
            Security), garantindo que somente você possa ler ou alterar seus
            próprios registros.
          </p>

          <h2 className="text-xl font-semibold mt-6">5. Seus direitos</h2>
          <p>
            Você pode, a qualquer momento, visualizar, corrigir ou excluir
            seus dados diretamente no app, ou solicitar a exclusão completa
            da sua conta entrando em contato pelo e-mail abaixo.
          </p>

          <h2 className="text-xl font-semibold mt-6">6. Cookies</h2>
          <p>
            Utilizamos apenas cookies essenciais para manter sua sessão
            autenticada. Não usamos cookies de rastreamento publicitário.
          </p>

          <h2 className="text-xl font-semibold mt-6">7. Contato</h2>
          <p>
            Para dúvidas sobre esta política ou solicitações relacionadas
            aos seus dados, entre em contato em{" "}
            <a className="text-primary" href="mailto:contato@maratonafinanceira.com.br">
              contato@maratonafinanceira.com.br
            </a>
            .
          </p>
        </section>

        <div className="mt-10">
          <Link to="/" className="text-primary text-sm">
            ← Voltar para o início
          </Link>
        </div>
      </main>
    </div>
  );
}
