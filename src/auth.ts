import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { authConfig } from "@/auth.config";
import { prisma } from "@/server/db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "E-mail" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        const email = typeof credentials?.email === "string" ? credentials.email : undefined;
        const password = typeof credentials?.password === "string" ? credentials.password : undefined;
        if (!email || !password) return null;

        const user = await prisma.user.findUnique({
          where: { email },
          include: { memberships: true },
        });
        if (!user) return null;

        const validPassword = await bcrypt.compare(password, user.passwordHash);
        if (!validPassword) return null;

        // MVP: assume um usuário pertence a uma organização só (a primeira
        // membership). Suporte a múltiplas organizações por usuário fica
        // pro roadmap — ver README.
        const membership = user.memberships[0];

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          organizationId: membership?.organizationId ?? null,
          role: membership?.role ?? null,
        };
      },
    }),
  ],
});
