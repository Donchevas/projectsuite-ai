
import React, { useState } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { PROJECTS, REPORTS, MILESTONES, RISKS } from '../constants';
import { Report } from '../types';
import { SparklesIcon } from './Icons';

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
    const [selectedProject, setSelectedProject] = useState('');
    const [reportData, setReportData] = useState({
        activitiesDone: '',
        nextSteps: '',
        newRisks: '',
    });
    const [isGenerating, setIsGenerating] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setReportData(prev => ({ ...prev, [id]: value }));
    };
    
    const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedProject(e.target.value);
    };

    const handleGenerateWithAI = async () => {
        if (!selectedProject) {
            alert('Por favor, selecciona un proyecto primero.');
            return;
        }
        setIsGenerating(true);
        setReportData({ activitiesDone: '', nextSteps: '', newRisks: '' });

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

            const project = PROJECTS.find(p => p.id === selectedProject);
            const projectMilestones = MILESTONES.filter(m => m.projectId === selectedProject);
            const projectRisks = RISKS.filter(r => r.projectId === selectedProject);
            const projectHistory = REPORTS.filter(r => r.projectId === selectedProject);

            const contextData = { project, milestones: projectMilestones, risks: projectRisks, history: projectHistory };

            const prompt = `
                Eres un Project Manager senior en una consultora de tecnología. Tu tarea es redactar un reporte de avance semanal conciso y profesional para el proyecto detallado a continuación.
                Basado en los datos JSON proporcionados (detalles del proyecto, hitos recientes, riesgos abiertos e informes anteriores), genera un resumen para la semana actual en español.
                La salida debe ser estrictamente un objeto JSON.
                Datos del Proyecto:
                ${JSON.stringify(contextData, null, 2)}
            `;
            
            const responseSchema = {
              type: Type.OBJECT,
              properties: {
                activitiesDone: {
                  type: Type.STRING,
                  description: 'Resumen de los logros clave y tareas completadas esta semana. Infiere actividades de los hitos completados o en curso.'
                },
                nextSteps: {
                  type: Type.STRING,
                  description: 'Prioridades y tareas principales para la próxima semana. Basa esto en los hitos pendientes y la progresión lógica del proyecto.'
                },
                newRisks: {
                  type: Type.STRING,
                  description: 'Nuevos riesgos potenciales o actualizaciones sobre los riesgos existentes de alta prioridad. Si no hay riesgos nuevos significativos, indica "Ninguno".'
                }
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
            
            setReportData({
                activitiesDone: generatedJSON.activitiesDone || '',
                nextSteps: generatedJSON.nextSteps || '',
                newRisks: generatedJSON.newRisks || '',
            });

        } catch (error) {
            console.error("Error generating report with AI:", error);
            alert("Ocurrió un error al generar el reporte. Por favor, inténtalo de nuevo.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Generación de Reportes</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md h-fit">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Reporte Semanal</h2>
                    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                        <div>
                            <label htmlFor="project" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Proyecto</label>
                            <select id="project" value={selectedProject} onChange={handleProjectChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white">
                                <option value="">Seleccionar proyecto</option>
                                {PROJECTS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="activitiesDone" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Actividades Realizadas</label>
                            <textarea id="activitiesDone" value={reportData.activitiesDone} onChange={handleInputChange} disabled={isGenerating} rows={4} className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white disabled:bg-gray-200 dark:disabled:bg-gray-600" placeholder="Describa las actividades..."></textarea>
                        </div>
                        <div>
                            <label htmlFor="nextSteps" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Próximos Pasos</label>
                            <textarea id="nextSteps" value={reportData.nextSteps} onChange={handleInputChange} disabled={isGenerating} rows={3} className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white disabled:bg-gray-200 dark:disabled:bg-gray-600" placeholder="Describa los siguientes pasos..."></textarea>
                        </div>
                         <div>
                            <label htmlFor="newRisks" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Riesgos Nuevos/Actualizados</label>
                            <textarea id="newRisks" value={reportData.newRisks} onChange={handleInputChange} disabled={isGenerating} rows={2} className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white disabled:bg-gray-200 dark:disabled:bg-gray-600" placeholder="Describa los riesgos..."></textarea>
                        </div>
                        <div className="flex flex-col sm:flex-row-reverse gap-3 pt-2">
                             <button type="submit" className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                Generar PDF y Enviar
                            </button>
                             <button
                                type="button"
                                onClick={handleGenerateWithAI}
                                disabled={!selectedProject || isGenerating}
                                className="w-full flex items-center justify-center gap-2 text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-indigo-500 dark:hover:bg-indigo-600 dark:focus:ring-indigo-800 disabled:bg-indigo-300 dark:disabled:bg-indigo-800 disabled:cursor-not-allowed transition-colors"
                            >
                                {isGenerating ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Generando...
                                    </>
                                ) : (
                                    <>
                                        <SparklesIcon className="h-5 w-5" />
                                        Generar con IA
                                    </>
                                )}
                            </button>
                        </div>
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