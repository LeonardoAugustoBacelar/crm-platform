import { auth } from "@/auth";
import { getOrganizationSummary, getRecentOpportunities } from "@/server/repositories/organizations";

function formatCents(cents: number, currency: string = "BRL") {
  return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency });
}

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.organizationId) return null;

  // Sequencial em vez de Promise.all — ver nota em
  // src/server/repositories/organizations.ts.
  const { organization, companyCount, contactCount, openOpportunityCount, openValueCents } =
    await getOrganizationSummary(session.user.organizationId);
  const recentOpportunities = await getRecentOpportunities(session.user.organizationId, 5);

  const stats = [
    { label: "Empresas", value: String(companyCount) },
    { label: "Contatos", value: String(contactCount) },
    { label: "Oportunidades em aberto", value: String(openOpportunityCount) },
    { label: "Valor em aberto", value: formatCents(openValueCents) },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">{organization.name}</h1>
        <p className="text-sm text-neutral-500">Olá, {session.user.name}.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-800">
            <p className="text-2xl font-semibold">{stat.value}</p>
            <p className="text-sm text-neutral-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <div>
        <h2 className="mb-3 font-medium">Oportunidades recentes</h2>
        <div className="rounded-lg border border-neutral-200 dark:border-neutral-800">
          {recentOpportunities.map((opportunity, index) => (
            <div
              key={opportunity.id}
              className={`flex items-center justify-between gap-4 px-4 py-3 text-sm ${
                index > 0 ? "border-t border-neutral-100 dark:border-neutral-900" : ""
              }`}
            >
              <div className="min-w-0">
                <p className="truncate font-medium">{opportunity.title}</p>
                <p className="truncate text-xs text-neutral-500">
                  {opportunity.stage.name}
                  {opportunity.company ? ` · ${opportunity.company.name}` : ""}
                </p>
              </div>
              <span className="shrink-0 font-medium text-emerald-700 dark:text-emerald-400">
                {formatCents(opportunity.valueCents, opportunity.currency)}
              </span>
            </div>
          ))}
          {recentOpportunities.length === 0 && (
            <p className="px-4 py-6 text-center text-sm text-neutral-400">
              Nenhuma oportunidade cadastrada ainda.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
