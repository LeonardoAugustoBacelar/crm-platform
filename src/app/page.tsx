import type { ReactNode } from "react";

const FEATURES: { title: string; description: string }[] = [
  {
    title: "Empresas e contatos",
    description: "Centralize as contas que sua equipe trabalha e quem são as pessoas por trás delas.",
  },
  {
    title: "Pipeline de vendas",
    description: "Monte funis com etapas e probabilidade de fechamento sob medida pro seu processo.",
  },
  {
    title: "Oportunidades",
    description: "Acompanhe negócios em aberto, valor e previsão de fechamento num só lugar.",
  },
  {
    title: "Convide sua equipe",
    description: "Adicione membros por e-mail, com papéis (owner, admin, membro) e sem precisar de setup.",
  },
  {
    title: "Múltiplas organizações",
    description: "Uma mesma conta pode pertencer a mais de uma organização e trocar entre elas.",
  },
  {
    title: "Isolamento de verdade",
    description: "Cada organização só enxerga os próprios dados — o isolamento é aplicado no código, não é opcional.",
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
        <Section className="flex flex-col items-center gap-6 py-24 text-center sm:py-32">
          <h1 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
            O CRM que separa direito o dado de cada organização.
          </h1>
          <p className="max-w-xl text-lg text-neutral-600 dark:text-neutral-400">
            Empresas, contatos, pipeline e oportunidades num só lugar — com cada organização que assina o
            produto isolada das demais desde a primeira linha de código.
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

        <Section className="py-16 sm:py-20">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="rounded-lg border border-neutral-200 p-5 dark:border-neutral-800"
              >
                <h3 className="font-medium">{feature.title}</h3>
                <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section className="border-t border-neutral-200 py-16 dark:border-neutral-800 sm:py-20">
          <h2 className="text-center text-2xl font-semibold tracking-tight">Como funciona</h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {STEPS.map((item) => (
              <div key={item.step} className="text-center sm:text-left">
                <span className="text-sm font-semibold text-neutral-400 dark:text-neutral-600">
                  {item.step.padStart(2, "0")}
                </span>
                <h3 className="mt-2 font-medium">{item.title}</h3>
                <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">{item.description}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section className="py-16 sm:py-20">
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-neutral-200 px-6 py-14 text-center dark:border-neutral-800">
            <h2 className="text-2xl font-semibold tracking-tight">Pronto pra organizar seu funil de vendas?</h2>
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
