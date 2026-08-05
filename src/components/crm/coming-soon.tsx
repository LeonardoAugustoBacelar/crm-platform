export function ComingSoon({ title }: { title: string }) {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <p className="max-w-md text-sm text-neutral-500">
        Ainda não implementado. Segue o mesmo padrão do módulo de Empresas — repositório em{" "}
        <code className="rounded bg-neutral-100 px-1 py-0.5 dark:bg-neutral-900">
          src/server/repositories
        </code>
        , Server Action em{" "}
        <code className="rounded bg-neutral-100 px-1 py-0.5 dark:bg-neutral-900">
          src/server/actions
        </code>
        , e página aqui em{" "}
        <code className="rounded bg-neutral-100 px-1 py-0.5 dark:bg-neutral-900">src/app/(app)</code>.
      </p>
    </div>
  );
}
