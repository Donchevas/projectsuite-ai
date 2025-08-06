
import React from 'react';
import { PROJECTS, MILESTONES, REPORTS } from '../constants';
import { Milestone, MilestoneStatus, Report } from '../types';

const statusStyles: { [key in MilestoneStatus]: { dot: string; text: string; } } = {
    [MilestoneStatus.Completed]: { dot: 'bg-green-500', text: 'text-green-700 dark:text-green-300' },
    [MilestoneStatus.InProgress]: { dot: 'bg-blue-500', text: 'text-blue-700 dark:text-blue-300' },
    [MilestoneStatus.Pending]: { dot: 'bg-gray-500', text: 'text-gray-700 dark:text-gray-300' },
    [MilestoneStatus.Delayed]: { dot: 'bg-red-500', text: 'text-red-700 dark:text-red-300' },
};

const ClientView: React.FC = () => {
    // Hardcoded for demonstration purposes
    const clientProject = PROJECTS.find(p => p.id === 'P001'); 
    
    if (!clientProject) {
        return <div className="p-8 text-center text-gray-500">No se encontró el proyecto del cliente.</div>;
    }

    const projectMilestones = MILESTONES.filter(m => m.projectId === clientProject.id);
    const projectReports = REPORTS.filter(r => r.projectId === clientProject.id);

    return (
        <div className="p-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Portal del Cliente: {clientProject.client}</h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 mt-1">Proyecto: {clientProject.name}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Estado de Hitos</h2>
                    <div className="space-y-4">
                        {projectMilestones.map(milestone => (
                             <div key={milestone.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border dark:border-gray-700">
                                <div className="flex justify-between items-center">
                                    <p className="font-medium text-gray-800 dark:text-gray-200">{milestone.name}</p>
                                    <span className={`flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full ${statusStyles[milestone.status].text} ${statusStyles[milestone.status].dot.replace('bg-', 'bg-').replace('-500', '-100')} dark:${statusStyles[milestone.status].dot.replace('bg-', 'bg-').replace('-500', '-900/50')}`}>
                                        <span className={`w-2 h-2 mr-1.5 rounded-full ${statusStyles[milestone.status].dot}`}></span>
                                        {milestone.status}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Fecha Límite: {milestone.dueDate}</p>
                            </div>
                        ))}
                    </div>
                </div>
                 <div>
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Reportes Validados</h2>
                    <div className="space-y-4">
                        {projectReports.map(report => (
                             <div key={report.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border dark:border-gray-700">
                                <div className="flex justify-between items-center mb-2">
                                     <h3 className="font-semibold text-gray-800 dark:text-gray-200">{report.week}</h3>
                                     <span className="text-sm text-gray-500 dark:text-gray-400">{report.date}</span>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-300"><strong>Próximos Pasos:</strong> {report.nextSteps}</p>
                             </div>
                        ))}
                         {projectReports.length === 0 && (
                             <div className="text-center py-8 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                                No hay reportes disponibles.
                             </div>
                         )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientView;
