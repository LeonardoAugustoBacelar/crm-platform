import { headers } from "next/headers";
import { auth } from "@/auth";
import { listMembers, listMembershipsForUser } from "@/server/repositories/memberships";
import { listPendingInvitations } from "@/server/repositories/invitations";
import { inviteMemberAction } from "@/server/actions/invitations";
import { switchOrganizationAction } from "@/server/actions/organizations";

const inputClass =
  "rounded border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.organizationId || !session.user.id) return null;

  // Sequencial em vez de Promise.all: Postgres locais/gerenciados com pool
  // pequeno (ex: `npx prisma dev`) nem sempre seguram queries concorrentes.
  const members = await listMembers(session.user.organizationId);
  const pendingInvitations = await listPendingInvitations(session.user.organizationId);
  const memberships = await listMembershipsForUser(session.user.id);
  const headersList = await headers();

  const host = headersList.get("host");
  const proto = headersList.get("x-forwarded-proto") ?? (host?.startsWith("localhost") ? "http" : "https");
  const baseUrl = `${proto}://${host}`;

  const canInvite = session.user.role === "OWNER" || session.user.role === "ADMIN";

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-semibold">Configurações</h1>
        <p className="text-sm text-neutral-500">Membros da organização e convites.</p>
      </div>

      {memberships.length > 1 && (
        <section className="space-y-2">
          <h2 className="font-medium">Suas organizações</h2>
          <div className="flex flex-wrap gap-2">
            {memberships.map((membership) => {
              const isActive = membership.organizationId === session.user.organizationId;
              return (
                <form key={membership.organizationId} action={switchOrganizationAction}>
                  <input type="hidden" name="organizationId" value={membership.organizationId} />
                  <button
                    type="submit"
                    disabled={isActive}
                    className={
                      isActive
                        ? "rounded border border-neutral-900 bg-neutral-900 px-3 py-1.5 text-sm text-white dark:border-white dark:bg-white dark:text-neutral-900"
                        : "rounded border border-neutral-300 px-3 py-1.5 text-sm hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-900"
                    }
                  >
                    {membership.organization.name}
                  </button>
                </form>
              );
            })}
          </div>
        </section>
      )}

      <section className="space-y-2">
        <h2 className="font-medium">Membros</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-200 text-left text-neutral-500 dark:border-neutral-800">
              <th className="py-2 font-medium">Nome</th>
              <th className="py-2 font-medium">E-mail</th>
              <th className="py-2 font-medium">Papel</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id} className="border-b border-neutral-100 dark:border-neutral-900">
                <td className="py-2 font-medium">{member.user.name}</td>
                <td className="py-2 text-neutral-500">{member.user.email}</td>
                <td className="py-2 text-neutral-500">{member.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {canInvite && (
        <section className="space-y-4">
          <h2 className="font-medium">Convidar membro</h2>
          <form
            action={inviteMemberAction}
            className="grid max-w-md gap-3 rounded-lg border border-neutral-200 p-4 dark:border-neutral-800"
          >
            <input name="email" type="email" placeholder="E-mail do convidado" required className={inputClass} />
            <select name="role" defaultValue="MEMBER" className={inputClass}>
              <option value="MEMBER">Membro</option>
              <option value="ADMIN">Admin</option>
            </select>
            <button
              type="submit"
              className="rounded bg-neutral-900 px-3 py-2 text-sm font-medium text-white dark:bg-white dark:text-neutral-900"
            >
              Enviar convite
            </button>
          </form>

          {pendingInvitations.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-neutral-500">Convites pendentes</h3>
              <ul className="space-y-1 text-sm">
                {pendingInvitations.map((invitation) => (
                  <li key={invitation.id} className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">{invitation.email}</span>
                    <span className="text-neutral-500">({invitation.role})</span>
                    <code className="rounded bg-neutral-100 px-2 py-1 text-xs dark:bg-neutral-900">
                      {baseUrl}/invite/{invitation.token}
                    </code>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-neutral-400">
                Um e-mail com esse link é enviado automaticamente se o envio estiver configurado (ver
                RESEND_API_KEY no .env). Se não estiver, copie o link e mande pra pessoa convidada.
              </p>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
