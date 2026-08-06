import { prisma } from "@/server/db";

export function testSlug(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function createTestOrganization(name: string) {
  return prisma.organization.create({ data: { name, slug: testSlug(name.toLowerCase()) } });
}

export function cleanupOrganizations(organizationIds: string[]) {
  return prisma.organization.deleteMany({ where: { id: { in: organizationIds } } });
}

export function cleanupUsers(userIds: string[]) {
  return prisma.user.deleteMany({ where: { id: { in: userIds } } });
}
