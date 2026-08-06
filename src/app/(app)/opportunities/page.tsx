import { auth } from "@/auth";
import { listOpportunities } from "@/server/repositories/opportunities";
import { listPipelines } from "@/server/repositories/pipelines";
import { listCompanies } from "@/server/repositories/companies";
import { listContacts } from "@/server/repositories/contacts";
import { createOpportunityAction } from "@/server/actions/opportunities";
import { KanbanBoard } from "@/components/kanban-board";

const inputClass =
  "rounded border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900";

export default async function OpportunitiesPage() {
  const session = await auth();
  if (!session?.user?.organizationId) return null;

  // Sequencial em vez de Promise.all: Postgres locais/gerenciados com pool
  // pequeno (ex: `npx prisma dev`) nem sempre seguram queries concorrentes.
  const opportunities = await listOpportunities(session.user.organizationId);
  const pipelines = await listPipelines(session.user.organizationId);
  const companies = await listCompanies(session.user.organizationId);
  const contacts = await listContacts(session.user.organizationId);

  const hasStages = pipelines.some((pipeline) => pipeline.stages.length > 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Oportunidades</h1>
        <p className="text-sm text-neutral-500">Negócios em andamento com suas contas.</p>
      </div>

      {hasStages ? (
        <form
          action={createOpportunityAction}
          className="grid max-w-md gap-3 rounded-lg border border-neutral-200 p-4 dark:border-neutral-800"
        >
          <input name="title" placeholder="Título da oportunidade" required className={inputClass} />
          <input
            name="value"
            type="number"
            step="0.01"
            min="0"
            placeholder="Valor (R$)"
            required
            className={inputClass}
          />
          <select name="stageId" required defaultValue="" className={inputClass}>
            <option value="" disabled>
              Etapa do pipeline
            </option>
            {pipelines.map((pipeline) => (
              <optgroup key={pipeline.id} label={pipeline.name}>
                {pipeline.stages.map((stage) => (
                  <option key={stage.id} value={stage.id}>
                    {stage.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <select name="companyId" defaultValue="" className={inputClass}>
            <option value="">Sem empresa vinculada</option>
            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
          <select name="contactId" defaultValue="" className={inputClass}>
            <option value="">Sem contato vinculado</option>
            {contacts.map((contact) => (
              <option key={contact.id} value={contact.id}>
                {contact.name}
              </option>
            ))}
          </select>
          <div className="grid gap-1">
            <label className="text-xs text-neutral-500">Previsão de fechamento</label>
            <input name="expectedCloseDate" type="date" className={inputClass} />
          </div>
          <button
            type="submit"
            className="rounded bg-neutral-900 px-3 py-2 text-sm font-medium text-white dark:bg-white dark:text-neutral-900"
          >
            Adicionar oportunidade
          </button>
        </form>
      ) : (
        <p className="max-w-md text-sm text-neutral-500">
          Crie um pipeline com pelo menos uma etapa em{" "}
          <a href="/pipelines" className="underline">
            Pipeline
          </a>{" "}
          antes de cadastrar oportunidades.
        </p>
      )}

      {hasStages && (
        <KanbanBoard
          pipelines={pipelines.map((pipeline) => ({
            id: pipeline.id,
            name: pipeline.name,
            stages: pipeline.stages.map((stage) => ({
              id: stage.id,
              name: stage.name,
              order: stage.order,
              probability: stage.probability,
            })),
          }))}
          opportunities={opportunities.map((opportunity) => ({
            id: opportunity.id,
            title: opportunity.title,
            valueCents: opportunity.valueCents,
            currency: opportunity.currency,
            companyName: opportunity.company?.name ?? null,
            stageId: opportunity.stageId,
          }))}
        />
      )}
    </div>
  );
}
