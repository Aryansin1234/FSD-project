/**
 * Server-side data fetching helpers.
 *
 * These run only on the server (in Server Components or Route Handlers).
 * They return plain objects shaped like the mock-data types so existing
 * client components keep working without modification.
 */

import { prisma } from './prisma'

// ── Overview / Dashboard ───────────────────────────────────────────────────

/** Fetch the current user with their skills, tasks and burnout snapshot. */
export async function getUserDashboard(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    include: {
      skills: { include: { skill: true } },
      tasksAssigned: {
        where: { status: { not: 'completed' } },
        orderBy: { deadline: 'asc' },
        include: {
          project: true,
          requiredSkills: { include: { skill: true } },
        },
      },
      burnoutSnapshots: {
        orderBy: { weekStart: 'desc' },
        take: 1,
      },
    },
  })
}

// ── Tasks ──────────────────────────────────────────────────────────────────

export async function getAllTasks() {
  return prisma.task.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      project:       true,
      assignedTo:    { select: { id: true, firstName: true, lastName: true } },
      requiredSkills: { include: { skill: true } },
    },
  })
}

export async function getTasksByUser(userId: string) {
  return prisma.task.findMany({
    where: { assignedToId: userId },
    orderBy: { deadline: 'asc' },
    include: {
      project:       true,
      requiredSkills: { include: { skill: true } },
    },
  })
}

// ── Skills ─────────────────────────────────────────────────────────────────

export async function getSkillTaxonomy() {
  return prisma.skill.findMany({
    where: { isActive: true },
    orderBy: [{ category: 'asc' }, { name: 'asc' }],
  })
}

export async function getUserSkills(userId: string) {
  return prisma.userSkill.findMany({
    where: { userId },
    include: {
      skill: true,
      endorsements: {
        include: { endorser: { select: { firstName: true, lastName: true } } },
      },
    },
    orderBy: [{ proficiency: 'desc' }, { skill: { name: 'asc' } }],
  })
}

// ── Projects ───────────────────────────────────────────────────────────────

export async function getProjects() {
  return prisma.project.findMany({
    orderBy: { startDate: 'asc' },
    include: {
      owner:  { select: { id: true, firstName: true, lastName: true } },
      tasks:  { select: { id: true, status: true } },
    },
  })
}

// ── Team (manager view) ────────────────────────────────────────────────────

export async function getTeamMembers(managerId: string) {
  return prisma.user.findMany({
    where: { managerId, isActive: true },
    include: {
      skills: { include: { skill: true } },
      tasksAssigned: {
        where: { status: { notIn: ['completed', 'cancelled'] } },
        select: { id: true, status: true, estimatedHours: true },
      },
      burnoutSnapshots: {
        orderBy: { weekStart: 'desc' },
        take: 1,
      },
    },
  })
}

// ── Effort Logs ────────────────────────────────────────────────────────────

export async function getEffortLogs(userId: string) {
  return prisma.effortLog.findMany({
    where: { userId },
    orderBy: { date: 'desc' },
    include: {
      task: {
        select: { title: true, project: { select: { name: true } } },
      },
    },
  })
}

// ── Analytics ──────────────────────────────────────────────────────────────

export async function getBurnoutSnapshots(managerId: string) {
  // Get all direct reports' snapshots for the latest week
  const reports = await prisma.user.findMany({
    where: { managerId },
    select: { id: true },
  })
  const ids = reports.map(r => r.id)

  return prisma.burnoutSnapshot.findMany({
    where: { userId: { in: ids } },
    orderBy: { weekStart: 'desc' },
    include: {
      user: { select: { id: true, firstName: true, lastName: true, role: true } },
    },
  })
}

export async function getAuditLogs(limit = 50) {
  return prisma.auditLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: {
      actor: { select: { firstName: true, lastName: true } },
    },
  })
}

// ── Notifications ──────────────────────────────────────────────────────────

export async function getNotifications(userId: string) {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 20,
  })
}

export async function markNotificationRead(notifId: string) {
  return prisma.notification.update({
    where: { id: notifId },
    data: { read: true },
  })
}
