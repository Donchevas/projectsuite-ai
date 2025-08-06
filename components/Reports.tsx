
import React from 'react';
import { PROJECTS, REPORTS } from '../constants';
import { Report } from '../types';

const ReportCard: React.FC<{report: Report}> = ({ report }) => {
    const project = PROJECTS.find(p => p.id === report.projectId);
    return (
         <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-2">
                <h4 className="font-bold text-gray-800 dark:text-white">{report.week} - {project?.name}</h4>
                <span className="text-xs text-gray-500 dark:text-gray-400">{report.date}</span>
            </div>
             <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Enviado por: {report.submittedBy}</p>
             <div className="space-y-3 text-sm">
                <div>
                    <p className="font-semibold text-gray-600 dark:text-gray-300">Actividades Realizadas:</p>
                    <p className="text-gray-700 dark:text-gray-200">{report.activitiesDone}</p>
                </div>
                <div>
                    <p className="font-semibold text-gray-600 dark:text-gray-300">Próximos Pasos:</p>
                    <p className="text-gray-700 dark:text-gray-200">{report.nextSteps}</p>
                </div>
                 <div>
                    <p className="font-semibold text-gray-600 dark:text-gray-300">Nuevos Riesgos:</p>
                    <p className="text-gray-700 dark:text-gray-200">{report.newRisks}</p>
                </div>
             </div>
             <button className="mt-4 text-sm text-blue-600 hover:underline">Ver PDF</button>
         </div>
    );
}


const Reports: React.FC = () => {
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Generación de Reportes</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md h-fit">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Reporte Semanal</h2>
                    <form className="space-y-4">
                        <div>
                            <label htmlFor="project" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Proyecto</label>
                            <select id="project" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white">
                                <option>Seleccionar proyecto</option>
                                {PROJECTS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="activities" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Actividades Realizadas</label>
                            <textarea id="activities" rows={4} className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" placeholder="Describa las actividades..."></textarea>
                        </div>
                        <div>
                            <label htmlFor="next-steps" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Próximos Pasos</label>
                            <textarea id="next-steps" rows={3} className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" placeholder="Describa los siguientes pasos..."></textarea>
                        </div>
                         <div>
                            <label htmlFor="new-risks" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Riesgos Nuevos/Actualizados</label>
                            <textarea id="new-risks" rows={2} className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" placeholder="Describa los riesgos..."></textarea>
                        </div>
                        <button type="submit" className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                            Generar PDF y Enviar
                        </button>
                    </form>
                </div>

                <div className="lg:col-span-2">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Historial de Reportes</h2>
                    <div className="space-y-4">
                       {REPORTS.map(report => (
                           <ReportCard key={report.id} report={report} />
                       ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;
