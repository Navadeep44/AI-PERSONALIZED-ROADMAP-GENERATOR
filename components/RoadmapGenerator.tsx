
import React, { useState } from 'react';
import type { User, Roadmap, RoadmapWeek, RoadmapTopic } from '../types';
import { SKILLS, DURATIONS } from '../constants';
import { generateRoadmap } from '../services/geminiService';
import { ProgressIcon } from './icons/ProgressIcon';

const RoadmapGenerator = ({ user, roadmap, setRoadmap, onGenerate, progress }: { user: User, roadmap: Roadmap | null, setRoadmap: (roadmap: Roadmap) => void, onGenerate: (skill: string, duration: string) => void, progress: number }) => {
  const [selectedSkill, setSelectedSkill] = useState(user.skill || SKILLS[0]);
  const [selectedDuration, setSelectedDuration] = useState(user.duration || DURATIONS[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const newRoadmap = await generateRoadmap(selectedSkill, selectedDuration);
      setRoadmap(newRoadmap);
      onGenerate(selectedSkill, selectedDuration);
    } catch (e) {
      setError("Sorry, we couldn't generate your roadmap. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleTopicCompletion = (weekIndex: number, topicIndex: number) => {
    if (!roadmap) return;
    const newRoadmap = { ...roadmap };
    newRoadmap.weeks[weekIndex].topics[topicIndex].completed = !newRoadmap.weeks[weekIndex].topics[topicIndex].completed;
    setRoadmap(newRoadmap);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Create Your Learning Path</h2>
        <div className="grid md:grid-cols-3 gap-4 items-end">
          <div>
            <label htmlFor="skill" className="block text-sm font-medium text-gray-700">Select Skill</label>
            <select id="skill" value={selectedSkill} onChange={e => setSelectedSkill(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
              {SKILLS.map(skill => <option key={skill}>{skill}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700">Select Duration</label>
            <select id="duration" value={selectedDuration} onChange={e => setSelectedDuration(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
              {DURATIONS.map(duration => <option key={duration}>{duration}</option>)}
            </select>
          </div>
          <button onClick={handleGenerate} disabled={loading} className="w-full md:w-auto justify-self-start bg-indigo-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-indigo-300 transition duration-300">
            {loading ? 'Generating...' : 'Generate Roadmap'}
          </button>
        </div>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>

      {roadmap && (
        <>
        <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center"><ProgressIcon className="w-6 h-6 mr-3 text-indigo-600" /> My Progress</h2>
            <p className="text-gray-600 mb-2">You're {progress}% done with your roadmap!</p>
            <div className="w-full bg-gray-200 rounded-full h-4">
                <div className="bg-indigo-600 h-4 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
            </div>
        </div>

        <div className="space-y-6">
            {roadmap.weeks.map((week, weekIndex) => (
            <div key={week.week} className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-bold text-indigo-700 mb-1">Week {week.week}: {week.title}</h3>
                <div className="mt-4 space-y-3">
                {week.topics.map((topic, topicIndex) => (
                    <div key={topic.title} className="flex items-start">
                        <input
                            type="checkbox"
                            id={`topic-${weekIndex}-${topicIndex}`}
                            checked={topic.completed}
                            onChange={() => toggleTopicCompletion(weekIndex, topicIndex)}
                            className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 mt-1 cursor-pointer"
                        />
                        <label htmlFor={`topic-${weekIndex}-${topicIndex}`} className="ml-3 text-gray-700 flex-1 cursor-pointer">
                            <span className={`font-medium ${topic.completed ? 'line-through text-gray-500' : ''}`}>{topic.title}</span>
                             <div className="text-sm text-gray-500 mt-1">
                                {topic.resources.map((res, i) => (
                                    <a key={i} href={res} target="_blank" rel="noopener noreferrer" className="text-indigo-500 hover:underline mr-2">Resource {i+1}</a>
                                ))}
                            </div>
                        </label>
                    </div>
                ))}
                </div>
                <div className="mt-6 pt-4 border-t border-gray-200">
                    <h4 className="font-semibold text-gray-800">Weekly Project:</h4>
                    <p className="text-gray-600 mt-1">{week.project}</p>
                </div>
            </div>
            ))}
        </div>
        </>
      )}
    </div>
  );
};

export default RoadmapGenerator;
