/**
 * Prisma Client singleton for Next.js — Prisma v7 with pg driver adapter.
 *
 * Prisma v7 requires an explicit driver adapter; it no longer reads
 * DATABASE_URL automatically.  We create one Pool per process and cache
 * the PrismaClient on `globalThis` so hot-reload in Next.js dev doesn't
 * exhaust database connections.
 */

import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL

  if (!connectionString) {
    throw new Error(
      'DATABASE_URL is not set. ' +
      'Copy .env.example to .env and fill in the database credentials.'
    )
  }

  const pool = new Pool({ connectionString })
  const adapter = new PrismaPg(pool)

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })
}

export const prisma: PrismaClient =
  globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
