
import React from 'react';
import { MILESTONES, PROJECTS } from '../constants';
import { Milestone, MilestoneStatus } from '../types';

const statusStyles: { [key in MilestoneStatus]: { dot: string; text: string; } } = {
    [MilestoneStatus.Completed]: { dot: 'bg-green-500', text: 'text-green-700 dark:text-green-300' },
    [MilestoneStatus.InProgress]: { dot: 'bg-blue-500', text: 'text-blue-700 dark:text-blue-300' },
    [MilestoneStatus.Pending]: { dot: 'bg-gray-500', text: 'text-gray-700 dark:text-gray-300' },
    [MilestoneStatus.Delayed]: { dot: 'bg-red-500', text: 'text-red-700 dark:text-red-300' },
};

const MilestoneItem: React.FC<{ milestone: Milestone }> = ({ milestone }) => {
    const project = PROJECTS.find(p => p.id === milestone.projectId);
    const styles = statusStyles[milestone.status];

    return (
        <li className="mb-10 ml-6">            
            <span className={`absolute flex items-center justify-center w-6 h-6 rounded-full -left-3 ring-8 ring-white dark:ring-gray-900 ${styles.dot}`}>
            </span>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border dark:border-gray-700">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{milestone.name}</h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${styles.text} ${styles.dot.replace('bg-', 'bg-').replace('-500', '-100')} dark:${styles.dot.replace('bg-', 'bg-').replace('-500', '-900/50')}`}>
                        {milestone.status}
                    </span>
                </div>
                <p className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                    Proyecto: {project?.name || 'N/A'}
                </p>
                <time className="text-sm font-normal text-gray-500 dark:text-gray-400">
                    Fecha Límite: {milestone.dueDate}
                </time>
                 {milestone.status === MilestoneStatus.Delayed && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">Este hito está retrasado.</p>
                )}
            </div>
        </li>
    );
};

const Milestones: React.FC = () => {
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">Hitos y Entregables</h1>
            
            <ol className="relative border-l border-gray-200 dark:border-gray-700">                  
                {MILESTONES.sort((a,b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()).map(milestone => (
                    <MilestoneItem key={milestone.id} milestone={milestone} />
                ))}
            </ol>
        </div>
    );
};

export default Milestones;
