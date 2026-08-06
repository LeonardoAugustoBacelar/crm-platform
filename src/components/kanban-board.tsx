"use client";

import { useState, useTransition } from "react";
import { moveOpportunityAction } from "@/server/actions/opportunities";

export type KanbanStage = { id: string; name: string; order: number; probability: number };
export type KanbanPipeline = { id: string; name: string; stages: KanbanStage[] };
export type KanbanOpportunity = {
  id: string;
  title: string;
  valueCents: number;
  currency: string;
  companyName: string | null;
  stageId: string;
};

function formatCents(cents: number, currency: string) {
  return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency });
}

export function KanbanBoard({
  pipelines,
  opportunities,
}: {
  pipelines: KanbanPipeline[];
  opportunities: KanbanOpportunity[];
}) {
  const [activePipelineId, setActivePipelineId] = useState(pipelines[0]?.id);
  const [dragOverStage, setDragOverStage] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [overrides, setOverrides] = useState<Record<string, string>>({});
  const [, startTransition] = useTransition();

  const pipeline = pipelines.find((p) => p.id === activePipelineId) ?? pipelines[0];
  if (!pipeline) return null;

  function stageOpportunities(stageId: string) {
    return opportunities.filter((o) => (overrides[o.id] ?? o.stageId) === stageId);
  }

  function handleDrop(stageId: string) {
    setDragOverStage(null);
    const opportunityId = draggingId;
    setDraggingId(null);
    if (!opportunityId) return;
    if ((overrides[opportunityId] ?? opportunities.find((o) => o.id === opportunityId)?.stageId) === stageId) {
      return;
    }

    setOverrides((prev) => ({ ...prev, [opportunityId]: stageId }));
    startTransition(async () => {
      try {
        await moveOpportunityAction(opportunityId, stageId);
      } catch {
        setOverrides((prev) => {
          const next = { ...prev };
          delete next[opportunityId];
          return next;
        });
      }
    });
  }

  return (
    <div>
      {pipelines.length > 1 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {pipelines.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setActivePipelineId(p.id)}
              className={
                p.id === pipeline.id
                  ? "rounded-full bg-neutral-900 px-3 py-1.5 text-sm text-white dark:bg-white dark:text-neutral-900"
                  : "rounded-full border border-neutral-300 px-3 py-1.5 text-sm hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-900"
              }
            >
              {p.name}
            </button>
          ))}
        </div>
      )}

      <div className="flex gap-4 overflow-x-auto pb-4">
        {pipeline.stages.map((stage) => {
          const cards = stageOpportunities(stage.id);
          const totalCents = cards.reduce((sum, o) => sum + o.valueCents, 0);
          const isOver = dragOverStage === stage.id;

          return (
            <div
              key={stage.id}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOverStage(stage.id);
              }}
              onDragLeave={() => setDragOverStage((current) => (current === stage.id ? null : current))}
              onDrop={(e) => {
                e.preventDefault();
                handleDrop(stage.id);
              }}
              className={`flex w-72 shrink-0 flex-col rounded-lg border p-3 transition-colors ${
                isOver
                  ? "border-emerald-500 bg-emerald-50 dark:border-emerald-400 dark:bg-emerald-500/10"
                  : "border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/40"
              }`}
            >
              <div className="mb-3 px-1">
                <h3 className="font-medium">{stage.name}</h3>
                <p className="text-xs text-neutral-500">
                  {formatCents(totalCents, "BRL")} · {cards.length}{" "}
                  {cards.length === 1 ? "oportunidade" : "oportunidades"}
                </p>
              </div>

              <div className="flex flex-col gap-2">
                {cards.map((opportunity) => (
                  <div
                    key={opportunity.id}
                    draggable
                    onDragStart={() => setDraggingId(opportunity.id)}
                    onDragEnd={() => {
                      setDraggingId(null);
                      setDragOverStage(null);
                    }}
                    className={`cursor-grab rounded-md border border-neutral-200 bg-white p-3 text-sm shadow-sm active:cursor-grabbing dark:border-neutral-800 dark:bg-neutral-950 ${
                      draggingId === opportunity.id ? "opacity-40" : ""
                    }`}
                  >
                    <p className="font-medium">{opportunity.title}</p>
                    <p className="mt-1 text-emerald-700 dark:text-emerald-400">
                      {formatCents(opportunity.valueCents, opportunity.currency)}
                    </p>
                    {opportunity.companyName && (
                      <p className="mt-1 truncate text-xs text-neutral-500">{opportunity.companyName}</p>
                    )}
                  </div>
                ))}
                {cards.length === 0 && (
                  <p className="rounded-md border border-dashed border-neutral-300 p-3 text-center text-xs text-neutral-400 dark:border-neutral-700">
                    Arraste uma oportunidade pra cá
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
