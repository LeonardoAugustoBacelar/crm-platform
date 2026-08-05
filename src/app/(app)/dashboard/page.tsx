import { auth } from "@/auth";
import { getOrganizationSummary } from "@/server/repositories/organizations";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.organizationId) return null;

  const { organization, companyCount, contactCount, openOpportunityCount } =
    await getOrganizationSummary(session.user.organizationId);

  const stats = [
    { label: "Empresas", value: companyCount },
    { label: "Contatos", value: contactCount },
    { label: "Oportunidades em aberto", value: openOpportunityCount },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">{organization.name}</h1>
        <p className="text-sm text-neutral-500">Olá, {session.user.name}.</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-800">
            <p className="text-2xl font-semibold">{stat.value}</p>
            <p className="text-sm text-neutral-500">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
