import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";
import bcrypt from "bcryptjs";
import { authConfig } from "@/auth.config";
import { prisma } from "@/server/db";
import { slugify } from "@/lib/slugify";

// Login social não usa Prisma Adapter (evita as tabelas Account/Session/
// VerificationToken e o atrito de tipos do client custom-output do Prisma 7
// com @auth/prisma-adapter): a conta OAuth é resolvida à mão no callback
// `signIn` abaixo, do mesmo jeito que o Credentials já resolve no
// `authorize()` — um único lugar (Membership) decide a organização do
// usuário, adapter ou não.
const providers: NextAuthConfig["providers"] = [
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
      // passwordHash é null pra conta criada só via login social (ver
      // schema.prisma) — sem senha, não tem como logar por Credentials.
      if (!user || !user.passwordHash) return null;

      const validPassword = await bcrypt.compare(password, user.passwordHash);
      if (!validPassword) return null;

      // Organização "ativa" ao logar é a primeira membership; quem tem mais
      // de uma pode trocar depois em /settings (ver switchOrganizationAction).
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
];

// Cada provider OAuth só entra na lista se as credenciais dele estiverem
// configuradas — sem isso o botão de login social simplesmente não aparece,
// em vez de quebrar o boot do app. Ver README pra como obter essas credenciais.
if (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) {
  providers.push(
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    })
  );
}

if (process.env.AUTH_MICROSOFT_ENTRA_ID_ID && process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET) {
  providers.push(
    MicrosoftEntraID({
      clientId: process.env.AUTH_MICROSOFT_ENTRA_ID_ID,
      clientSecret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET,
      issuer: process.env.AUTH_MICROSOFT_ENTRA_ID_ISSUER,
    })
  );
}

export const { handlers, auth, signIn, signOut, unstable_update } = NextAuth({
  ...authConfig,
  providers,
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user, account }) {
      // Credentials já devolve organizationId/role prontos do authorize()
      // acima — só o fluxo OAuth precisa ser resolvido aqui.
      if (!account || account.provider === "credentials") return true;
      if (!user.email) return false;

      const existing = await prisma.user.findUnique({
        where: { email: user.email },
        include: { memberships: true },
      });

      if (existing) {
        const membership = existing.memberships[0];
        user.id = existing.id;
        user.organizationId = membership?.organizationId ?? null;
        user.role = membership?.role ?? null;
        return true;
      }

      // Primeiro login via OAuth pra esse e-mail: cria organização + usuário
      // + membership OWNER numa transação, mesmo padrão do signup por
      // credenciais (ver src/server/actions/auth.ts) — só que sem pedir o
      // nome da organização, já que não tem formulário nesse fluxo.
      const displayName = user.name ?? user.email.split("@")[0];
      const baseSlug = slugify(displayName) || "org";
      const slug = `${baseSlug}-${Math.random().toString(36).slice(2, 7)}`;

      const created = await prisma.$transaction(async (tx) => {
        const organization = await tx.organization.create({
          data: { name: `Organização de ${displayName}`, slug },
        });
        const newUser = await tx.user.create({
          data: { name: displayName, email: user.email! },
        });
        await tx.membership.create({
          data: { organizationId: organization.id, userId: newUser.id, role: "OWNER" },
        });
        return { organization, newUser };
      });

      user.id = created.newUser.id;
      user.organizationId = created.organization.id;
      user.role = "OWNER";
      return true;
    },
  },
});
