
import { Project, Risk, Milestone, Report, LessonLearned, ProjectStatus, RiskImpact, RiskProbability, MilestoneStatus } from './types';

export const PROJECTS: Project[] = [
  { id: 'P001', name: 'Despliegue de Infraestructura Cloud', progress: 75, status: ProjectStatus.OnTrack, client: 'Ayesa', endDate: '2024-12-31', projectManager: 'Ana García', budget: 50000, currentCost: 35000 },
  { id: 'P002', name: 'Sistema de Gestión de Clientes (CRM)', progress: 40, status: ProjectStatus.AtRisk, client: 'Tech Solutions', endDate: '2025-03-15', projectManager: 'Carlos Pérez', budget: 120000, currentCost: 65000 },
  { id: 'P003', name: 'Consultoría Estratégica Digital', progress: 95, status: ProjectStatus.Completed, client: 'Innovate Corp', endDate: '2024-08-01', projectManager: 'Laura Martínez', budget: 80000, currentCost: 78000 },
  { id: 'P004', name: 'Desarrollo de App Móvil', progress: 20, status: ProjectStatus.OffTrack, client: 'Startup X', endDate: '2025-06-30', projectManager: 'Carlos Pérez', budget: 90000, currentCost: 88000 },
  { id: 'P005', name: 'Auditoría de Seguridad IT', progress: 60, status: ProjectStatus.OnHold, client: 'Ayesa', endDate: '2024-11-20', projectManager: 'Ana García', budget: 40000, currentCost: 10000 },
];

export const RISKS: Risk[] = [
  { id: 'R01', projectId: 'P002', name: 'Retraso en la definición de requisitos por parte del cliente', impact: RiskImpact.High, probability: RiskProbability.Medium, owner: 'Carlos Pérez', mitigationPlan: 'Agendar reuniones de trabajo intensivas con stakeholders clave.', status: 'Abierto', lastUpdated: '2024-07-20' },
  { id: 'R02', projectId: 'P004', name: 'Falta de recursos de desarrollo frontend', impact: RiskImpact.High, probability: RiskProbability.High, owner: 'Carlos Pérez', mitigationPlan: 'Contratación externa de un desarrollador o reasignación interna.', status: 'Monitoreando', lastUpdated: '2024-07-18' },
  { id: 'R03', projectId: 'P001', name: 'Posible incompatibilidad con sistema legado', impact: RiskImpact.Medium, probability: RiskProbability.Low, owner: 'Ana García', mitigationPlan: 'Realizar PoC (Prueba de Concepto) antes de la integración final.', status: 'Cerrado', lastUpdated: '2024-06-30' },
  { id: 'R04', projectId: 'P002', name: 'Baja adopción de la plataforma por usuarios finales', impact: RiskImpact.Medium, probability: RiskProbability.Medium, owner: 'Laura Martínez', mitigationPlan: 'Plan de capacitación y comunicación intensivo.', status: 'Abierto', lastUpdated: '2024-07-22'},
];

export const MILESTONES: Milestone[] = [
  { id: 'M01', projectId: 'P001', name: 'Fase 1: Aprovisionamiento de servidores', status: MilestoneStatus.Completed, dueDate: '2024-05-30' },
  { id: 'M02', projectId: 'P001', name: 'Fase 2: Configuración de red', status: MilestoneStatus.InProgress, dueDate: '2024-08-15' },
  { id: 'M03', projectId: 'P002', name: 'Kick-off y levantamiento de requisitos', status: MilestoneStatus.Delayed, dueDate: '2024-07-10' },
  { id: 'M04', projectId: 'P002', name: 'Entrega de Mockups y Prototipos', status: MilestoneStatus.Pending, dueDate: '2024-09-01' },
  { id: 'M05', projectId: 'P004', name: 'Definición de Arquitectura', status: MilestoneStatus.Delayed, dueDate: '2024-07-20' },
];

export const REPORTS: Report[] = [
    { id: 'REP01', projectId: 'P001', week: 'Semana 28', activitiesDone: 'Se completó la configuración de VPCs.', nextSteps: 'Iniciar configuración de bases de datos.', newRisks: 'Ninguno.', submittedBy: 'Ana García', date: '2024-07-19' },
    { id: 'REP02', projectId: 'P002', week: 'Semana 28', activitiesDone: 'Reuniones con cliente para definir alcance.', nextSteps: 'Documentar requisitos detallados.', newRisks: 'Se identificó el riesgo R01.', submittedBy: 'Carlos Pérez', date: '2024-07-20' },
];

export const LESSONS_LEARNED: LessonLearned[] = [
    { id: 'LL01', projectId: 'P003', category: 'Comunicación', description: 'La comunicación diaria (daily stand-ups) con el cliente fue clave para el éxito y la alineación constante.', votes: 15 },
    { id: 'LL02', projectId: 'P003', category: 'Planificación', description: 'Involucrar al equipo técnico desde las fases iniciales de estimación mejora la precisión de los plazos.', votes: 12 },
    { id: 'LL03', projectId: 'P003', category: 'Gestión de Stakeholders', description: 'Un mapa de stakeholders claro evitó conflictos de interés y aseguró el apoyo necesario.', votes: 8 },
];