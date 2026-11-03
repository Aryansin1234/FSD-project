// Types for SkillForge

export type UserRole = 'employee' | 'manager' | 'admin' | 'executive';

export type ProficiencyLevel = 1 | 2 | 3 | 4 | 5;
export const PROFICIENCY_LABELS: Record<ProficiencyLevel, string> = {
  1: 'Beginner',
  2: 'Novice',
  3: 'Intermediate',
  4: 'Advanced',
  5: 'Expert',
};

export type TaskStatus = 'open' | 'assigned' | 'in_progress' | 'review' | 'completed' | 'cancelled';
export type TaskPriority = 'critical' | 'high' | 'medium' | 'low';
export type SkillCategory = 'technical' | 'soft' | 'domain' | 'certification' | 'tool';
export type BurnoutBand = 'low' | 'medium' | 'high' | 'critical';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  department: string;
  avatar?: string;
  bio?: string;
  location?: string;
  managerId?: string;
  skills: UserSkill[];
  burnoutScore?: number;
  burnoutBand?: BurnoutBand;
  utilization?: number;
  weeklyHours?: number;
}

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  description?: string;
  parentId?: string;
}

export interface UserSkill {
  id: string;
  skillId: string;
  skillName: string;
  category: SkillCategory;
  proficiency: ProficiencyLevel;
  source: 'self' | 'manager' | 'ai_inferred' | 'certification' | 'peer';
  verified: boolean;
  endorsements: number;
  lastUsed?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  projectId: string;
  projectName: string;
  assignedTo?: string;
  assignedToName?: string;
  createdBy: string;
  estimatedHours: number;
  loggedHours: number;
  deadline: string;
  requiredSkills: { skillId: string; skillName: string; minProficiency: ProficiencyLevel; importance: 'must_have' | 'nice_to_have' }[];
  matchScore?: number;
  matchReasons?: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'active' | 'on_hold' | 'completed' | 'archived';
  ownerId: string;
  ownerName: string;
  startDate: string;
  endDate: string;
  teamSize: number;
  tasksTotal: number;
  tasksCompleted: number;
  health: 'on_track' | 'at_risk' | 'delayed';
}

export interface EffortLog {
  id: string;
  userId: string;
  taskId: string;
  taskTitle: string;
  projectName: string;
  date: string;
  hours: number;
  notes?: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
}

export interface BurnoutSnapshot {
  userId: string;
  weekStart: string;
  riskScore: number;
  riskBand: BurnoutBand;
  contributingFactors: {
    overtimeHours?: number;
    activeTasks?: number;
    deadlineDensity?: number;
    effortVariance?: number;
  };
}

export interface SkillMatchCandidate {
  userId: string;
  userName: string;
  avatar?: string;
  role: string;
  matchScore: number;
  reasons: string[];
  skillOverlap: number;
  workloadCapacity: number;
  historicalPerformance: number;
  proficiencyDepth: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  avatar?: string;
  skills: UserSkill[];
  utilization: number;
  activeTasks: number;
  weeklyHours: number;
  burnoutScore: number;
  burnoutBand: BurnoutBand;
}

export interface Notification {
  id: string;
  type: 'task_assigned' | 'effort_approved' | 'burnout_alert' | 'skill_suggestion' | 'deadline_reminder';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  href?: string;
}
