import type { ReactNode } from "react";

const SPOTLIGHT_FEATURES: { title: string; description: string; icon: ReactNode; big?: boolean }[] = [
  {
    big: true,
    title: "Isolamento de verdade",
    description:
      "Cada organização só enxerga os próprios dados. Não é uma flag de configuração — é a arquitetura: todo repositório exige o id da organização pra rodar qualquer query.",
    icon: (
      <path d="M12 2 4 5v6c0 5 3.4 8.7 8 9 4.6-.3 8-4 8-9V5l-8-3Zm0 4.2 4.5 1.7v3.7c0 3.1-2 5.6-4.5 6-2.5-.4-4.5-2.9-4.5-6V7.9L12 6.2Z" />
    ),
  },
  {
    title: "Pipeline sob medida",
    description: "Etapas e probabilidade de fechamento do seu jeito, não do jeito que o software impõe.",
    icon: <path d="M4 6h16M4 12h10M4 18h6" strokeLinecap="round" />,
  },
  {
    title: "Convite em segundos",
    description: "Um link, um papel definido, e a pessoa já está dentro — sem fricção de onboarding.",
    icon: (
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm9 0 3 3-3 3M15 14h7" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
  {
    title: "Multi-organização nativa",
    description: "Um usuário, várias organizações. Troque de contexto sem trocar de conta.",
    icon: <path d="M3 7h7v7H3zM14 4h7v7h-7zM14 15h7v5h-7z" strokeLinejoin="round" />,
  },
];

const STEPS: { step: string; title: string; description: string }[] = [
  {
    step: "1",
    title: "Crie sua organização",
    description: "Um formulário, sem cartão de crédito. Sua conta e a organização nascem juntas.",
  },
  {
    step: "2",
    title: "Convide sua equipe",
    description: "Mande um link de convite por e-mail. Cada pessoa entra com o papel certo desde o início.",
  },
  {
    step: "3",
    title: "Organize seu funil",
    description: "Cadastre empresas, contatos e comece a mover oportunidades pelas etapas do seu processo.",
  },
];

function Section({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`mx-auto w-full max-w-5xl px-6 ${className}`}>{children}</section>;
}

function Icon({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5">
      {children}
    </svg>
  );
}

/** Blob orgânico decorativo — geometria própria, não um clipart genérico. */
function Blob({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M52.4 27.6c22.6-16 54.9-19 79.6-4.7 24.7 14.3 39.4 43.4 33.9 70.6-5.5 27.2-31.1 49.2-59.7 55.9-28.6 6.7-60.1-2.1-77.6-24.8C11.1 101.9 8 69.5 21.6 47.9c6.8-10.8 18.2-14.3 30.8-20.3Z"
      />
    </svg>
  );
}

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-black">
      <header className="border-b border-neutral-200 dark:border-neutral-800">
        <Section className="flex h-16 items-center justify-between">
          <span className="text-sm font-semibold tracking-tight">CRM Platform</span>
          <nav className="flex items-center gap-4 text-sm">
            <a href="/login" className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white">
              Entrar
            </a>
            <a
              href="/signup"
              className="rounded-full bg-neutral-900 px-4 py-2 font-medium text-white hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
            >
              Criar organização
            </a>
          </nav>
        </Section>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <div className="relative overflow-hidden">
          <Blob className="pointer-events-none absolute -left-16 top-10 h-56 w-56 text-emerald-500/10 dark:text-emerald-400/10 sm:h-72 sm:w-72" />
          <Blob className="pointer-events-none absolute -right-20 top-32 h-64 w-64 rotate-45 text-emerald-500/10 dark:text-emerald-400/10 sm:h-80 sm:w-80" />

          <Section className="relative flex flex-col items-center gap-6 py-24 text-center sm:py-32">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-600/20 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-500/10 dark:text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Multi-tenant desde a primeira linha de código
            </span>

            <h1 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
              O CRM que leva <span className="font-serif italic text-emerald-600 dark:text-emerald-400">isolamento</span> a sério.
            </h1>
            <p className="max-w-xl text-lg text-neutral-600 dark:text-neutral-400">
              Empresas, contatos, pipeline e oportunidades num só lugar — com cada organização que assina o
              produto isolada das demais, de verdade.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href="/signup"
                className="flex h-11 items-center justify-center rounded-full bg-neutral-900 px-6 text-sm font-medium text-white transition-colors hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
              >
                Criar organização grátis
              </a>
              <a
                href="/login"
                className="flex h-11 items-center justify-center rounded-full border border-neutral-300 px-6 text-sm font-medium transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-900"
              >
                Entrar
              </a>
            </div>
          </Section>
        </div>

        {/* Painel escuro com "spotlight" — seção sempre escura, independente do tema do usuário */}
        <div className="relative overflow-hidden bg-neutral-950 py-20 sm:py-28">
          <div
            className="pointer-events-none absolute inset-0 opacity-60"
            style={{
              background:
                "radial-gradient(60% 50% at 20% 0%, rgba(16,185,129,0.25), transparent 60%), radial-gradient(50% 40% at 85% 20%, rgba(16,185,129,0.15), transparent 60%)",
            }}
          />
          <div
            className="pointer-events-none absolute left-1/4 top-0 h-[140%] w-40 -translate-y-1/4 rotate-[18deg] bg-gradient-to-b from-emerald-400/20 via-emerald-400/5 to-transparent blur-2xl"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute right-1/4 top-0 h-[140%] w-24 -translate-y-1/4 rotate-[12deg] bg-gradient-to-b from-emerald-300/10 via-emerald-300/5 to-transparent blur-2xl"
            aria-hidden="true"
          />

          <Section className="relative">
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
              Isolamento multi-tenant
            </p>
            <h2 className="mt-3 max-w-xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Segurança que não depende de ninguém lembrar de aplicar um filtro.
            </h2>

            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {SPOTLIGHT_FEATURES.map((feature) => (
                <div
                  key={feature.title}
                  className={`flex flex-col rounded-xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm ${
                    feature.big ? "sm:col-span-2 lg:col-span-2 lg:row-span-2" : ""
                  }`}
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400">
                    <Icon>{feature.icon}</Icon>
                  </div>
                  <h3 className="mt-4 font-medium text-white">{feature.title}</h3>
                  <p className="mt-2 text-sm text-neutral-400">{feature.description}</p>
                  {feature.big && (
                    <div className="mt-8 grid flex-1 grid-cols-3 gap-3">
                      {["Org A", "Org B", "Org C"].map((org) => (
                        <div
                          key={org}
                          className="flex flex-col gap-2 rounded-lg border border-dashed border-white/10 bg-white/[0.02] p-3"
                        >
                          <div className="flex items-center gap-1.5 text-[11px] font-medium text-neutral-300">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                            {org}
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-white/10" />
                          <div className="h-1.5 w-2/3 rounded-full bg-white/10" />
                          <div className="h-1.5 w-4/5 rounded-full bg-white/10" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Section>
        </div>

        {/* Como funciona */}
        <Section className="py-16 sm:py-20">
          <h2 className="text-center text-2xl font-semibold tracking-tight">Como funciona</h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {STEPS.map((item) => (
              <div key={item.step} className="text-center sm:text-left">
                <span className="font-serif text-2xl italic text-emerald-600 dark:text-emerald-400">
                  {item.step.padStart(2, "0")}
                </span>
                <h3 className="mt-2 font-medium">{item.title}</h3>
                <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">{item.description}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* CTA final */}
        <Section className="pb-20 sm:pb-28">
          <div className="relative overflow-hidden rounded-2xl border border-neutral-200 px-6 py-14 text-center dark:border-neutral-800">
            <div
              className="pointer-events-none absolute inset-0 opacity-70 dark:opacity-100"
              style={{
                background:
                  "radial-gradient(80% 100% at 50% 120%, rgba(16,185,129,0.12), transparent 60%)",
              }}
            />
            <div className="relative flex flex-col items-center gap-4">
              <h2 className="text-2xl font-semibold tracking-tight">
                Pronto pra organizar seu funil de <span className="font-serif italic text-emerald-600 dark:text-emerald-400">vendas</span>?
              </h2>
              <p className="max-w-md text-neutral-600 dark:text-neutral-400">
                Crie sua organização em menos de um minuto e convide sua equipe quando quiser.
              </p>
              <a
                href="/signup"
                className="mt-2 flex h-11 items-center justify-center rounded-full bg-neutral-900 px-6 text-sm font-medium text-white transition-colors hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
              >
                Criar organização grátis
              </a>
            </div>
          </div>
        </Section>
      </main>

      <footer className="border-t border-neutral-200 py-8 dark:border-neutral-800">
        <Section className="flex flex-col items-center justify-between gap-2 text-sm text-neutral-500 sm:flex-row">
          <span>CRM Platform</span>
          <a href="/login" className="hover:text-neutral-900 dark:hover:text-white">
            Entrar
          </a>
        </Section>
      </footer>
    </div>
  );
}
