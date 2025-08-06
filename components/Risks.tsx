
import React, { useState, useMemo } from 'react';
import { RISKS, PROJECTS } from '../constants';
import { Risk, RiskImpact, RiskProbability } from '../types';

const impactColor: { [key in RiskImpact]: string } = {
    [RiskImpact.High]: 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200 border-red-500',
    [RiskImpact.Medium]: 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200 border-yellow-500',
    [RiskImpact.Low]: 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200 border-green-500',
};

const probabilityColor: { [key in RiskProbability]: string } = {
    [RiskProbability.High]: 'text-red-600 dark:text-red-400',
    [RiskProbability.Medium]: 'text-yellow-600 dark:text-yellow-400',
    [RiskProbability.Low]: 'text-green-600 dark:text-green-400',
};


const RiskCard: React.FC<{ risk: Risk }> = ({ risk }) => {
    const project = PROJECTS.find(p => p.id === risk.projectId);
    const isOutdated = new Date(risk.lastUpdated) < new Date(new Date().setDate(new Date().getDate() - 7));
    
    return (
        <div className={`bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border-l-4 ${impactColor[risk.impact]}`}>
             {isOutdated && (
                <div className="absolute top-2 right-2 text-xs bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full animate-pulse">
                    No actualizado
                </div>
            )}
            <div className="flex justify-between items-start">
                <h3 className="font-bold text-gray-800 dark:text-white text-lg mb-2">{risk.name}</h3>
                <span className={`text-sm font-semibold px-2 py-1 rounded-md ${impactColor[risk.impact]}`}>{risk.impact}</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Proyecto: <span className="font-medium text-gray-700 dark:text-gray-300">{project?.name || 'N/A'}</span>
            </p>
            
            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                <div>
                    <p className="text-gray-500 dark:text-gray-400">Probabilidad</p>
                    <p className={`font-semibold ${probabilityColor[risk.probability]}`}>{risk.probability}</p>
                </div>
                <div>
                    <p className="text-gray-500 dark:text-gray-400">Responsable</p>
                    <p className="font-medium text-gray-700 dark:text-gray-300">{risk.owner}</p>
                </div>
                <div>
                    <p className="text-gray-500 dark:text-gray-400">Estado</p>
                    <p className="font-medium text-gray-700 dark:text-gray-300">{risk.status}</p>
                </div>
                 <div>
                    <p className="text-gray-500 dark:text-gray-400">Última Act.</p>
                    <p className="font-medium text-gray-700 dark:text-gray-300">{risk.lastUpdated}</p>
                </div>
            </div>

            <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Plan de Mitigación</p>
                <p className="text-sm text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-md">{risk.mitigationPlan}</p>
            </div>
        </div>
    );
};

const Risks: React.FC = () => {
    const [filter, setFilter] = useState('Todos');

    const filteredRisks = useMemo(() => {
        if (filter === 'Todos') return RISKS;
        if (filter === 'Críticos') return RISKS.filter(r => r.impact === RiskImpact.High && r.probability === RiskProbability.High);
        if (filter === 'Altos') return RISKS.filter(r => r.impact === RiskImpact.High || r.probability === RiskProbability.High);
        return RISKS;
    }, [filter]);
    
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Gestión de Riesgos</h1>

             <div className="flex items-center space-x-2 mb-6">
                <span className="text-gray-600 dark:text-gray-300">Filtrar por criticidad:</span>
                {['Todos', 'Críticos', 'Altos'].map(f => (
                    <button 
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${filter === f ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'}`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRisks.map(risk => (
                    <RiskCard key={risk.id} risk={risk} />
                ))}
            </div>
             {filteredRisks.length === 0 && (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400 col-span-full">
                    No hay riesgos que coincidan con el filtro seleccionado.
                </div>
            )}
        </div>
    );
};

export default Risks;
