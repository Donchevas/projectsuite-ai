
import React, { useState, useMemo } from 'react';
import { PROJECTS } from '../constants';
import { Project, ProjectStatus } from '../types';

const statusColors: { [key in ProjectStatus]: string } = {
  [ProjectStatus.OnTrack]: 'bg-green-500',
  [ProjectStatus.AtRisk]: 'bg-yellow-500',
  [ProjectStatus.OffTrack]: 'bg-red-500',
  [ProjectStatus.Completed]: 'bg-blue-500',
  [ProjectStatus.OnHold]: 'bg-gray-500',
};

const Projects: React.FC = () => {
    const [filters, setFilters] = useState({ pm: '', client: '', status: '' });

    const projectManagers = useMemo(() => [...new Set(PROJECTS.map(p => p.projectManager))], []);
    const clients = useMemo(() => [...new Set(PROJECTS.map(p => p.client))], []);
    const statuses = useMemo(() => Object.values(ProjectStatus), []);

    const filteredProjects = useMemo(() => {
        return PROJECTS.filter(project => {
            return (filters.pm === '' || project.projectManager === filters.pm) &&
                   (filters.client === '' || project.client === filters.client) &&
                   (filters.status === '' || project.status === filters.status);
        });
    }, [filters]);
    
    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const formatCurrency = (value: number) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(value);

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Proyectos</h1>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition-colors">
                    Añadir Nuevo Proyecto
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 col-span-full">Filtros</h3>
                    <select name="pm" onChange={handleFilterChange} value={filters.pm} className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                        <option value="">Todos los PM</option>
                        {projectManagers.map(pm => <option key={pm} value={pm}>{pm}</option>)}
                    </select>
                    <select name="client" onChange={handleFilterChange} value={filters.client} className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                        <option value="">Todos los Clientes</option>
                        {clients.map(client => <option key={client} value={client}>{client}</option>)}
                    </select>
                     <select name="status" onChange={handleFilterChange} value={filters.status} className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                        <option value="">Todos los Estados</option>
                        {statuses.map(status => <option key={status} value={status}>{status}</option>)}
                    </select>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">Nombre del Proyecto</th>
                            <th scope="col" className="px-6 py-3">Avance</th>
                            <th scope="col" className="px-6 py-3">Estado</th>
                            <th scope="col" className="px-6 py-3">Costo / Presupuesto</th>
                            <th scope="col" className="px-6 py-3">Cliente</th>
                            <th scope="col" className="px-6 py-3">Fecha Fin Estimada</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProjects.map((project: Project) => {
                            const costPercentage = (project.currentCost / project.budget) * 100;
                            let costColor = 'bg-green-600';
                            if (costPercentage > 95) {
                                costColor = 'bg-red-600';
                            } else if (costPercentage > 80) {
                                costColor = 'bg-yellow-500';
                            }

                            return (
                                <tr key={project.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">{project.name}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mr-2">
                                                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${project.progress}%` }}></div>
                                            </div>
                                            <span>{project.progress}%</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full`}>
                                            <span className={`w-2 h-2 mr-2 rounded-full ${statusColors[project.status]}`}></span>
                                            <span className="text-gray-800 dark:text-gray-200">{project.status}</span>
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <div className="flex items-center">
                                                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mr-2">
                                                    <div className={`${costColor} h-2.5 rounded-full`} style={{ width: `${costPercentage}%` }}></div>
                                                </div>
                                                <span>{Math.round(costPercentage)}%</span>
                                            </div>
                                            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 whitespace-nowrap">
                                                {formatCurrency(project.currentCost)} / {formatCurrency(project.budget)}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">{project.client}</td>
                                    <td className="px-6 py-4">{project.endDate}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                 {filteredProjects.length === 0 && (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        No se encontraron proyectos con los filtros seleccionados.
                    </div>
                 )}
            </div>
        </div>
    );
};

export default Projects;