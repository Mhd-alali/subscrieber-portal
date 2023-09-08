import { PrismaClient } from "@prisma/client";

/** @type {PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>} */
export const prisma = globalThis.prisma ?? new PrismaClient({ log: ["query"], });

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;