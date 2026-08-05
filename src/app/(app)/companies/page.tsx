import { auth } from "@/auth";
import { listCompanies } from "@/server/repositories/companies";
import { createCompanyAction } from "@/server/actions/companies";

const inputClass =
  "rounded border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900";

export default async function CompaniesPage() {
  const session = await auth();
  if (!session?.user?.organizationId) return null;

  const companies = await listCompanies(session.user.organizationId);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Empresas</h1>
        <p className="text-sm text-neutral-500">Contas que sua equipe está trabalhando.</p>
      </div>

      <form
        action={createCompanyAction}
        className="grid max-w-md gap-3 rounded-lg border border-neutral-200 p-4 dark:border-neutral-800"
      >
        <input name="name" placeholder="Nome da empresa" required className={inputClass} />
        <input name="domain" placeholder="Domínio (ex: empresa.com)" className={inputClass} />
        <input name="industry" placeholder="Setor" className={inputClass} />
        <button
          type="submit"
          className="rounded bg-neutral-900 px-3 py-2 text-sm font-medium text-white dark:bg-white dark:text-neutral-900"
        >
          Adicionar empresa
        </button>
      </form>

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-neutral-200 text-left text-neutral-500 dark:border-neutral-800">
            <th className="py-2 font-medium">Nome</th>
            <th className="py-2 font-medium">Domínio</th>
            <th className="py-2 font-medium">Setor</th>
            <th className="py-2 font-medium">Criada em</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((company) => (
            <tr key={company.id} className="border-b border-neutral-100 dark:border-neutral-900">
              <td className="py-2 font-medium">{company.name}</td>
              <td className="py-2 text-neutral-500">{company.domain ?? "—"}</td>
              <td className="py-2 text-neutral-500">{company.industry ?? "—"}</td>
              <td className="py-2 text-neutral-500">{company.createdAt.toLocaleDateString("pt-BR")}</td>
            </tr>
          ))}
          {companies.length === 0 && (
            <tr>
              <td colSpan={4} className="py-6 text-center text-neutral-400">
                Nenhuma empresa cadastrada ainda.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
