
import React, { useState } from 'react';
import PptxGenJS from 'pptxgenjs';
import { GoogleGenAI, Type } from '@google/genai';
import { PROJECTS, MILESTONES, RISKS, REPORTS } from '../constants';
import { Project } from '../types';
import { PresentationIcon } from './Icons';

const Presentations: React.FC = () => {
    const [selectedProjectId, setSelectedProjectId] = useState<string>('');
    const [isGenerating, setIsGenerating] = useState<boolean>(false);

    const handleGeneratePresentation = async () => {
        if (!selectedProjectId) {
            alert('Por favor, selecciona un proyecto.');
            return;
        }
        setIsGenerating(true);

        try {
            const project = PROJECTS.find(p => p.id === selectedProjectId);
            if (!project) throw new Error('Proyecto no encontrado');

            const projectMilestones = MILESTONES.filter(m => m.projectId === selectedProjectId);
            const projectRisks = RISKS.filter(r => r.projectId === selectedProjectId && r.status === 'Abierto');
            const projectReports = REPORTS.filter(r => r.projectId === selectedProjectId).slice(-3); // Get last 3 reports

            // 1. Generate content with AI
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            const context = {
                project,
                milestones: projectMilestones,
                risks: projectRisks,
                reports: projectReports
            };

            const prompt = `
                Actúa como un consultor PMO de alto nivel preparando un reporte ejecutivo conciso y basado en datos para la dirección.
                Analiza el siguiente JSON, que contiene detalles del proyecto, hitos, riesgos y reportes de estado recientes. 
                Tu análisis debe ser cuantitativo. Utiliza cifras específicas (porcentajes, costos, fechas) de los datos proporcionados para fundamentar tus conclusiones.
                Genera el contenido para una presentación de 4 diapositivas. El tono debe ser profesional y directo.
                La salida debe ser estrictamente un objeto JSON que siga el schema proporcionado.

                Datos del Proyecto:
                ${JSON.stringify(context, null, 2)}
            `;

            const responseSchema = {
                type: Type.OBJECT,
                properties: {
                    titleSlide: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING, description: "Título principal de la presentación, usando el nombre del proyecto." },
                            subtitle: { type: Type.STRING, description: "Subtítulo, por ejemplo 'Reporte de Avance Ejecutivo'."},
                        }, required: ['title', 'subtitle']
                    },
                    summarySlide: {
                        type: Type.OBJECT,
                        properties: {
                            keyAchievements: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Lista de 3-4 logros clave recientes, basado en hitos completados o reportes. Sé específico." },
                            nextSteps: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Lista de 3-4 próximos pasos críticos, basado en hitos pendientes." },
                            overallStatusText: { type: Type.STRING, description: "Un párrafo (2-3 frases) resumiendo el estado general del proyecto (On Track, At Risk, etc.) y por qué, citando el porcentaje de avance." },
                        }, required: ['keyAchievements', 'nextSteps', 'overallStatusText']
                    },
                    financialsSlide: {
                        type: Type.OBJECT,
                        properties: {
                            analysis: { type: Type.STRING, description: "Análisis del estado financiero. Menciona el porcentaje de consumo del presupuesto y si es saludable, está en riesgo o ha excedido las previsiones." }
                        }, required: ['analysis']
                    },
                    risksSlide: {
                        type: Type.OBJECT,
                        properties: {
                             topRisks: { type: Type.ARRAY, items: { 
                                type: Type.OBJECT,
                                properties: {
                                    name: { type: Type.STRING },
                                    mitigation: { type: Type.STRING }
                                }, required: ['name', 'mitigation']
                             }, description: "Los 2-3 riesgos abiertos más importantes (por impacto y probabilidad). Si no hay, devuelve un array vacío." }
                        }, required: ['topRisks']
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
            
            const content = JSON.parse(response.text);

            // 2. Build the PPTX
            let pptx = new PptxGenJS();
            pptx.layout = 'LAYOUT_WIDE';
            
            const addFooter = (slide: PptxGenJS.Slide) => {
                slide.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 6.9, w: '100%', h: 0.6, fill: { color: '003366' } });
                slide.addText('ProjectSuite AI | Reporte Confidencial', { x: 0.5, y: 7.05, w: '50%', color: 'FFFFFF', fontSize: 10 });
            };

            // Slide 1: Title
            let titleSlide = pptx.addSlide();
            titleSlide.background = { color: 'F1F1F1' };
            titleSlide.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: '30%', h: '100%', fill: { color: '003366' } });
            titleSlide.addText(content.titleSlide.title, { 
                x: 0.5, y: 2.8, w: '90%', h: 1, 
                align: 'left', fontSize: 36, color: 'FFFFFF', bold: true 
            });
            titleSlide.addText(content.titleSlide.subtitle, { 
                x: 4, y: 3.5, w: '55%', h: 0.75, 
                align: 'left', fontSize: 24, color: '333333'
            });
            titleSlide.addText(`Fecha: ${new Date().toLocaleDateString('es-ES')}`, { 
                x: 4, y: 4.2, w: '55%', h: 0.5, 
                align: 'left', fontSize: 14, color: '666666'
            });

            // Slide 2: Summary
            let summarySlide = pptx.addSlide({ slideNumber: { x: 12.8, y: 7.05, color: 'FFFFFF', fontSize: 10 } });
            summarySlide.addText('Resumen Ejecutivo: Estado y Proyecciones', { x:0.5, y:0.25, w:'90%', h:0.5, fontSize:28, bold:true, color:'003366' });
            
            summarySlide.addText('Logros Clave', { x:0.5, y:1, w:4.5, h:0.5, fontSize:20, bold:true, color: '0055A5' });
            if (content.summarySlide && content.summarySlide.keyAchievements) {
                const achievementsSource = content.summarySlide.keyAchievements;
                // Defensively process AI response: ensure it's an array, sanitize each item to a string, 
                // and wrap it in the object format { text: '...' } to prevent library errors.
                const achievements = (Array.isArray(achievementsSource) ? achievementsSource : [achievementsSource])
                    .map(item => ({ text: String(item || '').trim() }))
                    .filter(item => item.text.length > 0 && item.text.toLowerCase() !== 'null');
                
                if (achievements.length > 0) {
                    summarySlide.addText(achievements, { x: 0.5, y: 1.5, w: 4.5, h: 2.2, bullet: { type: 'number' }, fontSize: 14 });
                }
            }
            
            summarySlide.addText('Próximos Pasos', { x:5.5, y:1, w:4.5, h:0.5, fontSize:20, bold:true, color: '0055A5' });
            if (content.summarySlide && content.summarySlide.nextSteps) {
                const nextStepsSource = content.summarySlide.nextSteps;
                const nextSteps = (Array.isArray(nextStepsSource) ? nextStepsSource : [nextStepsSource])
                   .map(item => ({ text: String(item || '').trim() }))
                   .filter(item => item.text.length > 0 && item.text.toLowerCase() !== 'null');

                if (nextSteps.length > 0) {
                    summarySlide.addText(nextSteps, { x: 5.5, y: 1.5, w: 4.5, h: 2.2, bullet: { type: 'number' }, fontSize: 14 });
                }
            }

            summarySlide.addShape(pptx.shapes.RECTANGLE, { x:0.5, y:4.2, w:'90%', h:2.2, fill: {color: 'F1F1F1'}, line: {color: 'DDDDDD', width: 1} });
            if (content.summarySlide && content.summarySlide.overallStatusText) {
                summarySlide.addText(content.summarySlide.overallStatusText, { x: 0.75, y: 4.45, w: '85%', h: 1.8, fontSize: 15, align: 'left', valign: 'top' });
            }
            addFooter(summarySlide);


            // Slide 3: Financials
            let financialSlide = pptx.addSlide({ slideNumber: { x: 12.8, y: 7.05, color: 'FFFFFF', fontSize: 10 } });
            financialSlide.addText('Análisis Financiero y de Recursos', { x:0.5, y:0.25, w:'90%', h:0.5, fontSize:28, bold:true, color:'003366' });
            financialSlide.addText(content.financialsSlide.analysis, { x:0.5, y:1, w:'40%', h:2, fontSize:16, valign:'top' });
            
            const chartData = [{
                name: 'Finanzas (€)',
                labels: ['Presupuesto Total', 'Costo Actual'],
                values: [project.budget, project.currentCost],
            }];
            financialSlide.addChart(pptx.charts.BAR, chartData, { 
                x:5, y:1.5, w:7.5, h:4.5, 
                barDir: 'col',
                showValue: true, 
                valueColor: '333333',
                valueFontSize: 12,
                catAxisLabelColor: '666666',
                valAxisLabelColor: '666666',
                showLegend: false,
                title: 'Consumo de Presupuesto (€)',
                titleColor: '003366',
                titleFontSize: 16
            });
            addFooter(financialSlide);

            // Slide 4: Risks
            let risksSlide = pptx.addSlide({ slideNumber: { x: 12.8, y: 7.05, color: 'FFFFFF', fontSize: 10 } });
            risksSlide.addText('Riesgos Activos y Planes de Mitigación', { x:0.5, y:0.25, w:'90%', h:0.5, fontSize:28, bold:true, color:'003366' });
            
            if (content.risksSlide.topRisks && content.risksSlide.topRisks.length > 0) {
                let tableRows: any[][] = [
                    [{ text: "Riesgo Identificado", options: { bold: true, color: 'FFFFFF', fill: '003366', valign: 'middle' } },
                     { text: "Plan de Mitigación", options: { bold: true, color: 'FFFFFF', fill: '003366', valign: 'middle' } }]
                ];
                content.risksSlide.topRisks.forEach((risk: {name: string, mitigation: string}) => {
                    tableRows.push([risk.name, risk.mitigation]);
                });
                risksSlide.addTable(tableRows, { 
                    x: 0.5, y: 1.25, w: '90%', 
                    rowH: 1,
                    colW: [4.5, 4.5],
                    border: { type: 'solid', pt: 1, color: 'CCCCCC' },
                    valign: 'middle',
                    fontSize: 12
                });
            } else {
                 risksSlide.addText('No se han identificado riesgos críticos que requieran atención inmediata.', {
                    x:0.5, y:3, w:'90%', h:1, align:'center', fontSize: 16, color: '666666'
                });
            }
            addFooter(risksSlide);

            // 3. Download the file
            await pptx.writeFile({ fileName: `Reporte Ejecutivo - ${project.name}.pptx` });

        } catch (error) {
            console.error('Error generating presentation:', error);
            alert('Hubo un error al generar la presentación. La respuesta de la IA podría ser inválida o hubo un problema de conexión. Revisa la consola para más detalles técnicos.');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Generador de Presentaciones</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
                Selecciona un proyecto y la IA generará una presentación ejecutiva en formato PowerPoint (.pptx) lista para descargar.
            </p>

            <div className="max-w-md bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <div className="space-y-4">
                     <div>
                        <label htmlFor="project-select" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Selecciona un Proyecto</label>
                        <select 
                            id="project-select" 
                            value={selectedProjectId} 
                            onChange={(e) => setSelectedProjectId(e.target.value)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                        >
                            <option value="">-- Elige un proyecto --</option>
                            {PROJECTS.map((p: Project) => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                    </div>
                    <button
                        onClick={handleGeneratePresentation}
                        disabled={!selectedProjectId || isGenerating}
                        className="w-full flex items-center justify-center gap-2 text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:bg-blue-300 dark:disabled:bg-blue-800 disabled:cursor-not-allowed transition-colors"
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
                                <PresentationIcon className="h-5 w-5" />
                                Generar Presentación
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Presentations;
