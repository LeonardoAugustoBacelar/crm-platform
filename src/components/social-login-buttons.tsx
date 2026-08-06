import { signIn } from "@/auth";

const buttonClass =
  "rounded border border-neutral-300 px-3 py-2 text-center text-sm font-medium hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-900";

/**
 * Só renderiza o botão de um provider se as credenciais dele estiverem
 * configuradas (ver src/auth.ts) — sem isso não tem provider pra logar.
 */
export function SocialLoginButtons({ redirectTo = "/dashboard" }: { redirectTo?: string }) {
  const hasGoogle = Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET);
  const hasMicrosoft = Boolean(
    process.env.AUTH_MICROSOFT_ENTRA_ID_ID && process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET
  );

  if (!hasGoogle && !hasMicrosoft) return null;

  return (
    <div className="flex flex-col gap-2">
      {hasGoogle && (
        <form
          action={async () => {
            "use server";
            await signIn("google", { redirectTo });
          }}
        >
          <button type="submit" className={buttonClass}>
            Entrar com Google
          </button>
        </form>
      )}
      {hasMicrosoft && (
        <form
          action={async () => {
            "use server";
            await signIn("microsoft-entra-id", { redirectTo });
          }}
        >
          <button type="submit" className={buttonClass}>
            Entrar com Microsoft
          </button>
        </form>
      )}
      <div className="flex items-center gap-2 text-xs text-neutral-400">
        <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
        ou
        <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
      </div>
    </div>
  );
}
