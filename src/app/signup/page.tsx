import { signUpAction } from "@/server/actions/auth";

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-4 px-4">
      <div>
        <h1 className="text-xl font-semibold">Criar organização</h1>
        <p className="text-sm text-neutral-500">Isso cria sua conta e a organização (tenant) do CRM.</p>
      </div>

      {error && <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-950">{error}</p>}

      <form action={signUpAction} className="flex flex-col gap-3">
        <input
          name="organizationName"
          placeholder="Nome da empresa/organização"
          required
          className="rounded border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
        />
        <input
          name="name"
          placeholder="Seu nome"
          required
          className="rounded border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
        />
        <input
          name="email"
          type="email"
          placeholder="E-mail"
          required
          className="rounded border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
        />
        <input
          name="password"
          type="password"
          placeholder="Senha (mín. 8 caracteres)"
          required
          minLength={8}
          className="rounded border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
        />
        <button
          type="submit"
          className="rounded bg-neutral-900 px-3 py-2 text-sm font-medium text-white dark:bg-white dark:text-neutral-900"
        >
          Criar conta
        </button>
      </form>

      <p className="text-sm text-neutral-500">
        Já tem conta?{" "}
        <a href="/login" className="underline">
          Entrar
        </a>
      </p>
    </main>
  );
}
