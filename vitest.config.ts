import path from "node:path";
import { defineConfig } from "vitest/config";

// Testes de repositório rodam contra o Postgres real de DATABASE_URL (ver
// .env) — mesma filosofia do resto do projeto: o isolamento multi-tenant só
// é confiável se for verificado contra o banco de verdade, não um mock que
// pode divergir do comportamento real do Prisma/Postgres.
export default defineConfig({
  test: {
    environment: "node",
    setupFiles: ["dotenv/config"],
    include: ["src/**/*.test.ts"],
    testTimeout: 20000,
    hookTimeout: 20000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
