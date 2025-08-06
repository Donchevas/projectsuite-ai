
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PROJECTS, RISKS } from '../constants';
import { ProjectStatus, RiskImpact, RiskProbability } from '../types';
import { ProjectsIcon, RisksIcon, MilestonesIcon } from './Icons';

const Card: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center">
    <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/50 mr-4">
        {icon}
    </div>
    <div>
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
    const activeProjects = PROJECTS.filter(p => p.status !== ProjectStatus.Completed && p.status !== ProjectStatus.OnHold).length;
    const projectsAtRisk = PROJECTS.filter(p => p.status === ProjectStatus.AtRisk || p.status === ProjectStatus.OffTrack).length;
    const pendingDeliverables = 5; // Mock data

    const chartData = PROJECTS.map(p => ({
        name: p.name.split(' ').slice(0, 2).join(' '),
        progreso: p.progress,
    }));

    const highPriorityRisks = RISKS.filter(r => r.impact === RiskImpact.High || r.probability === RiskProbability.High);

    return (
        <div className="p-8 space-y-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Bienvenido a ProjectSuite AI</h1>
                <p className="text-gray-600 dark:text-gray-300 mt-2">Esta plataforma está diseñada para ayudarte a controlar, reportar y entregar tus proyectos de forma inteligente, visual y colaborativa.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card title="Proyectos Activos" value={activeProjects} icon={<ProjectsIcon className="h-6 w-6 text-blue-600" />} />
                <Card title="Proyectos en Riesgo" value={projectsAtRisk} icon={<RisksIcon className="h-6 w-6 text-red-600" />} />
                <Card title="Entregables Pendientes" value={pendingDeliverables} icon={<MilestonesIcon className="h-6 w-6 text-yellow-600" />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Avance Global por Proyecto</h2>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)" />
                                <XAxis dataKey="name" tick={{ fill: '#9ca3af' }} />
                                <YAxis unit="%" tick={{ fill: '#9ca3af' }}/>
                                <Tooltip
                                    cursor={{ fill: 'rgba(239, 246, 255, 0.5)' }}
                                    contentStyle={{ 
                                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                        backdropFilter: 'blur(5px)',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '0.5rem',
                                        color: '#1f2937'
                                    }}
                                />
                                <Legend />
                                <Bar dataKey="progreso" fill="#3b82f6" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Alertas y Pendientes</h2>
                    <ul className="space-y-4">
                        {highPriorityRisks.slice(0, 4).map(risk => (
                            <li key={risk.id} className="flex items-start">
                                <RisksIcon className="h-5 w-5 text-red-500 mt-1 mr-3 flex-shrink-0" />
                                <div>
                                    <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{risk.name}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Proyecto: {PROJECTS.find(p => p.id === risk.projectId)?.name}</p>
                                </div>
                            </li>
                        ))}
                         <li className="flex items-start">
                            <MilestonesIcon className="h-5 w-5 text-yellow-500 mt-1 mr-3 flex-shrink-0" />
                            <div>
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Hito "Kick-off" retrasado</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Proyecto: CRM</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
