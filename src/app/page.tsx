export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-lg flex-col items-center gap-6 px-6 py-32 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">CRM Platform</h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          Conecte empresas, contatos e oportunidades num só lugar.
        </p>
        <div className="flex gap-4">
          <a
            href="/signup"
            className="flex h-11 items-center justify-center rounded-full bg-foreground px-6 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
          >
            Criar organização
          </a>
          <a
            href="/login"
            className="flex h-11 items-center justify-center rounded-full border border-black/[.08] px-6 text-sm font-medium transition-colors hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
          >
            Entrar
          </a>
        </div>
      </main>
    </div>
  );
}
