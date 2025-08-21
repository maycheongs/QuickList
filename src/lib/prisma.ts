// src/lib/prisma.ts
import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;

export function getPrismaClient() {
    if (!prisma) {
        prisma = new PrismaClient({ log: ["query", "warn", "error"] });
    }
    return prisma;
}
