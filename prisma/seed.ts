/**
 * SkillForge — Prisma Seed Script
 *
 * Idempotent: running multiple times will not create duplicate records.
 * Uses upsert throughout so it is safe to re-run after schema changes.
 */

import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient, UserRole, SkillCategory, TaskStatus, TaskPriority, ProjectStatus, EffortStatus, BurnoutBand, NotificationType } from '@prisma/client'
import bcrypt from 'bcryptjs'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Seeding SkillForge database...')

  // ── Department ────────────────────────────────────────────────────────────
  const deptEng = await prisma.department.upsert({
    where: { id: 'dept-eng-001' },
    update: { name: 'Engineering' },
    create: { id: 'dept-eng-001', name: 'Engineering' },
  })

  const deptProduct = await prisma.department.upsert({
    where: { id: 'dept-prod-001' },
    update: { name: 'Product' },
    create: { id: 'dept-prod-001', name: 'Product' },
  })

  console.log('  Departments seeded.')

  // ── Skills taxonomy ───────────────────────────────────────────────────────
  const skillsData = [
    { id: 'skill-react',     name: 'React',           slug: 'react',           category: SkillCategory.technical,     description: 'React.js frontend framework' },
    { id: 'skill-ts',        name: 'TypeScript',      slug: 'typescript',      category: SkillCategory.technical,     description: 'Typed superset of JavaScript' },
    { id: 'skill-nodejs',    name: 'Node.js',          slug: 'nodejs',          category: SkillCategory.technical,     description: 'Server-side JavaScript runtime' },
    { id: 'skill-postgres',  name: 'PostgreSQL',      slug: 'postgresql',      category: SkillCategory.technical,     description: 'Relational database' },
    { id: 'skill-css',       name: 'CSS/Tailwind',    slug: 'css-tailwind',    category: SkillCategory.technical,     description: 'Styling and utility-first CSS' },
    { id: 'skill-sysdesign', name: 'System Design',   slug: 'system-design',   category: SkillCategory.domain,        description: 'Large-scale system architecture' },
    { id: 'skill-leadership',name: 'Leadership',      slug: 'leadership',      category: SkillCategory.soft,          description: 'Team leadership and people management' },
    { id: 'skill-aws',       name: 'AWS',             slug: 'aws',             category: SkillCategory.tool,          description: 'Amazon Web Services cloud platform' },
    { id: 'skill-docker',    name: 'Docker',          slug: 'docker',          category: SkillCategory.tool,          description: 'Container platform' },
    { id: 'skill-figma',     name: 'Figma',           slug: 'figma',           category: SkillCategory.tool,          description: 'UI/UX design tool' },
    { id: 'skill-k8s',       name: 'Kubernetes',      slug: 'kubernetes',      category: SkillCategory.tool,          description: 'Container orchestration' },
    { id: 'skill-python',    name: 'Python',          slug: 'python',          category: SkillCategory.technical,     description: 'Python programming language' },
    { id: 'skill-graphql',   name: 'GraphQL',         slug: 'graphql',         category: SkillCategory.technical,     description: 'Query language for APIs' },
    { id: 'skill-comms',     name: 'Communication',   slug: 'communication',   category: SkillCategory.soft,          description: 'Verbal and written communication' },
    { id: 'skill-problem',   name: 'Problem Solving', slug: 'problem-solving', category: SkillCategory.soft,          description: 'Analytical problem-solving' },
  ]

  for (const skill of skillsData) {
    await prisma.skill.upsert({
      where: { id: skill.id },
      update: { name: skill.name, category: skill.category },
      create: skill,
    })
  }

  console.log('  Skills taxonomy seeded.')

  // ── Users ─────────────────────────────────────────────────────────────────
  const passwordHash = await bcrypt.hash('demo1234', 12)

  // Manager first (so employees can reference managerId)
  const manager = await prisma.user.upsert({
    where: { email: 'alex.rivera@skillforge.io' },
    update: {},
    create: {
      id:           'user-alex-001',
      email:        'alex.rivera@skillforge.io',
      passwordHash,
      firstName:    'Alex',
      lastName:     'Rivera',
      role:         UserRole.manager,
      departmentId: deptEng.id,
      location:     'New York, NY',
      bio:          'Tech Lead with 10 years building distributed systems.',
    },
  })

  const sarah = await prisma.user.upsert({
    where: { email: 'sarah.chen@skillforge.io' },
    update: {},
    create: {
      id:           'user-sarah-001',
      email:        'sarah.chen@skillforge.io',
      passwordHash,
      firstName:    'Sarah',
      lastName:     'Chen',
      role:         UserRole.employee,
      departmentId: deptEng.id,
      managerId:    manager.id,
      location:     'San Francisco, CA',
      bio:          'Full-stack engineer with 5 years building scalable web applications.',
    },
  })

  const marcus = await prisma.user.upsert({
    where: { email: 'marcus.johnson@skillforge.io' },
    update: {},
    create: {
      id:           'user-marcus-001',
      email:        'marcus.johnson@skillforge.io',
      passwordHash,
      firstName:    'Marcus',
      lastName:     'Johnson',
      role:         UserRole.employee,
      departmentId: deptEng.id,
      managerId:    manager.id,
      location:     'Austin, TX',
      bio:          'Backend engineer specialising in high-throughput data systems.',
    },
  })

  const priya = await prisma.user.upsert({
    where: { email: 'priya.patel@skillforge.io' },
    update: {},
    create: {
      id:           'user-priya-001',
      email:        'priya.patel@skillforge.io',
      passwordHash,
      firstName:    'Priya',
      lastName:     'Patel',
      role:         UserRole.employee,
      departmentId: deptEng.id,
      managerId:    manager.id,
      location:     'Seattle, WA',
      bio:          'Frontend engineer passionate about accessible, pixel-perfect UIs.',
    },
  })

  const david = await prisma.user.upsert({
    where: { email: 'david.kim@skillforge.io' },
    update: {},
    create: {
      id:           'user-david-001',
      email:        'david.kim@skillforge.io',
      passwordHash,
      firstName:    'David',
      lastName:     'Kim',
      role:         UserRole.employee,
      departmentId: deptEng.id,
      managerId:    manager.id,
      location:     'Chicago, IL',
      bio:          'DevOps engineer focused on infrastructure reliability and CI/CD.',
    },
  })

  const admin = await prisma.user.upsert({
    where: { email: 'admin@skillforge.io' },
    update: {},
    create: {
      id:           'user-admin-001',
      email:        'admin@skillforge.io',
      passwordHash,
      firstName:    'System',
      lastName:     'Admin',
      role:         UserRole.admin,
      departmentId: deptProduct.id,
      location:     'Remote',
    },
  })

  console.log('  Users seeded.')

  // ── User Skills ───────────────────────────────────────────────────────────
  type UserSkillInput = {
    id: string
    userId: string
    skillId: string
    proficiency: number
    source: 'self' | 'manager' | 'ai_inferred' | 'certification' | 'peer'
    verified: boolean
    lastUsedAt?: Date
  }

  const userSkillsData: UserSkillInput[] = [
    // Sarah
    { id: 'us-sarah-react',     userId: sarah.id,  skillId: 'skill-react',     proficiency: 5, source: 'self',       verified: true,  lastUsedAt: new Date('2026-09-25') },
    { id: 'us-sarah-ts',        userId: sarah.id,  skillId: 'skill-ts',        proficiency: 4, source: 'self',       verified: true,  lastUsedAt: new Date('2026-09-25') },
    { id: 'us-sarah-nodejs',    userId: sarah.id,  skillId: 'skill-nodejs',    proficiency: 4, source: 'manager',    verified: true,  lastUsedAt: new Date('2026-09-20') },
    { id: 'us-sarah-postgres',  userId: sarah.id,  skillId: 'skill-postgres',  proficiency: 3, source: 'self',       verified: false, lastUsedAt: new Date('2026-09-15') },
    { id: 'us-sarah-css',       userId: sarah.id,  skillId: 'skill-css',       proficiency: 5, source: 'self',       verified: true,  lastUsedAt: new Date('2026-09-25') },
    { id: 'us-sarah-sysdesign', userId: sarah.id,  skillId: 'skill-sysdesign', proficiency: 3, source: 'self',       verified: false, lastUsedAt: new Date('2026-09-10') },
    { id: 'us-sarah-leadership',userId: sarah.id,  skillId: 'skill-leadership',proficiency: 3, source: 'peer',       verified: false, lastUsedAt: new Date('2026-09-01') },
    { id: 'us-sarah-aws',       userId: sarah.id,  skillId: 'skill-aws',       proficiency: 2, source: 'ai_inferred',verified: false, lastUsedAt: new Date('2026-08-20') },
    // Marcus
    { id: 'us-marcus-nodejs',   userId: marcus.id, skillId: 'skill-nodejs',    proficiency: 5, source: 'self',       verified: true,  lastUsedAt: new Date('2026-09-25') },
    { id: 'us-marcus-postgres', userId: marcus.id, skillId: 'skill-postgres',  proficiency: 5, source: 'self',       verified: true,  lastUsedAt: new Date('2026-09-25') },
    { id: 'us-marcus-aws',      userId: marcus.id, skillId: 'skill-aws',       proficiency: 4, source: 'self',       verified: true,  lastUsedAt: new Date('2026-09-20') },
    { id: 'us-marcus-docker',   userId: marcus.id, skillId: 'skill-docker',    proficiency: 4, source: 'self',       verified: true,  lastUsedAt: new Date('2026-09-18') },
    // Priya
    { id: 'us-priya-react',     userId: priya.id,  skillId: 'skill-react',     proficiency: 4, source: 'self',       verified: true,  lastUsedAt: new Date('2026-09-25') },
    { id: 'us-priya-css',       userId: priya.id,  skillId: 'skill-css',       proficiency: 5, source: 'self',       verified: true,  lastUsedAt: new Date('2026-09-25') },
    { id: 'us-priya-figma',     userId: priya.id,  skillId: 'skill-figma',     proficiency: 4, source: 'self',       verified: true,  lastUsedAt: new Date('2026-09-22') },
    { id: 'us-priya-ts',        userId: priya.id,  skillId: 'skill-ts',        proficiency: 3, source: 'self',       verified: false, lastUsedAt: new Date('2026-09-20') },
    // David
    { id: 'us-david-aws',       userId: david.id,  skillId: 'skill-aws',       proficiency: 5, source: 'self',       verified: true,  lastUsedAt: new Date('2026-09-25') },
    { id: 'us-david-docker',    userId: david.id,  skillId: 'skill-docker',    proficiency: 5, source: 'self',       verified: true,  lastUsedAt: new Date('2026-09-25') },
    { id: 'us-david-k8s',       userId: david.id,  skillId: 'skill-k8s',       proficiency: 4, source: 'self',       verified: true,  lastUsedAt: new Date('2026-09-24') },
    { id: 'us-david-python',    userId: david.id,  skillId: 'skill-python',    proficiency: 3, source: 'self',       verified: false, lastUsedAt: new Date('2026-09-10') },
    // Alex
    { id: 'us-alex-react',      userId: manager.id,skillId: 'skill-react',     proficiency: 4, source: 'self',       verified: true,  lastUsedAt: new Date('2026-09-20') },
    { id: 'us-alex-nodejs',     userId: manager.id,skillId: 'skill-nodejs',    proficiency: 5, source: 'self',       verified: true,  lastUsedAt: new Date('2026-09-25') },
    { id: 'us-alex-sysdesign',  userId: manager.id,skillId: 'skill-sysdesign', proficiency: 5, source: 'self',       verified: true,  lastUsedAt: new Date('2026-09-25') },
    { id: 'us-alex-leadership', userId: manager.id,skillId: 'skill-leadership',proficiency: 4, source: 'manager',    verified: true,  lastUsedAt: new Date('2026-09-25') },
  ]

  for (const us of userSkillsData) {
    await prisma.userSkill.upsert({
      where: { id: us.id },
      update: { proficiency: us.proficiency, verified: us.verified },
      create: { ...us },
    })
  }

  console.log('  User skills seeded.')

  // ── Projects ──────────────────────────────────────────────────────────────
  const projPlatform = await prisma.project.upsert({
    where: { id: 'proj-platform-001' },
    update: {},
    create: {
      id:          'proj-platform-001',
      name:        'SkillForge Platform v2.0',
      description: 'Complete rebuild of the workforce intelligence platform with AI capabilities.',
      status:      ProjectStatus.active,
      ownerId:     manager.id,
      startDate:   new Date('2026-08-01'),
      endDate:     new Date('2026-12-31'),
    },
  })

  const projData = await prisma.project.upsert({
    where: { id: 'proj-data-001' },
    update: {},
    create: {
      id:          'proj-data-001',
      name:        'Data Pipeline Modernization',
      description: 'Migrate legacy ETL pipeline to modern streaming architecture.',
      status:      ProjectStatus.active,
      ownerId:     manager.id,
      startDate:   new Date('2026-09-01'),
      endDate:     new Date('2026-11-30'),
    },
  })

  const projMobile = await prisma.project.upsert({
    where: { id: 'proj-mobile-001' },
    update: {},
    create: {
      id:          'proj-mobile-001',
      name:        'Mobile App MVP',
      description: 'iOS and Android mobile application for field workforce management.',
      status:      ProjectStatus.planning,
      ownerId:     manager.id,
      startDate:   new Date('2026-11-01'),
      endDate:     new Date('2027-03-31'),
    },
  })

  console.log('  Projects seeded.')

  // ── Tasks ─────────────────────────────────────────────────────────────────
  const tasksData = [
    {
      id: 'task-001',
      projectId:     projPlatform.id,
      title:         'Design payment gateway API',
      description:   'Create RESTful API endpoints for payment processing including Stripe integration.',
      status:        TaskStatus.in_progress,
      priority:      TaskPriority.critical,
      estimatedHours: 24,
      deadline:      new Date('2026-10-05'),
      createdById:   manager.id,
      assignedToId:  sarah.id,
      matchScore:    0.91,
      tags:          ['backend', 'payments', 'api'],
      requiredSkills: [
        { skillId: 'skill-nodejs', minProficiency: 4, importance: 'must_have' as const },
        { skillId: 'skill-aws',    minProficiency: 3, importance: 'nice_to_have' as const },
      ],
    },
    {
      id: 'task-002',
      projectId:     projPlatform.id,
      title:         'Implement skill radar chart component',
      description:   'Build an interactive radar chart for the skills visualisation page.',
      status:        TaskStatus.review,
      priority:      TaskPriority.high,
      estimatedHours: 12,
      deadline:      new Date('2026-09-30'),
      createdById:   manager.id,
      assignedToId:  sarah.id,
      matchScore:    0.97,
      tags:          ['frontend', 'charts'],
      requiredSkills: [
        { skillId: 'skill-react', minProficiency: 4, importance: 'must_have' as const },
        { skillId: 'skill-css',   minProficiency: 3, importance: 'must_have' as const },
      ],
    },
    {
      id: 'task-003',
      projectId:     projPlatform.id,
      title:         'Write unit tests for auth module',
      description:   'Achieve 90% code coverage for the authentication and authorisation module.',
      status:        TaskStatus.assigned,
      priority:      TaskPriority.high,
      estimatedHours: 8,
      deadline:      new Date('2026-10-08'),
      createdById:   manager.id,
      assignedToId:  sarah.id,
      matchScore:    0.88,
      tags:          ['testing', 'auth'],
      requiredSkills: [
        { skillId: 'skill-ts',     minProficiency: 3, importance: 'must_have' as const },
        { skillId: 'skill-nodejs', minProficiency: 3, importance: 'must_have' as const },
      ],
    },
    {
      id: 'task-004',
      projectId:     projPlatform.id,
      title:         'Code review: Marcus PR #47',
      description:   'Review the burnout prediction ML pipeline integration PR.',
      status:        TaskStatus.open,
      priority:      TaskPriority.medium,
      estimatedHours: 3,
      deadline:      new Date('2026-09-29'),
      createdById:   manager.id,
      assignedToId:  sarah.id,
      tags:          ['review'],
      requiredSkills: [
        { skillId: 'skill-nodejs', minProficiency: 3, importance: 'must_have' as const },
      ],
    },
    {
      id: 'task-005',
      projectId:     projPlatform.id,
      title:         'Deploy staging environment',
      description:   'Configure and deploy the SkillForge platform to the staging environment.',
      status:        TaskStatus.open,
      priority:      TaskPriority.high,
      estimatedHours: 6,
      deadline:      new Date('2026-10-01'),
      createdById:   manager.id,
      tags:          ['devops', 'deployment'],
      requiredSkills: [
        { skillId: 'skill-aws',    minProficiency: 4, importance: 'must_have' as const },
        { skillId: 'skill-docker', minProficiency: 4, importance: 'must_have' as const },
      ],
    },
    {
      id: 'task-006',
      projectId:     projPlatform.id,
      title:         'Implement Kanban board drag-and-drop',
      description:   'Add drag-and-drop functionality to the task Kanban board.',
      status:        TaskStatus.completed,
      priority:      TaskPriority.medium,
      estimatedHours: 8,
      deadline:      new Date('2026-09-25'),
      createdById:   manager.id,
      assignedToId:  priya.id,
      tags:          ['frontend', 'ux'],
      requiredSkills: [
        { skillId: 'skill-react', minProficiency: 4, importance: 'must_have' as const },
      ],
    },
    {
      id: 'task-007',
      projectId:     projData.id,
      title:         'Database performance optimisation',
      description:   'Analyse and optimise slow queries in the analytics module.',
      status:        TaskStatus.in_progress,
      priority:      TaskPriority.high,
      estimatedHours: 16,
      deadline:      new Date('2026-10-03'),
      createdById:   manager.id,
      assignedToId:  marcus.id,
      tags:          ['backend', 'database', 'performance'],
      requiredSkills: [
        { skillId: 'skill-postgres', minProficiency: 4, importance: 'must_have' as const },
      ],
    },
    {
      id: 'task-008',
      projectId:     projData.id,
      title:         'CI/CD pipeline setup',
      description:   'Set up GitHub Actions workflows for automated testing and deployment.',
      status:        TaskStatus.assigned,
      priority:      TaskPriority.high,
      estimatedHours: 12,
      deadline:      new Date('2026-10-05'),
      createdById:   manager.id,
      assignedToId:  david.id,
      tags:          ['devops', 'cicd'],
      requiredSkills: [
        { skillId: 'skill-docker', minProficiency: 4, importance: 'must_have' as const },
        { skillId: 'skill-k8s',    minProficiency: 3, importance: 'nice_to_have' as const },
      ],
    },
  ]

  for (const { requiredSkills, ...task } of tasksData) {
    const created = await prisma.task.upsert({
      where: { id: task.id },
      update: { status: task.status, assignedToId: task.assignedToId },
      create: {
        ...task,
        estimatedHours: task.estimatedHours ?? undefined,
        matchScore: task.matchScore ?? undefined,
      },
    })

    for (const rs of requiredSkills) {
      await prisma.taskRequiredSkill.upsert({
        where: { taskId_skillId: { taskId: created.id, skillId: rs.skillId } },
        update: {},
        create: { taskId: created.id, ...rs },
      })
    }
  }

  console.log('  Tasks seeded.')

  // ── Effort Logs ───────────────────────────────────────────────────────────
  const effortData = [
    { id: 'eff-001', userId: sarah.id,  taskId: 'task-001', date: new Date('2026-09-23'), hours: 7,   status: EffortStatus.approved, notes: 'Completed Stripe integration endpoints' },
    { id: 'eff-002', userId: sarah.id,  taskId: 'task-002', date: new Date('2026-09-23'), hours: 1,   status: EffortStatus.approved },
    { id: 'eff-003', userId: sarah.id,  taskId: 'task-001', date: new Date('2026-09-24'), hours: 7.5, status: EffortStatus.approved, notes: 'Added webhook handlers and error handling' },
    { id: 'eff-004', userId: sarah.id,  taskId: 'task-002', date: new Date('2026-09-25'), hours: 6,   status: EffortStatus.submitted },
    { id: 'eff-005', userId: sarah.id,  taskId: 'task-003', date: new Date('2026-09-25'), hours: 2,   status: EffortStatus.submitted },
    { id: 'eff-006', userId: sarah.id,  taskId: 'task-001', date: new Date('2026-09-26'), hours: 8,   status: EffortStatus.draft },
    { id: 'eff-007', userId: marcus.id, taskId: 'task-007', date: new Date('2026-09-24'), hours: 8,   status: EffortStatus.approved },
    { id: 'eff-008', userId: david.id,  taskId: 'task-008', date: new Date('2026-09-25'), hours: 4,   status: EffortStatus.submitted },
  ]

  for (const e of effortData) {
    await prisma.effortLog.upsert({
      where: { userId_taskId_date: { userId: e.userId, taskId: e.taskId, date: e.date } },
      update: {},
      create: {
        id:      e.id,
        userId:  e.userId,
        taskId:  e.taskId,
        date:    e.date,
        hours:   e.hours,
        notes:   e.notes,
        status:  e.status,
        approvedById: (e.status === EffortStatus.approved) ? manager.id : undefined,
      },
    })
  }

  console.log('  Effort logs seeded.')

  // ── Burnout Snapshots ─────────────────────────────────────────────────────
  const burnoutData = [
    { userId: sarah.id,   riskScore: 28, riskBand: BurnoutBand.low,    factors: { overtimeHours: 0,  activeTasks: 5, deadlineDensity: 2, effortVariance: 3  } },
    { userId: marcus.id,  riskScore: 74, riskBand: BurnoutBand.high,   factors: { overtimeHours: 11, activeTasks: 8, deadlineDensity: 5, effortVariance: 12 } },
    { userId: priya.id,   riskScore: 15, riskBand: BurnoutBand.low,    factors: { overtimeHours: 0,  activeTasks: 3, deadlineDensity: 1, effortVariance: 1  } },
    { userId: david.id,   riskScore: 35, riskBand: BurnoutBand.low,    factors: { overtimeHours: 0,  activeTasks: 4, deadlineDensity: 2, effortVariance: 4  } },
    { userId: manager.id, riskScore: 52, riskBand: BurnoutBand.medium, factors: { overtimeHours: 5,  activeTasks: 6, deadlineDensity: 3, effortVariance: 8  } },
  ]

  const weekStart = new Date('2026-09-22')

  for (const b of burnoutData) {
    await prisma.burnoutSnapshot.upsert({
      where: { userId_weekStart: { userId: b.userId, weekStart } },
      update: { riskScore: b.riskScore, riskBand: b.riskBand },
      create: {
        userId:              b.userId,
        weekStart,
        riskScore:           b.riskScore,
        riskBand:            b.riskBand,
        contributingFactors: b.factors,
        modelVersion:        '1.0.0',
      },
    })
  }

  console.log('  Burnout snapshots seeded.')

  // ── Notifications ─────────────────────────────────────────────────────────
  const notifData = [
    { id: 'notif-001', userId: sarah.id, type: NotificationType.task_assigned,   title: 'New Task Assigned',   message: 'You have been assigned "Write unit tests for auth module"',                read: false, href: '/tasks',  createdAt: new Date('2026-09-27T14:30:00Z') },
    { id: 'notif-002', userId: sarah.id, type: NotificationType.effort_approved, title: 'Effort Approved',     message: 'Your timesheet for Sep 23-24 has been approved by Alex Rivera',             read: false, href: '/effort', createdAt: new Date('2026-09-27T10:00:00Z') },
    { id: 'notif-003', userId: sarah.id, type: NotificationType.skill_suggestion,title: 'New Skill Suggestion',message: 'AI detected Docker usage in recent tasks — add to your profile?',           read: true,  href: '/skills', createdAt: new Date('2026-09-26T16:00:00Z') },
    { id: 'notif-004', userId: sarah.id, type: NotificationType.deadline_reminder,title: 'Deadline Tomorrow',  message: '"Implement skill radar chart" is due tomorrow',                              read: true,  href: '/tasks',  createdAt: new Date('2026-09-28T09:00:00Z') },
    { id: 'notif-005', userId: marcus.id,type: NotificationType.burnout_alert,   title: 'Burnout Risk Alert',  message: 'Your workload has been elevated for 3 consecutive weeks. Consider a break.', read: false, href: '/career', createdAt: new Date('2026-09-28T08:00:00Z') },
  ]

  for (const n of notifData) {
    await prisma.notification.upsert({
      where: { id: n.id },
      update: {},
      create: n,
    })
  }

  console.log('  Notifications seeded.')

  // ── Audit Logs ────────────────────────────────────────────────────────────
  const auditData = [
    { id: 'audit-001', actorId: manager.id, action: 'task.assigned',   entityType: 'Task',       entityId: 'task-003', newValues: { assignedToId: sarah.id },  createdAt: new Date('2026-09-27T14:30:00Z') },
    { id: 'audit-002', actorId: sarah.id,   action: 'effort.submitted', entityType: 'EffortLog',  entityId: 'eff-004',  newValues: { status: 'submitted' },     createdAt: new Date('2026-09-27T09:00:00Z') },
    { id: 'audit-003', actorId: manager.id, action: 'effort.approved',  entityType: 'EffortLog',  entityId: 'eff-001',  newValues: { status: 'approved' },     createdAt: new Date('2026-09-27T10:00:00Z') },
    { id: 'audit-004', actorId: admin.id,   action: 'user.created',     entityType: 'User',       entityId: priya.id,   newValues: { role: 'employee' },        createdAt: new Date('2026-09-20T08:00:00Z') },
    { id: 'audit-005', actorId: marcus.id,  action: 'skill.added',      entityType: 'UserSkill',  entityId: 'us-david-k8s', newValues: { proficiency: 4 },      createdAt: new Date('2026-09-19T16:00:00Z') },
    { id: 'audit-006', actorId: manager.id, action: 'skill.endorsed',   entityType: 'UserSkill',  entityId: 'us-sarah-react', newValues: { endorsed: true },    createdAt: new Date('2026-09-18T14:00:00Z') },
  ]

  for (const a of auditData) {
    await prisma.auditLog.upsert({
      where: { id: a.id },
      update: {},
      create: a,
    })
  }

  console.log('  Audit logs seeded.')

  console.log('\nDatabase seeded successfully.')
  console.log('\nDemo accounts (password: demo1234):')
  console.log('  sarah.chen@skillforge.io    — Employee')
  console.log('  alex.rivera@skillforge.io   — Manager')
  console.log('  marcus.johnson@skillforge.io — Employee (high burnout risk)')
  console.log('  priya.patel@skillforge.io   — Employee')
  console.log('  david.kim@skillforge.io     — Employee')
  console.log('  admin@skillforge.io         — Admin')
}

main()
  .catch((e) => {
    console.error('Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
