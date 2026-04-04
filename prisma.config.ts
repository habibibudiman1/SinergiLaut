import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  earlyAccess: true,
  schema: "prisma/schema.prisma",
  datasource: {
    // Gunakan DIRECT_URL untuk migrations/push, DATABASE_URL untuk runtime
    url: process.env.DIRECT_URL || process.env.DATABASE_URL!,
  },
});
