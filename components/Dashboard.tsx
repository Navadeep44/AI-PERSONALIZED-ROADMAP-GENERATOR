
import React, { useState, useCallback } from 'react';
import type { User, Roadmap, Job, StudyGroupMember, ChatMessage } from '../types';
import { RoadmapIcon } from './icons/RoadmapIcon';
import { ProgressIcon } from './icons/ProgressIcon';
import { JobsIcon } from './icons/JobsIcon';
import { GroupIcon } from './icons/GroupIcon';
import RoadmapGenerator from './RoadmapGenerator';
import JobMatcher from './JobMatcher';
import StudyGroup from './StudyGroup';

type View = 'dashboard' | 'roadmap' | 'jobs' | 'group';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center w-full px-4 py-3 text-left rounded-lg transition-colors duration-200 ${
        isActive
            ? 'bg-indigo-600 text-white shadow-md'
            : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-600'
        }`}
    >
        {icon}
        <span className="ml-4 font-medium">{label}</span>
    </button>
);


export default function Dashboard({ user, onLogout }: { user: User; onLogout: () => void; }) {
  const [view, setView] = useState<View>('roadmap');
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [jobs, setJobs] = useState<Job[] | null>(null);
  const [currentUser, setCurrentUser] = useState<User>(user);

  const totalTopics = roadmap?.weeks.reduce((acc, week) => acc + week.topics.length, 0) || 0;
  const completedTopics = roadmap?.weeks.reduce((acc, week) => acc + week.topics.filter(t => t.completed).length, 0) || 0;
  const progress = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  const updateProgress = useCallback((newRoadmap: Roadmap) => {
    const newTotalTopics = newRoadmap.weeks.reduce((acc, week) => acc + week.topics.length, 0);
    const newCompletedTopics = newRoadmap.weeks.reduce((acc, week) => acc + week.topics.filter(t => t.completed).length, 0);
    const newProgress = newTotalTopics > 0 ? Math.round((newCompletedTopics / newTotalTopics) * 100) : 0;
    
    setRoadmap(newRoadmap);
    setCurrentUser(prevUser => ({...prevUser, progress: newProgress}));
  }, []);
  
  const handleSetUserSkillAndDuration = (skill: string, duration: string) => {
    setCurrentUser(prev => ({...prev, skill, duration}));
  };

  const renderView = () => {
    switch (view) {
      case 'roadmap':
        return <RoadmapGenerator user={currentUser} roadmap={roadmap} setRoadmap={updateProgress} onGenerate={handleSetUserSkillAndDuration} progress={progress} />;
      case 'jobs':
        return <JobMatcher user={currentUser} jobs={jobs} setJobs={setJobs} />;
      case 'group':
        return <StudyGroup user={currentUser} />;
      default:
        return <RoadmapGenerator user={currentUser} roadmap={roadmap} setRoadmap={updateProgress} onGenerate={handleSetUserSkillAndDuration} progress={progress}/>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      <aside className="w-64 bg-white shadow-md flex-shrink-0 flex flex-col p-4">
        <div className="text-2xl font-bold text-indigo-600 mb-8 px-2">LearnPath AI</div>
        <nav className="flex-grow space-y-2">
            <NavItem icon={<RoadmapIcon className="w-6 h-6" />} label="Learning Path" isActive={view === 'roadmap'} onClick={() => setView('roadmap')} />
            <NavItem icon={<JobsIcon className="w-6 h-6" />} label="Job Matches" isActive={view === 'jobs'} onClick={() => setView('jobs')} />
            <NavItem icon={<GroupIcon className="w-6 h-6" />} label="Study Group" isActive={view === 'group'} onClick={() => setView('group')} />
        </nav>
        <div className="mt-auto">
             <div className="flex items-center p-2">
                <div className="w-10 h-10 rounded-full bg-indigo-200 flex items-center justify-center font-bold text-indigo-700">
                    {user.name.charAt(0)}
                </div>
                <div className="ml-3">
                    <p className="font-semibold text-gray-800">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                </div>
            </div>
            <button
            onClick={onLogout}
            className="w-full mt-4 text-left flex items-center px-4 py-3 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors duration-200"
            >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
               <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
             </svg>
            <span className="ml-4 font-medium">Logout</span>
            </button>
        </div>
      </aside>
      <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
        <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.name} 👋</h1>
            <p className="text-gray-600 mt-1">Let's continue your learning journey!</p>
        </header>
        {renderView()}
      </main>
    </div>
  );
}
