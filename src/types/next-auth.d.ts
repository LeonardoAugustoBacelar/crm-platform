import type { DefaultSession } from "next-auth";
import type { Role } from "@/generated/prisma/client";

declare module "next-auth" {
  interface User {
    organizationId?: string | null;
    role?: Role | null;
  }

  interface Session {
    user: {
      id: string;
      organizationId: string | null;
      role: Role | null;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    organizationId?: string | null;
    role?: Role | null;
  }
}

// A interface JWT é declarada de fato em @auth/core/jwt — "next-auth/jwt"
// só reexporta. As assinaturas internas do NextAuthConfig referenciam o
// módulo original, então precisamos aumentar os dois pra o tipo colar.
declare module "@auth/core/jwt" {
  interface JWT {
    organizationId?: string | null;
    role?: Role | null;
  }
}
