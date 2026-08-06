import type { NextAuthConfig } from "next-auth";

const PROTECTED_PREFIXES = [
  "/dashboard",
  "/companies",
  "/contacts",
  "/opportunities",
  "/pipelines",
  "/settings",
];

/**
 * Config "leve", sem providers com dependências Node (bcrypt, Prisma) — é a
 * que roda no middleware (Edge). O `authorize()` do Credentials provider
 * fica só em src/auth.ts, importado nos Server Actions/Route Handlers.
 */
export const authConfig: NextAuthConfig = {
  pages: { signIn: "/login" },
  session: { strategy: "jwt" },
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      // Isso é só a primeira barreira (evita render/gasto de trabalho pra
      // quem não tem sessão). A barreira de verdade é cada Server Action
      // checar `auth()` de novo por conta própria (ver
      // src/server/actions/*.ts) — nunca confiar só nisso aqui pra proteger
      // mutações, como o próprio guia do Next.js recomenda.
      const isProtected = PROTECTED_PREFIXES.some((prefix) =>
        request.nextUrl.pathname.startsWith(prefix)
      );
      if (!isProtected) return true;
      return !!auth?.user;
    },
    jwt({ token, user, trigger, session }) {
      if (user) {
        token.organizationId = user.organizationId;
        token.role = user.role;
      }
      // Troca de organização (switchOrganizationAction) e aceite de convite
      // por usuário já logado chamam unstable_update({ user: {...} }), que
      // chega aqui como trigger "update" — sem tratar isso, o token nunca
      // reflete a nova organizationId/role (só `user` cobre o login inicial).
      if (trigger === "update" && session?.user) {
        if (session.user.organizationId !== undefined) {
          token.organizationId = session.user.organizationId;
        }
        if (session.user.role !== undefined) {
          token.role = session.user.role;
        }
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.sub as string;
      session.user.organizationId = token.organizationId ?? null;
      session.user.role = token.role ?? null;
      return session;
    },
  },
};
