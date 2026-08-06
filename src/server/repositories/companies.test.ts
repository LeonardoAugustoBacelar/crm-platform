import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createTestOrganization, cleanupOrganizations } from "@/test/helpers";
import { createCompany, listCompanies } from "./companies";

describe("companies repository", () => {
  let orgA: string;
  let orgB: string;

  beforeAll(async () => {
    orgA = (await createTestOrganization("Org A Companies")).id;
    orgB = (await createTestOrganization("Org B Companies")).id;
  });

  afterAll(() => cleanupOrganizations([orgA, orgB]));

  it("creates a company scoped to the organization", async () => {
    const company = await createCompany(orgA, { name: "Acme" });
    expect(company.name).toBe("Acme");

    const companies = await listCompanies(orgA);
    expect(companies.map((c) => c.id)).toContain(company.id);
  });

  it("never leaks companies across organizations", async () => {
    await createCompany(orgA, { name: "Only in A" });
    const listB = await listCompanies(orgB);
    expect(listB.find((c) => c.name === "Only in A")).toBeUndefined();
  });
});
