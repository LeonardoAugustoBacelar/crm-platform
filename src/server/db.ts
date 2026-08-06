import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

// Prisma 7 não lê mais DATABASE_URL sozinho a partir do schema — o client
// exige um driver adapter explícito (ver prisma/schema.prisma, datasource
// sem `url`). https://pris.ly/d/prisma7-client-config
function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL não configurada (veja .env.example).");
  }

  // @prisma/adapter-pg delega a pool pro driver `pg` puro — os parâmetros
  // de query string do estilo antigo do Prisma (connection_limit,
  // pool_timeout, max_idle_connection_lifetime etc.) são específicos do
  // engine Rust antigo e o `pg` simplesmente os ignora. Config real de pool
  // via objeto: idleTimeoutMillis baixo evita reusar uma conexão que o
  // Postgres local (`npx prisma dev`) já derrubou silenciosamente por
  // inatividade — sem isso, uma segunda requisição minutos depois da
  // primeira falha com "Connection terminated unexpectedly".
  const adapter = new PrismaPg({
    connectionString,
    max: 5,
    idleTimeoutMillis: 5_000,
    connectionTimeoutMillis: 10_000,
  });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
