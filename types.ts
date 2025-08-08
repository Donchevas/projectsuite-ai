
export enum ProjectStatus {
  OnTrack = 'On Track',
  AtRisk = 'At Risk',
  OffTrack = 'Off Track',
  Completed = 'Completed',
  OnHold = 'On Hold'
}

export enum RiskImpact {
  High = 'Alto',
  Medium = 'Medio',
  Low = 'Bajo',
}

export enum RiskProbability {
    High = 'Alta',
    Medium = 'Media',
    Low = 'Baja',
}

export enum MilestoneStatus {
  Pending = 'Pendiente',
  InProgress = 'En Curso',
  Completed = 'Entregado',
  Delayed = 'Observado'
}

export interface Project {
  id: string;
  name: string;
  progress: number;
  status: ProjectStatus;
  client: string;
  endDate: string;
  projectManager: string;
  budget: number;
  currentCost: number;
}

export interface Risk {
  id: string;
  projectId: string;
  name: string;
  impact: RiskImpact;
  probability: RiskProbability;
  owner: string;
  mitigationPlan: string;
  status: 'Abierto' | 'Cerrado' | 'Monitoreando';
  lastUpdated: string;
}

export interface Milestone {
  id: string;
  projectId: string;
  name: string;
  status: MilestoneStatus;
  dueDate: string;
}

export interface Report {
  id: string;
  projectId: string;
  week: string;
  activitiesDone: string;
  nextSteps: string;
  newRisks: string;
  submittedBy: string;
  date: string;
}

export interface LessonLearned {
  id: string;
  projectId: string;
  category: 'Planificación' | 'Ejecución' | 'Comunicación' | 'Gestión de Stakeholders';
  description: string;
  votes: number;
}

export type ViewType = 'dashboard' | 'projects' | 'risks' | 'milestones' | 'reports' | 'presentations' | 'lessons' | 'client';

export interface Insight {
    projectId: string;
    title: string;
    description: string;
    severity: 'warning' | 'critical';
}