
import React from 'react';
import { ViewType } from '../types';
import { DashboardIcon, ProjectsIcon, RisksIcon, MilestonesIcon, ReportsIcon, LessonsIcon, ClientIcon, PresentationIcon } from './Icons';

interface SidebarProps {
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
}

const navItems = [
  { view: 'dashboard' as ViewType, label: 'Dashboard', icon: DashboardIcon },
  { view: 'projects' as ViewType, label: 'Proyectos', icon: ProjectsIcon },
  { view: 'risks' as ViewType, label: 'Riesgos', icon: RisksIcon },
  { view: 'milestones' as ViewType, label: 'Hitos y Entregables', icon: MilestonesIcon },
  { view: 'reports' as ViewType, label: 'Reportes', icon: ReportsIcon },
  { view: 'presentations' as ViewType, label: 'Presentaciones', icon: PresentationIcon },
  { view: 'lessons' as ViewType, label: 'Lecciones Aprendidas', icon: LessonsIcon },
  { view: 'client' as ViewType, label: 'Vista Cliente', icon: ClientIcon },
];

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  return (
    <aside className="h-screen sticky top-0 bg-white dark:bg-gray-800 text-gray-900 dark:text-white flex flex-col w-20 md:w-64 transition-all duration-300 shadow-lg">
      <div className="flex items-center justify-center md:justify-start md:pl-6 h-16 border-b dark:border-gray-700">
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
          P
        </div>
        <span className="ml-3 text-lg font-bold hidden md:block">ProjectSuite AI</span>
      </div>
      <nav className="flex-1 px-2 md:px-4 py-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.view;
          return (
            <button
              key={item.view}
              onClick={() => setActiveView(item.view)}
              className={`flex items-center justify-center md:justify-start w-full p-3 rounded-lg transition-colors duration-200 ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
              }`}
            >
              <Icon className="h-6 w-6" />
              <span className="ml-4 font-medium hidden md:block">{item.label}</span>
            </button>
          );
        })}
      </nav>
      <div className="p-4 border-t dark:border-gray-700">
         <div className="flex items-center justify-center md:justify-start">
             <img className="h-10 w-10 rounded-full" src="https://picsum.photos/100" alt="User Avatar" />
             <div className="ml-3 hidden md:block">
                 <p className="text-sm font-semibold text-gray-800 dark:text-white">Admin</p>
                 <p className="text-xs text-gray-500 dark:text-gray-400">admin@ayesa.com</p>
             </div>
         </div>
      </div>
    </aside>
  );
};

export default Sidebar;