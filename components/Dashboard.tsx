
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { GoogleGenAI, Type } from '@google/genai';
import { PROJECTS, RISKS, MILESTONES } from '../constants';
import { ProjectStatus, RiskImpact, RiskProbability, Insight, MilestoneStatus } from '../types';
import { ProjectsIcon, RisksIcon, MilestonesIcon, DollarSignIcon, SparklesIcon, AlertTriangleIcon, AlertOctagonIcon } from './Icons';

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

const InsightCard: React.FC<{ insight: Insight }> = ({ insight }) => {
    const isCritical = insight.severity === 'critical';
    const project = PROJECTS.find(p => p.id === insight.projectId);
    const bgColor = isCritical ? 'bg-red-50 dark:bg-red-900/20' : 'bg-yellow-50 dark:bg-yellow-900/20';
    const borderColor = isCritical ? 'border-red-500' : 'border-yellow-500';
    const iconColor = isCritical ? 'text-red-500' : 'text-yellow-500';
    const Icon = isCritical ? AlertOctagonIcon : AlertTriangleIcon;

    return (
        <div className={`p-4 rounded-lg shadow-sm border-l-4 ${borderColor} ${bgColor}`}>
            <div className="flex items-start gap-3">
                <Icon className={`h-6 w-6 ${iconColor} flex-shrink-0 mt-1`} />
                <div>
                    <h4 className="font-bold text-gray-800 dark:text-white">{insight.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{insight.description}</p>
                     {project && <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Proyecto: {project.name}</p>}
                </div>
            </div>
        </div>
    );
};


const Dashboard: React.FC = () => {
    const [insights, setInsights] = useState<Insight[]>([]);
    const [isLoadingInsights, setIsLoadingInsights] = useState(true);

    useEffect(() => {
        const fetchInsights = async () => {
            setIsLoadingInsights(true);
            try {
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
                
                const currentDate = new Date().toISOString().split('T')[0];
                const contextData = {
                    currentDate,
                    projects: PROJECTS,
                    milestones: MILESTONES,
                    risks: RISKS,
                };

                const prompt = `
                    Eres un analista experto de una Oficina de Gestión de Proyectos (PMO). Tu misión es detectar proactivamente riesgos y bloqueos potenciales analizando el siguiente portafolio de proyectos en formato JSON.
                    
                    Reglas de Análisis:
                    1.  **Riesgo de Plazo**: Identifica proyectos donde el progreso es bajo en relación a su fecha de finalización. Ej: Progreso < 75% y fecha fin en los próximos 3 meses.
                    2.  **Riesgo de Presupuesto**: Alerta sobre proyectos cuyo costo actual supera el 85% del presupuesto.
                    3.  **Hitos Críticos**: Señala proyectos con hitos clave en estado "Observado" (Delayed).
                    4.  **Combinación de Factores**: Prioriza proyectos que combinen varios factores de riesgo (ej. bajo avance Y alto consumo de presupuesto).
                    5.  Sé conciso y directo en tu análisis.

                    Basado en los datos proporcionados, genera una lista de alertas. La salida debe ser estrictamente un objeto JSON que siga el schema.

                    Datos del Portafolio:
                    ${JSON.stringify(contextData, null, 2)}
                `;

                const responseSchema = {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            projectId: { type: Type.STRING, description: 'El ID del proyecto afectado.'},
                            title: { type: Type.STRING, description: 'Un titular corto y llamativo para la alerta.'},
                            description: { type: Type.STRING, description: 'Una descripción clara y concisa (1-2 frases) del riesgo detectado y por qué es un problema.' },
                            severity: { type: Type.STRING, description: 'El nivel de riesgo: "warning" para problemas potenciales, "critical" para problemas urgentes e inminentes.'}
                        },
                        required: ['projectId', 'title', 'description', 'severity']
                    }
                };

                const response = await ai.models.generateContent({
                    model: "gemini-2.5-flash",
                    contents: prompt,
                    config: {
                        responseMimeType: "application/json",
                        responseSchema: responseSchema,
                    },
                });
                
                const generatedJSON = JSON.parse(response.text);
                setInsights(generatedJSON);

            } catch (error) {
                console.error("Error generating AI insights:", error);
                // En caso de error, podríamos poner un insight por defecto
                setInsights([]); 
            } finally {
                setIsLoadingInsights(false);
            }
        };

        fetchInsights();
    }, []);

    const activeProjectsData = PROJECTS.filter(p => p.status !== ProjectStatus.Completed && p.status !== ProjectStatus.OnHold);
    const activeProjects = activeProjectsData.length;
    const totalBudget = activeProjectsData.reduce((acc, p) => acc + p.budget, 0);
    const formattedBudget = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(totalBudget);
    const projectsAtRisk = PROJECTS.filter(p => p.status === ProjectStatus.AtRisk || p.status === ProjectStatus.OffTrack).length;
    const pendingDeliverables = MILESTONES.filter(m => m.status === MilestoneStatus.Pending || m.status === MilestoneStatus.InProgress).length;

    const chartData = PROJECTS.map(p => ({
        name: p.name.split(' ').slice(0, 2).join(' '),
        progreso: p.progress,
    }));

    return (
        <div className="p-8 space-y-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Bienvenido a ProjectSuite AI</h1>
                <p className="text-gray-600 dark:text-gray-300 mt-2">Esta plataforma está diseñada para ayudarte a controlar, reportar y entregar tus proyectos de forma inteligente, visual y colaborativa.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card title="Proyectos Activos" value={activeProjects} icon={<ProjectsIcon className="h-6 w-6 text-blue-600" />} />
                <Card title="Proyectos en Riesgo" value={projectsAtRisk} icon={<RisksIcon className="h-6 w-6 text-red-600" />} />
                <Card title="Presupuesto Total (Activos)" value={formattedBudget} icon={<DollarSignIcon className="h-6 w-6 text-green-600" />} />
                <Card title="Entregables Pendientes" value={pendingDeliverables} icon={<MilestonesIcon className="h-6 w-6 text-yellow-600" />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Avance Global por Proyecto</h2>
                    <div className="h-96">
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
                    <div className="flex items-center gap-3 mb-4">
                        <SparklesIcon className="h-6 w-6 text-indigo-500" />
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Análisis y Alertas de IA</h2>
                    </div>
                    <div className="space-y-4">
                        {isLoadingInsights ? (
                            Array.from({ length: 3 }).map((_, index) => (
                                <div key={index} className="p-4 rounded-lg bg-gray-100 dark:bg-gray-700 animate-pulse">
                                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
                                    <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
                                </div>
                            ))
                        ) : insights.length > 0 ? (
                            insights.map((insight, index) => <InsightCard key={index} insight={insight} />)
                        ) : (
                            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                <p>¡Todo en orden!</p>
                                <p className="text-sm">La IA no ha detectado riesgos críticos por el momento.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;