import { auth } from "@/auth";
import { listPipelines } from "@/server/repositories/pipelines";
import { createPipelineAction, createStageAction } from "@/server/actions/pipelines";

const inputClass =
  "rounded border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900";

export default async function PipelinesPage() {
  const session = await auth();
  if (!session?.user?.organizationId) return null;

  const pipelines = await listPipelines(session.user.organizationId);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Pipeline</h1>
        <p className="text-sm text-neutral-500">
          Funis de venda e suas etapas. Uma oportunidade sempre pertence a um pipeline e a uma etapa dele.
        </p>
      </div>

      <form
        action={createPipelineAction}
        className="grid max-w-md gap-3 rounded-lg border border-neutral-200 p-4 dark:border-neutral-800"
      >
        <input name="name" placeholder="Nome do pipeline (ex: Vendas Novas)" required className={inputClass} />
        <button
          type="submit"
          className="rounded bg-neutral-900 px-3 py-2 text-sm font-medium text-white dark:bg-white dark:text-neutral-900"
        >
          Criar pipeline
        </button>
      </form>

      <div className="space-y-6">
        {pipelines.map((pipeline) => (
          <div key={pipeline.id} className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-800">
            <h2 className="mb-3 font-medium">{pipeline.name}</h2>

            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200 text-left text-neutral-500 dark:border-neutral-800">
                  <th className="py-2 font-medium">Etapa</th>
                  <th className="py-2 font-medium">Ordem</th>
                  <th className="py-2 font-medium">Probabilidade</th>
                </tr>
              </thead>
              <tbody>
                {pipeline.stages.map((stage) => (
                  <tr key={stage.id} className="border-b border-neutral-100 dark:border-neutral-900">
                    <td className="py-2 font-medium">{stage.name}</td>
                    <td className="py-2 text-neutral-500">{stage.order}</td>
                    <td className="py-2 text-neutral-500">{stage.probability}%</td>
                  </tr>
                ))}
                {pipeline.stages.length === 0 && (
                  <tr>
                    <td colSpan={3} className="py-4 text-center text-neutral-400">
                      Nenhuma etapa ainda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <form action={createStageAction} className="mt-4 flex flex-wrap items-end gap-2">
              <input type="hidden" name="pipelineId" value={pipeline.id} />
              <div className="grid gap-1">
                <label className="text-xs text-neutral-500">Nome da etapa</label>
                <input name="name" placeholder="Ex: Qualificação" required className={inputClass} />
              </div>
              <div className="grid gap-1">
                <label className="text-xs text-neutral-500">Ordem</label>
                <input
                  name="order"
                  type="number"
                  min={0}
                  defaultValue={pipeline.stages.length}
                  required
                  className={`${inputClass} w-20`}
                />
              </div>
              <div className="grid gap-1">
                <label className="text-xs text-neutral-500">Probabilidade %</label>
                <input
                  name="probability"
                  type="number"
                  min={0}
                  max={100}
                  defaultValue={0}
                  required
                  className={`${inputClass} w-24`}
                />
              </div>
              <button
                type="submit"
                className="rounded bg-neutral-900 px-3 py-2 text-sm font-medium text-white dark:bg-white dark:text-neutral-900"
              >
                Adicionar etapa
              </button>
            </form>
          </div>
        ))}
        {pipelines.length === 0 && (
          <p className="text-sm text-neutral-400">Nenhum pipeline cadastrado ainda.</p>
        )}
      </div>
    </div>
  );
}
