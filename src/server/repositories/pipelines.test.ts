import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createTestOrganization, cleanupOrganizations } from "@/test/helpers";
import { createPipeline, createStage, listPipelines } from "./pipelines";

describe("pipelines repository", () => {
  let orgA: string;
  let orgB: string;
  let pipelineA: string;
  let pipelineB: string;

  beforeAll(async () => {
    orgA = (await createTestOrganization("Org A Pipelines")).id;
    orgB = (await createTestOrganization("Org B Pipelines")).id;
    pipelineA = (await createPipeline(orgA, { name: "Vendas A" })).id;
    pipelineB = (await createPipeline(orgB, { name: "Vendas B" })).id;
  });

  afterAll(() => cleanupOrganizations([orgA, orgB]));

  it("creates a stage under a pipeline of the same organization", async () => {
    const stage = await createStage(orgA, pipelineA, { name: "Qualificação", order: 0, probability: 20 });
    expect(stage.pipelineId).toBe(pipelineA);

    const pipelines = await listPipelines(orgA);
    const found = pipelines.find((p) => p.id === pipelineA);
    expect(found?.stages.map((s) => s.id)).toContain(stage.id);
  });

  it("rejects creating a stage under a pipeline from another organization", async () => {
    await expect(
      createStage(orgA, pipelineB, { name: "Vazamento", order: 0, probability: 0 })
    ).rejects.toThrow("Pipeline inválido.");
  });

  it("never leaks pipelines across organizations", async () => {
    const listB = await listPipelines(orgB);
    expect(listB.find((p) => p.id === pipelineA)).toBeUndefined();
  });
});
