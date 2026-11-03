import type {
  User, Task, Project, EffortLog, BurnoutSnapshot, TeamMember,
  SkillMatchCandidate, Notification, Skill
} from '@/types';

export const currentUser: User = {
  id: 'u1',
  email: 'sarah.chen@skillforge.io',
  firstName: 'Sarah',
  lastName: 'Chen',
  role: 'employee',
  department: 'Engineering',
  bio: 'Full-stack engineer with 5 years of experience building scalable web applications.',
  location: 'San Francisco, CA',
  managerId: 'u5',
  weeklyHours: 38,
  utilization: 72,
  burnoutScore: 28,
  burnoutBand: 'low',
  skills: [
    { id: 'us1', skillId: 's1', skillName: 'React', category: 'technical', proficiency: 5, source: 'self', verified: true, endorsements: 8, lastUsed: '2026-09-25' },
    { id: 'us2', skillId: 's2', skillName: 'TypeScript', category: 'technical', proficiency: 4, source: 'self', verified: true, endorsements: 6, lastUsed: '2026-09-25' },
    { id: 'us3', skillId: 's3', skillName: 'Node.js', category: 'technical', proficiency: 4, source: 'manager', verified: true, endorsements: 5, lastUsed: '2026-09-20' },
    { id: 'us4', skillId: 's4', skillName: 'PostgreSQL', category: 'technical', proficiency: 3, source: 'self', verified: false, endorsements: 2, lastUsed: '2026-09-15' },
    { id: 'us5', skillId: 's5', skillName: 'CSS/Tailwind', category: 'technical', proficiency: 5, source: 'self', verified: true, endorsements: 4, lastUsed: '2026-09-25' },
    { id: 'us6', skillId: 's6', skillName: 'System Design', category: 'domain', proficiency: 3, source: 'self', verified: false, endorsements: 1, lastUsed: '2026-09-10' },
    { id: 'us7', skillId: 's7', skillName: 'Leadership', category: 'soft', proficiency: 3, source: 'peer', verified: false, endorsements: 3, lastUsed: '2026-09-01' },
    { id: 'us8', skillId: 's8', skillName: 'AWS', category: 'tool', proficiency: 2, source: 'ai_inferred', verified: false, endorsements: 0, lastUsed: '2026-08-20' },
  ],
};

export const managerUser: User = {
  id: 'u5',
  email: 'alex.rivera@skillforge.io',
  firstName: 'Alex',
  lastName: 'Rivera',
  role: 'manager',
  department: 'Engineering',
  weeklyHours: 45,
  utilization: 85,
  burnoutScore: 52,
  burnoutBand: 'medium',
  skills: [],
};

export const teamMembers: TeamMember[] = [
  {
    id: 'u1', name: 'Sarah Chen', role: 'Senior Engineer', department: 'Engineering',
    utilization: 72, activeTasks: 5, weeklyHours: 38, burnoutScore: 28, burnoutBand: 'low',
    skills: [
      { id: 'us1', skillId: 's1', skillName: 'React', category: 'technical', proficiency: 5, source: 'self', verified: true, endorsements: 8, lastUsed: '2026-09-25' },
      { id: 'us2', skillId: 's2', skillName: 'TypeScript', category: 'technical', proficiency: 4, source: 'self', verified: true, endorsements: 6, lastUsed: '2026-09-25' },
      { id: 'us3', skillId: 's3', skillName: 'Node.js', category: 'technical', proficiency: 4, source: 'self', verified: true, endorsements: 5, lastUsed: '2026-09-20' },
      { id: 'us8', skillId: 's8', skillName: 'AWS', category: 'tool', proficiency: 2, source: 'self', verified: false, endorsements: 0, lastUsed: '2026-08-20' },
    ],
  },
  {
    id: 'u2', name: 'Marcus Johnson', role: 'Backend Engineer', department: 'Engineering',
    utilization: 93, activeTasks: 8, weeklyHours: 51, burnoutScore: 74, burnoutBand: 'high',
    skills: [
      { id: 'us9', skillId: 's3', skillName: 'Node.js', category: 'technical', proficiency: 5, source: 'self', verified: true, endorsements: 9, lastUsed: '2026-09-25' },
      { id: 'us10', skillId: 's4', skillName: 'PostgreSQL', category: 'technical', proficiency: 5, source: 'self', verified: true, endorsements: 7, lastUsed: '2026-09-25' },
      { id: 'us11', skillId: 's8', skillName: 'AWS', category: 'tool', proficiency: 4, source: 'self', verified: true, endorsements: 5, lastUsed: '2026-09-20' },
      { id: 'us12', skillId: 's9', skillName: 'Docker', category: 'tool', proficiency: 4, source: 'self', verified: true, endorsements: 4, lastUsed: '2026-09-18' },
    ],
  },
  {
    id: 'u3', name: 'Priya Patel', role: 'Frontend Engineer', department: 'Engineering',
    utilization: 45, activeTasks: 3, weeklyHours: 28, burnoutScore: 15, burnoutBand: 'low',
    skills: [
      { id: 'us13', skillId: 's1', skillName: 'React', category: 'technical', proficiency: 4, source: 'self', verified: true, endorsements: 6, lastUsed: '2026-09-25' },
      { id: 'us14', skillId: 's5', skillName: 'CSS/Tailwind', category: 'technical', proficiency: 5, source: 'self', verified: true, endorsements: 8, lastUsed: '2026-09-25' },
      { id: 'us15', skillId: 's10', skillName: 'Figma', category: 'tool', proficiency: 4, source: 'self', verified: true, endorsements: 5, lastUsed: '2026-09-22' },
      { id: 'us16', skillId: 's2', skillName: 'TypeScript', category: 'technical', proficiency: 3, source: 'self', verified: false, endorsements: 2, lastUsed: '2026-09-20' },
    ],
  },
  {
    id: 'u4', name: 'David Kim', role: 'DevOps Engineer', department: 'Engineering',
    utilization: 68, activeTasks: 4, weeklyHours: 36, burnoutScore: 35, burnoutBand: 'low',
    skills: [
      { id: 'us17', skillId: 's8', skillName: 'AWS', category: 'tool', proficiency: 5, source: 'self', verified: true, endorsements: 7, lastUsed: '2026-09-25' },
      { id: 'us18', skillId: 's9', skillName: 'Docker', category: 'tool', proficiency: 5, source: 'self', verified: true, endorsements: 8, lastUsed: '2026-09-25' },
      { id: 'us19', skillId: 's11', skillName: 'Kubernetes', category: 'tool', proficiency: 4, source: 'self', verified: true, endorsements: 6, lastUsed: '2026-09-24' },
      { id: 'us20', skillId: 's12', skillName: 'Python', category: 'technical', proficiency: 3, source: 'self', verified: false, endorsements: 1, lastUsed: '2026-09-10' },
    ],
  },
  {
    id: 'u5', name: 'Alex Rivera', role: 'Tech Lead', department: 'Engineering',
    utilization: 85, activeTasks: 6, weeklyHours: 45, burnoutScore: 52, burnoutBand: 'medium',
    skills: [
      { id: 'us21', skillId: 's1', skillName: 'React', category: 'technical', proficiency: 4, source: 'self', verified: true, endorsements: 5, lastUsed: '2026-09-20' },
      { id: 'us22', skillId: 's3', skillName: 'Node.js', category: 'technical', proficiency: 5, source: 'self', verified: true, endorsements: 9, lastUsed: '2026-09-25' },
      { id: 'us23', skillId: 's6', skillName: 'System Design', category: 'domain', proficiency: 5, source: 'self', verified: true, endorsements: 10, lastUsed: '2026-09-25' },
      { id: 'us24', skillId: 's7', skillName: 'Leadership', category: 'soft', proficiency: 4, source: 'manager', verified: true, endorsements: 8, lastUsed: '2026-09-25' },
    ],
  },
];

export const tasks: Task[] = [
  {
    id: 't1', title: 'Design payment gateway API', description: 'Create RESTful API endpoints for payment processing including Stripe integration.',
    status: 'in_progress', priority: 'critical', projectId: 'p1', projectName: 'SkillForge Platform',
    assignedTo: 'u1', assignedToName: 'Sarah Chen', createdBy: 'u5',
    estimatedHours: 24, loggedHours: 14, deadline: '2026-10-05',
    requiredSkills: [
      { skillId: 's3', skillName: 'Node.js', minProficiency: 4, importance: 'must_have' },
      { skillId: 's8', skillName: 'AWS', minProficiency: 3, importance: 'nice_to_have' },
    ],
    matchScore: 0.91, matchReasons: ['92% skill match (Node.js, AWS)', '20% workload capacity', '4.5/5 avg performance'],
    tags: ['backend', 'payments', 'api'], createdAt: '2026-09-15', updatedAt: '2026-09-25',
  },
  {
    id: 't2', title: 'Implement skill radar chart component', description: 'Build an interactive D3.js radar chart for the skills visualization page.',
    status: 'review', priority: 'high', projectId: 'p1', projectName: 'SkillForge Platform',
    assignedTo: 'u1', assignedToName: 'Sarah Chen', createdBy: 'u5',
    estimatedHours: 12, loggedHours: 11, deadline: '2026-09-30',
    requiredSkills: [
      { skillId: 's1', skillName: 'React', minProficiency: 4, importance: 'must_have' },
      { skillId: 's5', skillName: 'CSS/Tailwind', minProficiency: 3, importance: 'must_have' },
    ],
    matchScore: 0.97, matchReasons: ['97% skill match (React, TypeScript, CSS)', 'Highest proficiency in React on team'],
    tags: ['frontend', 'charts', 'd3'], createdAt: '2026-09-10', updatedAt: '2026-09-28',
  },
  {
    id: 't3', title: 'Write unit tests for auth module', description: 'Achieve 90% code coverage for the authentication and authorization module.',
    status: 'assigned', priority: 'high', projectId: 'p1', projectName: 'SkillForge Platform',
    assignedTo: 'u1', assignedToName: 'Sarah Chen', createdBy: 'u5',
    estimatedHours: 8, loggedHours: 0, deadline: '2026-10-08',
    requiredSkills: [
      { skillId: 's2', skillName: 'TypeScript', minProficiency: 3, importance: 'must_have' },
      { skillId: 's3', skillName: 'Node.js', minProficiency: 3, importance: 'must_have' },
    ],
    matchScore: 0.88, matchReasons: ['88% skill match', 'Strong TypeScript proficiency'],
    tags: ['testing', 'auth'], createdAt: '2026-09-20', updatedAt: '2026-09-27',
  },
  {
    id: 't4', title: 'Code review: Marcus PR #47', description: 'Review the burnout prediction ML pipeline integration PR.',
    status: 'open', priority: 'medium', projectId: 'p1', projectName: 'SkillForge Platform',
    assignedTo: 'u1', assignedToName: 'Sarah Chen', createdBy: 'u5',
    estimatedHours: 3, loggedHours: 0, deadline: '2026-09-29',
    requiredSkills: [{ skillId: 's3', skillName: 'Node.js', minProficiency: 3, importance: 'must_have' }],
    tags: ['review', 'ml'], createdAt: '2026-09-27', updatedAt: '2026-09-27',
  },
  {
    id: 't5', title: 'Deploy staging environment', description: 'Configure and deploy the SkillForge platform to the staging environment.',
    status: 'open', priority: 'high', projectId: 'p1', projectName: 'SkillForge Platform',
    createdBy: 'u5', estimatedHours: 6, loggedHours: 0, deadline: '2026-10-01',
    requiredSkills: [
      { skillId: 's8', skillName: 'AWS', minProficiency: 4, importance: 'must_have' },
      { skillId: 's9', skillName: 'Docker', minProficiency: 4, importance: 'must_have' },
    ],
    matchScore: 0.94, matchReasons: ['David Kim: 94% match — AWS Expert + Docker mastery'],
    tags: ['devops', 'deployment'], createdAt: '2026-09-28', updatedAt: '2026-09-28',
  },
  {
    id: 't6', title: 'Implement Kanban board drag-and-drop', description: 'Add drag-and-drop functionality to the task Kanban board.',
    status: 'completed', priority: 'medium', projectId: 'p1', projectName: 'SkillForge Platform',
    assignedTo: 'u3', assignedToName: 'Priya Patel', createdBy: 'u5',
    estimatedHours: 8, loggedHours: 9, deadline: '2026-09-25',
    requiredSkills: [{ skillId: 's1', skillName: 'React', minProficiency: 4, importance: 'must_have' }],
    tags: ['frontend', 'ux'], createdAt: '2026-09-14', updatedAt: '2026-09-25',
  },
  {
    id: 't7', title: 'Database performance optimization', description: 'Analyze and optimize slow queries in the analytics module.',
    status: 'in_progress', priority: 'high', projectId: 'p2', projectName: 'Data Pipeline',
    assignedTo: 'u2', assignedToName: 'Marcus Johnson', createdBy: 'u5',
    estimatedHours: 16, loggedHours: 8, deadline: '2026-10-03',
    requiredSkills: [{ skillId: 's4', skillName: 'PostgreSQL', minProficiency: 4, importance: 'must_have' }],
    tags: ['backend', 'database', 'performance'], createdAt: '2026-09-18', updatedAt: '2026-09-27',
  },
  {
    id: 't8', title: 'CI/CD pipeline setup', description: 'Set up GitHub Actions workflows for automated testing and deployment.',
    status: 'assigned', priority: 'high', projectId: 'p2', projectName: 'Data Pipeline',
    assignedTo: 'u4', assignedToName: 'David Kim', createdBy: 'u5',
    estimatedHours: 12, loggedHours: 4, deadline: '2026-10-05',
    requiredSkills: [
      { skillId: 's9', skillName: 'Docker', minProficiency: 4, importance: 'must_have' },
      { skillId: 's11', skillName: 'Kubernetes', minProficiency: 3, importance: 'nice_to_have' },
    ],
    tags: ['devops', 'cicd'], createdAt: '2026-09-22', updatedAt: '2026-09-27',
  },
];

export const projects: Project[] = [
  {
    id: 'p1', name: 'SkillForge Platform v2.0', description: 'Complete rebuild of the workforce intelligence platform with AI capabilities.',
    status: 'active', ownerId: 'u5', ownerName: 'Alex Rivera',
    startDate: '2026-08-01', endDate: '2026-12-31', teamSize: 5, tasksTotal: 28, tasksCompleted: 14,
    health: 'on_track',
  },
  {
    id: 'p2', name: 'Data Pipeline Modernization', description: 'Migrate legacy ETL pipeline to modern streaming architecture.',
    status: 'active', ownerId: 'u5', ownerName: 'Alex Rivera',
    startDate: '2026-09-01', endDate: '2026-11-30', teamSize: 3, tasksTotal: 16, tasksCompleted: 5,
    health: 'at_risk',
  },
  {
    id: 'p3', name: 'Mobile App MVP', description: 'iOS and Android mobile application for field workforce management.',
    status: 'planning', ownerId: 'u5', ownerName: 'Alex Rivera',
    startDate: '2026-11-01', endDate: '2027-03-31', teamSize: 0, tasksTotal: 0, tasksCompleted: 0,
    health: 'on_track',
  },
];

export const effortLogs: EffortLog[] = [
  { id: 'e1', userId: 'u1', taskId: 't1', taskTitle: 'Design payment gateway API', projectName: 'SkillForge Platform', date: '2026-09-23', hours: 7, status: 'approved', notes: 'Completed Stripe integration endpoints' },
  { id: 'e2', userId: 'u1', taskId: 't2', taskTitle: 'Implement skill radar chart', projectName: 'SkillForge Platform', date: '2026-09-23', hours: 1, status: 'approved' },
  { id: 'e3', userId: 'u1', taskId: 't1', taskTitle: 'Design payment gateway API', projectName: 'SkillForge Platform', date: '2026-09-24', hours: 7.5, status: 'approved', notes: 'Added webhook handlers and error handling' },
  { id: 'e4', userId: 'u1', taskId: 't2', taskTitle: 'Implement skill radar chart', projectName: 'SkillForge Platform', date: '2026-09-25', hours: 6, status: 'submitted' },
  { id: 'e5', userId: 'u1', taskId: 't3', taskTitle: 'Write unit tests for auth module', projectName: 'SkillForge Platform', date: '2026-09-25', hours: 2, status: 'submitted' },
  { id: 'e6', userId: 'u1', taskId: 't1', taskTitle: 'Design payment gateway API', projectName: 'SkillForge Platform', date: '2026-09-26', hours: 8, status: 'draft' },
];

export const burnoutSnapshots: BurnoutSnapshot[] = [
  { userId: 'u1', weekStart: '2026-09-22', riskScore: 28, riskBand: 'low', contributingFactors: { overtimeHours: 0, activeTasks: 5, deadlineDensity: 2, effortVariance: 3 } },
  { userId: 'u2', weekStart: '2026-09-22', riskScore: 74, riskBand: 'high', contributingFactors: { overtimeHours: 11, activeTasks: 8, deadlineDensity: 5, effortVariance: 12 } },
  { userId: 'u3', weekStart: '2026-09-22', riskScore: 15, riskBand: 'low', contributingFactors: { overtimeHours: 0, activeTasks: 3, deadlineDensity: 1, effortVariance: 1 } },
  { userId: 'u4', weekStart: '2026-09-22', riskScore: 35, riskBand: 'low', contributingFactors: { overtimeHours: 0, activeTasks: 4, deadlineDensity: 2, effortVariance: 4 } },
  { userId: 'u5', weekStart: '2026-09-22', riskScore: 52, riskBand: 'medium', contributingFactors: { overtimeHours: 5, activeTasks: 6, deadlineDensity: 3, effortVariance: 8 } },
];

export const skillMatchCandidates: SkillMatchCandidate[] = [
  { userId: 'u2', userName: 'Marcus Johnson', role: 'Backend Engineer', matchScore: 0.94, skillOverlap: 95, workloadCapacity: 7, historicalPerformance: 92, proficiencyDepth: 96, reasons: ['Node.js Expert (5/5)', 'AWS proficiency (4/5)', '7% capacity available — tight but feasible'] },
  { userId: 'u1', userName: 'Sarah Chen', role: 'Senior Engineer', matchScore: 0.81, skillOverlap: 82, workloadCapacity: 28, historicalPerformance: 89, proficiencyDepth: 78, reasons: ['Node.js Advanced (4/5)', '28% workload capacity available', '4.4/5 avg rating on similar tasks'] },
  { userId: 'u4', userName: 'David Kim', role: 'DevOps Engineer', matchScore: 0.72, skillOverlap: 68, workloadCapacity: 32, historicalPerformance: 85, proficiencyDepth: 74, reasons: ['AWS Expert (5/5)', 'Docker expertise', 'Limited Node.js experience'] },
];

export const notifications: Notification[] = [
  { id: 'n1', type: 'task_assigned', title: 'New Task Assigned', message: 'You\'ve been assigned "Write unit tests for auth module"', read: false, createdAt: '2026-09-27T14:30:00Z', href: '/tasks' },
  { id: 'n2', type: 'effort_approved', title: 'Effort Approved', message: 'Your timesheet for Sept 23-24 has been approved by Alex Rivera', read: false, createdAt: '2026-09-27T10:00:00Z', href: '/effort' },
  { id: 'n3', type: 'skill_suggestion', title: 'New Skill Suggestion', message: 'AI detected Docker usage in recent tasks — add to your profile?', read: true, createdAt: '2026-09-26T16:00:00Z', href: '/skills' },
  { id: 'n4', type: 'deadline_reminder', title: 'Deadline Tomorrow', message: '"Implement skill radar chart" is due tomorrow', read: true, createdAt: '2026-09-28T09:00:00Z', href: '/tasks' },
];

export const skillTaxonomy: Skill[] = [
  { id: 's1', name: 'React', category: 'technical', description: 'React.js frontend framework' },
  { id: 's2', name: 'TypeScript', category: 'technical', description: 'Typed superset of JavaScript' },
  { id: 's3', name: 'Node.js', category: 'technical', description: 'Server-side JavaScript runtime' },
  { id: 's4', name: 'PostgreSQL', category: 'technical', description: 'Relational database' },
  { id: 's5', name: 'CSS/Tailwind', category: 'technical', description: 'Styling and utility-first CSS' },
  { id: 's6', name: 'System Design', category: 'domain', description: 'Large-scale system architecture' },
  { id: 's7', name: 'Leadership', category: 'soft', description: 'Team leadership and management' },
  { id: 's8', name: 'AWS', category: 'tool', description: 'Amazon Web Services cloud platform' },
  { id: 's9', name: 'Docker', category: 'tool', description: 'Container platform' },
  { id: 's10', name: 'Figma', category: 'tool', description: 'UI/UX design tool' },
  { id: 's11', name: 'Kubernetes', category: 'tool', description: 'Container orchestration' },
  { id: 's12', name: 'Python', category: 'technical', description: 'Python programming language' },
  { id: 's13', name: 'GraphQL', category: 'technical', description: 'Query language for APIs' },
  { id: 's14', name: 'Communication', category: 'soft', description: 'Verbal and written communication' },
  { id: 's15', name: 'Problem Solving', category: 'soft', description: 'Analytical problem-solving' },
];

// Velocity/analytics data for charts
export const velocityData = [
  { week: 'W36', completed: 8, planned: 10 },
  { week: 'W37', completed: 12, planned: 10 },
  { week: 'W38', completed: 9, planned: 12 },
  { week: 'W39', completed: 11, planned: 10 },
  { week: 'W40', completed: 14, planned: 12 },
];

export const burnoutTrendData = [
  { week: 'W36', sarah: 22, marcus: 55, priya: 12, david: 28, alex: 42 },
  { week: 'W37', sarah: 25, marcus: 60, priya: 15, david: 32, alex: 45 },
  { week: 'W38', sarah: 30, marcus: 65, priya: 14, david: 30, alex: 48 },
  { week: 'W39', sarah: 28, marcus: 70, priya: 16, david: 33, alex: 50 },
  { week: 'W40', sarah: 28, marcus: 74, priya: 15, david: 35, alex: 52 },
];

export const workloadData = [
  { name: 'Sarah Chen', utilization: 72, hours: 38, capacity: 40 },
  { name: 'Marcus Johnson', utilization: 93, hours: 51, capacity: 40 },
  { name: 'Priya Patel', utilization: 45, hours: 28, capacity: 40 },
  { name: 'David Kim', utilization: 68, hours: 36, capacity: 40 },
  { name: 'Alex Rivera', utilization: 85, hours: 45, capacity: 40 },
];

// Skill heatmap: team members x skills
export const skillHeatmapData = {
  members: ['Sarah', 'Marcus', 'Priya', 'David', 'Alex'],
  skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'Docker', 'PostgreSQL', 'Python', 'System Design'],
  matrix: [
    [5, 4, 4, 2, 1, 3, 1, 3], // Sarah
    [2, 5, 3, 4, 4, 5, 3, 3], // Marcus
    [4, 2, 3, 2, 1, 2, 1, 2], // Priya
    [1, 2, 2, 5, 5, 2, 3, 3], // David
    [4, 5, 4, 3, 3, 3, 2, 5], // Alex
  ],
};
