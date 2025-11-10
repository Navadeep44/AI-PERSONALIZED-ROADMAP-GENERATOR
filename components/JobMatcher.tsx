
import React, { useState } from 'react';
import type { User, Job } from '../types';
import { matchJobs } from '../services/geminiService';

const JobCard: React.FC<{ job: Job }> = ({ job }) => (
    <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800">{job.title}</h3>
        <p className="text-indigo-600 font-semibold my-1">{job.company}</p>
        <p className="text-gray-600 text-sm mb-4">{job.description}</p>
        <a href={job.link} target="_blank" rel="noopener noreferrer" className="inline-block bg-indigo-100 text-indigo-700 font-semibold py-2 px-4 rounded-lg hover:bg-indigo-200 transition duration-300">
            Apply Now
        </a>
    </div>
);

const JobMatcher = ({ user, jobs, setJobs }: { user: User, jobs: Job[] | null, setJobs: (jobs: Job[]) => void }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFindJobs = async () => {
    if (!user.skill) {
      setError("Please generate a learning path first to select a skill.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const matchedJobs = await matchJobs(user.skill, user.progress);
      setJobs(matchedJobs);
    } catch (e) {
      setError("Sorry, we couldn't find jobs for you. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
       <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">AI Job Matching</h2>
        <p className="text-gray-600 mb-4">
            Find job opportunities tailored to your skill set and learning progress.
            {user.skill && <span className="font-semibold"> Current skill: {user.skill}.</span>}
        </p>
        <button 
            onClick={handleFindJobs} 
            disabled={loading || !user.skill}
            className="bg-indigo-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-indigo-300 transition duration-300"
        >
            {loading ? 'Searching...' : 'Find Jobs'}
        </button>
        {error && <p className="text-red-500 mt-4">{error}</p>}
       </div>

        {jobs && (
             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.map((job, index) => (
                    <JobCard key={index} job={job} />
                ))}
            </div>
        )}
    </div>
  );
};

export default JobMatcher;
