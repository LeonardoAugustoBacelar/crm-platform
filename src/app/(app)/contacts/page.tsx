import { auth } from "@/auth";
import { listContacts } from "@/server/repositories/contacts";
import { listCompanies } from "@/server/repositories/companies";
import { createContactAction } from "@/server/actions/contacts";

const inputClass =
  "rounded border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900";

export default async function ContactsPage() {
  const session = await auth();
  if (!session?.user?.organizationId) return null;

  // Sequencial em vez de Promise.all: Postgres locais/gerenciados com pool
  // pequeno (ex: `npx prisma dev`) nem sempre seguram queries concorrentes.
  const contacts = await listContacts(session.user.organizationId);
  const companies = await listCompanies(session.user.organizationId);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Contatos</h1>
        <p className="text-sm text-neutral-500">Pessoas com quem sua equipe se relaciona.</p>
      </div>

      <form
        action={createContactAction}
        className="grid max-w-md gap-3 rounded-lg border border-neutral-200 p-4 dark:border-neutral-800"
      >
        <input name="name" placeholder="Nome do contato" required className={inputClass} />
        <input name="email" type="email" placeholder="E-mail" className={inputClass} />
        <input name="phone" placeholder="Telefone" className={inputClass} />
        <input name="jobTitle" placeholder="Cargo" className={inputClass} />
        <select name="companyId" defaultValue="" className={inputClass}>
          <option value="">Sem empresa vinculada</option>
          {companies.map((company) => (
            <option key={company.id} value={company.id}>
              {company.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded bg-neutral-900 px-3 py-2 text-sm font-medium text-white dark:bg-white dark:text-neutral-900"
        >
          Adicionar contato
        </button>
      </form>

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-neutral-200 text-left text-neutral-500 dark:border-neutral-800">
            <th className="py-2 font-medium">Nome</th>
            <th className="py-2 font-medium">E-mail</th>
            <th className="py-2 font-medium">Cargo</th>
            <th className="py-2 font-medium">Empresa</th>
            <th className="py-2 font-medium">Criado em</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact) => (
            <tr key={contact.id} className="border-b border-neutral-100 dark:border-neutral-900">
              <td className="py-2 font-medium">{contact.name}</td>
              <td className="py-2 text-neutral-500">{contact.email ?? "—"}</td>
              <td className="py-2 text-neutral-500">{contact.jobTitle ?? "—"}</td>
              <td className="py-2 text-neutral-500">{contact.company?.name ?? "—"}</td>
              <td className="py-2 text-neutral-500">{contact.createdAt.toLocaleDateString("pt-BR")}</td>
            </tr>
          ))}
          {contacts.length === 0 && (
            <tr>
              <td colSpan={5} className="py-6 text-center text-neutral-400">
                Nenhum contato cadastrado ainda.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
