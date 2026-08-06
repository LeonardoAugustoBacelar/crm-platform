import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createTestOrganization, cleanupOrganizations } from "@/test/helpers";
import { createCompany } from "./companies";
import { createContact, listContacts } from "./contacts";

describe("contacts repository", () => {
  let orgA: string;
  let orgB: string;
  let companyA: string;
  let companyB: string;

  beforeAll(async () => {
    orgA = (await createTestOrganization("Org A Contacts")).id;
    orgB = (await createTestOrganization("Org B Contacts")).id;
    companyA = (await createCompany(orgA, { name: "Empresa A" })).id;
    companyB = (await createCompany(orgB, { name: "Empresa B" })).id;
  });

  afterAll(() => cleanupOrganizations([orgA, orgB]));

  it("creates a contact linked to a company in the same organization", async () => {
    const contact = await createContact(orgA, { name: "Fulano", companyId: companyA });
    expect(contact.companyId).toBe(companyA);

    const contacts = await listContacts(orgA);
    expect(contacts.map((c) => c.id)).toContain(contact.id);
  });

  it("rejects linking a contact to a company from another organization", async () => {
    await expect(createContact(orgA, { name: "Vazamento", companyId: companyB })).rejects.toThrow(
      "Empresa inválida."
    );
  });

  it("never leaks contacts across organizations", async () => {
    await createContact(orgA, { name: "Só na A" });
    const listB = await listContacts(orgB);
    expect(listB.find((c) => c.name === "Só na A")).toBeUndefined();
  });
});
