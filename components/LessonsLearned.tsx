
import React from 'react';
import { LESSONS_LEARNED, PROJECTS } from '../constants';
import { LessonLearned } from '../types';
import { UpVoteIcon } from './Icons';

const LessonCard: React.FC<{ lesson: LessonLearned }> = ({ lesson }) => {
    const project = PROJECTS.find(p => p.id === lesson.projectId);
    return (
        <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md flex items-start space-x-4">
            <div className="flex flex-col items-center space-y-1">
                <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                    <UpVoteIcon className="h-5 w-5 text-gray-600 dark:text-gray-300"/>
                </button>
                <span className="font-bold text-lg text-blue-600 dark:text-blue-400">{lesson.votes}</span>
            </div>
            <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                    <span className="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-800 rounded-full dark:bg-blue-900/50 dark:text-blue-200">
                        {lesson.category}
                    </span>
                     <span className="text-xs text-gray-500 dark:text-gray-400">
                        Proyecto: {project?.name || 'N/A'}
                    </span>
                </div>
                <p className="text-gray-700 dark:text-gray-200">
                    {lesson.description}
                </p>
            </div>
        </div>
    );
}

const LessonsLearned: React.FC = () => {
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Lecciones Aprendidas</h1>
             <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-6">
                 <p className="text-gray-600 dark:text-gray-300">Un repositorio central de conocimiento para mejorar continuamente. Vota por las lecciones más valiosas para destacarlas.</p>
             </div>

            <div className="space-y-4">
                {LESSONS_LEARNED
                    .sort((a,b) => b.votes - a.votes)
                    .map(lesson => <LessonCard key={lesson.id} lesson={lesson} />
                )}
            </div>
        </div>
    );
};

export default LessonsLearned;
