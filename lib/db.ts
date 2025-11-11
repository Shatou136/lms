import { PrismaClient } from "./generated/prisma";
import { wakeNeon } from "./wakeNeon";


await wakeNeon();  //neon gpt soln line

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;


