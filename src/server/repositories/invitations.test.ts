import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { prisma } from "@/server/db";
import { createTestOrganization, cleanupOrganizations, cleanupUsers, testSlug } from "@/test/helpers";
import {
  acceptInvitationForExistingUser,
  acceptInvitationForNewUser,
  createInvitation,
} from "./invitations";
import { listMembers, listMembershipsForUser } from "./memberships";

describe("invitations + memberships repositories", () => {
  let orgA: string;
  let orgB: string;
  let ownerId: string;
  const userIds: string[] = [];

  beforeAll(async () => {
    orgA = (await createTestOrganization("Org A Invitations")).id;
    orgB = (await createTestOrganization("Org B Invitations")).id;

    const owner = await prisma.user.create({
      data: { name: "Dono", email: `${testSlug("dono")}@teste.com`, passwordHash: "x" },
    });
    ownerId = owner.id;
    userIds.push(owner.id);
    await prisma.membership.create({ data: { organizationId: orgA, userId: owner.id, role: "OWNER" } });
  });

  afterAll(async () => {
    await cleanupOrganizations([orgA, orgB]);
    await cleanupUsers(userIds);
  });

  it("rejects inviting an email that is already a member", async () => {
    const owner = await prisma.user.findUniqueOrThrow({ where: { id: ownerId } });
    await expect(createInvitation(orgA, ownerId, { email: owner.email, role: "MEMBER" })).rejects.toThrow(
      "Esse e-mail já é membro da organização."
    );
  });

  it("accepts an invitation by creating a new account, and rejects reuse", async () => {
    const invite = await createInvitation(orgA, ownerId, {
      email: `${testSlug("convidado")}@teste.com`,
      role: "MEMBER",
    });

    const accepted = await acceptInvitationForNewUser(invite.token, { name: "Convidado", password: "senha1234" });
    userIds.push(accepted.userId);
    expect(accepted.organizationId).toBe(orgA);
    expect(accepted.role).toBe("MEMBER");

    await expect(
      acceptInvitationForNewUser(invite.token, { name: "Outra", password: "senha1234" })
    ).rejects.toThrow("Convite já foi aceito.");

    const members = await listMembers(orgA);
    expect(members.some((m) => m.userId === accepted.userId)).toBe(true);
  });

  it("lets an existing user accept an invitation into a second organization", async () => {
    const user = await prisma.user.create({
      data: { name: "Multi Org", email: `${testSlug("multi")}@teste.com`, passwordHash: "x" },
    });
    userIds.push(user.id);
    await prisma.membership.create({ data: { organizationId: orgA, userId: user.id, role: "MEMBER" } });

    const invite = await createInvitation(orgB, ownerId, { email: user.email, role: "ADMIN" });
    const result = await acceptInvitationForExistingUser(invite.token, user.id);
    expect(result.organizationId).toBe(orgB);
    expect(result.role).toBe("ADMIN");

    const memberships = await listMembershipsForUser(user.id);
    expect(memberships.map((m) => m.organizationId).sort()).toEqual([orgA, orgB].sort());
  });

  it("rejects an expired invitation", async () => {
    const invite = await createInvitation(orgA, ownerId, {
      email: `${testSlug("expirado")}@teste.com`,
      role: "MEMBER",
    });
    await prisma.invitation.update({ where: { id: invite.id }, data: { expiresAt: new Date(Date.now() - 1000) } });

    await expect(
      acceptInvitationForNewUser(invite.token, { name: "Tarde demais", password: "senha1234" })
    ).rejects.toThrow("Convite expirado.");
  });
});
