import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createTestOrganization, cleanupOrganizations } from "@/test/helpers";
import { createCompany } from "./companies";
import { createPipeline, createStage } from "./pipelines";
import { createOpportunity, listOpportunities, moveOpportunityStage } from "./opportunities";

describe("opportunities repository", () => {
  let orgA: string;
  let orgB: string;
  let stageA: string;
  let stageA2: string;
  let stageB: string;
  let pipelineAId: string;
  let companyA: string;

  beforeAll(async () => {
    orgA = (await createTestOrganization("Org A Opportunities")).id;
    orgB = (await createTestOrganization("Org B Opportunities")).id;

    const pipelineA = await createPipeline(orgA, { name: "Vendas A" });
    pipelineAId = pipelineA.id;
    stageA = (await createStage(orgA, pipelineA.id, { name: "Qualificação", order: 0, probability: 20 })).id;
    stageA2 = (await createStage(orgA, pipelineA.id, { name: "Proposta", order: 1, probability: 50 })).id;

    const pipelineB = await createPipeline(orgB, { name: "Vendas B" });
    stageB = (await createStage(orgB, pipelineB.id, { name: "Qualificação B", order: 0, probability: 20 })).id;

    companyA = (await createCompany(orgA, { name: "Empresa A" })).id;
  });

  afterAll(() => cleanupOrganizations([orgA, orgB]));

  it("resolves pipelineId from the given stage and links the company", async () => {
    const opportunity = await createOpportunity(orgA, {
      title: "Negócio A",
      valueCents: 150000,
      stageId: stageA,
      companyId: companyA,
    });

    expect(opportunity.pipelineId).toBe(pipelineAId);
    expect(opportunity.companyId).toBe(companyA);

    const list = await listOpportunities(orgA);
    expect(list.map((o) => o.id)).toContain(opportunity.id);
  });

  it("rejects a stage that belongs to another organization", async () => {
    await expect(
      createOpportunity(orgA, { title: "Vazamento", valueCents: 100, stageId: stageB })
    ).rejects.toThrow("Etapa inválida.");
  });

  it("never leaks opportunities across organizations", async () => {
    const listB = await listOpportunities(orgB);
    expect(listB.find((o) => o.title === "Negócio A")).toBeUndefined();
  });

  it("moves an opportunity to another stage of the same organization (kanban drag-and-drop)", async () => {
    const opportunity = await createOpportunity(orgA, { title: "Pra mover", valueCents: 500, stageId: stageA });

    const moved = await moveOpportunityStage(orgA, opportunity.id, stageA2);
    expect(moved.stageId).toBe(stageA2);
    expect(moved.pipelineId).toBe(pipelineAId);
  });

  it("rejects moving an opportunity to a stage from another organization", async () => {
    const opportunity = await createOpportunity(orgA, { title: "Vazamento no drag", valueCents: 500, stageId: stageA });

    await expect(moveOpportunityStage(orgA, opportunity.id, stageB)).rejects.toThrow("Etapa inválida.");
  });

  it("rejects moving an opportunity that belongs to another organization", async () => {
    const opportunity = await createOpportunity(orgA, { title: "Não é seu", valueCents: 500, stageId: stageA });

    await expect(moveOpportunityStage(orgB, opportunity.id, stageA2)).rejects.toThrow("Oportunidade não encontrada.");
  });
});
