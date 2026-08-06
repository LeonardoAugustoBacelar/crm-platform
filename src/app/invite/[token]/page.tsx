import { auth } from "@/auth";
import { prisma } from "@/server/db";
import { getInvitationByToken } from "@/server/repositories/invitations";
import { acceptInvitationAction } from "@/server/actions/invitations";

const inputClass =
  "rounded border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900";

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-4 px-4">
      {children}
    </main>
  );
}

export default async function InvitePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const [invitation, session] = await Promise.all([getInvitationByToken(token), auth()]);

  if (!invitation) {
    return (
      <Shell>
        <p className="text-sm text-neutral-500">Convite não encontrado.</p>
      </Shell>
    );
  }
  if (invitation.acceptedAt) {
    return (
      <Shell>
        <p className="text-sm text-neutral-500">Esse convite já foi aceito.</p>
      </Shell>
    );
  }
  if (invitation.expiresAt < new Date()) {
    return (
      <Shell>
        <p className="text-sm text-neutral-500">Esse convite expirou. Peça pra quem convidou enviar um novo.</p>
      </Shell>
    );
  }

  // Logado com o e-mail convidado: aceitar é um clique.
  if (session?.user?.email === invitation.email) {
    return (
      <Shell>
        <h1 className="text-xl font-semibold">Convite para {invitation.organization.name}</h1>
        <p className="text-sm text-neutral-500">
          Você foi convidado como <strong>{invitation.role}</strong>.
        </p>
        <form action={acceptInvitationAction}>
          <input type="hidden" name="token" value={token} />
          <button
            type="submit"
            className="w-full rounded bg-neutral-900 px-3 py-2 text-sm font-medium text-white dark:bg-white dark:text-neutral-900"
          >
            Aceitar convite
          </button>
        </form>
      </Shell>
    );
  }

  // Logado com um e-mail diferente do convidado.
  if (session?.user?.email) {
    return (
      <Shell>
        <p className="text-sm text-neutral-500">
          Você está logado como <strong>{session.user.email}</strong>, mas esse convite é pra{" "}
          <strong>{invitation.email}</strong>. Saia e entre com o e-mail convidado pra aceitar.
        </p>
      </Shell>
    );
  }

  // Ninguém logado: se já existe conta com esse e-mail, manda pro login (com
  // volta pra esse link); senão, oferece criar a conta na hora.
  const existingUser = await prisma.user.findUnique({
    where: { email: invitation.email },
    select: { id: true },
  });

  if (existingUser) {
    return (
      <Shell>
        <h1 className="text-xl font-semibold">Convite para {invitation.organization.name}</h1>
        <p className="text-sm text-neutral-500">
          Já existe uma conta com o e-mail <strong>{invitation.email}</strong>. Entre pra aceitar o convite.
        </p>
        <a
          href={`/login?callbackUrl=${encodeURIComponent(`/invite/${token}`)}`}
          className="rounded bg-neutral-900 px-3 py-2 text-center text-sm font-medium text-white dark:bg-white dark:text-neutral-900"
        >
          Entrar
        </a>
      </Shell>
    );
  }

  return (
    <Shell>
      <h1 className="text-xl font-semibold">Convite para {invitation.organization.name}</h1>
      <p className="text-sm text-neutral-500">
        Crie sua conta com <strong>{invitation.email}</strong> pra entrar como <strong>{invitation.role}</strong>.
      </p>
      <form action={acceptInvitationAction} className="flex flex-col gap-3">
        <input type="hidden" name="token" value={token} />
        <input name="name" placeholder="Seu nome" required className={inputClass} />
        <input name="password" type="password" placeholder="Crie uma senha" required className={inputClass} />
        <button
          type="submit"
          className="rounded bg-neutral-900 px-3 py-2 text-sm font-medium text-white dark:bg-white dark:text-neutral-900"
        >
          Criar conta e entrar
        </button>
      </form>
    </Shell>
  );
}
