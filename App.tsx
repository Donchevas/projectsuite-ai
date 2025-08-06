
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Projects from './components/Projects';
import Risks from './components/Risks';
import Milestones from './components/Milestones';
import Reports from './components/Reports';
import LessonsLearned from './components/LessonsLearned';
import ClientView from './components/ClientView';
import { ViewType } from './types';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('dashboard');

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'projects':
        return <Projects />;
      case 'risks':
        return <Risks />;
      case 'milestones':
        return <Milestones />;
      case 'reports':
        return <Reports />;
      case 'lessons':
        return <LessonsLearned />;
      case 'client':
        return <ClientView />;
      default:
        return <Dashboard />;
    }
  };

  const viewTitles: { [key in ViewType]: string } = {
    dashboard: 'Dashboard General',
    projects: 'Gestión de Proyectos',
    risks: 'Análisis de Riesgos',
    milestones: 'Hitos y Entregables',
    reports: 'Reportes de Avance',
    lessons: 'Lecciones Aprendidas',
    client: 'Portal del Cliente'
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <main className="flex-1">
        <header className="sticky top-0 bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg z-10 p-4 border-b border-gray-200 dark:border-gray-700">
           <h1 className="text-xl font-semibold text-gray-800 dark:text-white">{viewTitles[activeView]}</h1>
        </header>
        <div className="w-full">
            {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;
