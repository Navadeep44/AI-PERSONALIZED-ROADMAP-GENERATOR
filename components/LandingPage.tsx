
import React from 'react';
import { RoadmapIcon } from './icons/RoadmapIcon';
import { ProgressIcon } from './icons/ProgressIcon';
import { JobsIcon } from './icons/JobsIcon';
import { GroupIcon } from './icons/GroupIcon';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 text-indigo-600 mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);


const LandingPage = ({ onGetStarted }: { onGetStarted: () => void }) => {
  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <header className="absolute top-0 left-0 right-0 p-4 sm:p-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-indigo-600">LearnPath AI</h1>
      </header>
      <main>
        <section className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-white">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-4 leading-tight">
            Your Personalized AI Learning Journey Starts <span className="text-indigo-600">Here</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Create custom learning roadmaps, track your progress, find relevant jobs, and connect with fellow learners. All powered by AI.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <button
              onClick={onGetStarted}
              className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75 transition duration-300"
            >
              Get Started
            </button>
            <button
              onClick={scrollToFeatures}
              className="px-8 py-3 bg-white text-indigo-600 font-semibold rounded-lg border border-indigo-200 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75 transition duration-300"
            >
              Learn More
            </button>
          </div>
        </section>

        <section id="features" className="py-20 px-4 bg-gray-50">
          <div className="container mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Features</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <FeatureCard 
                icon={<RoadmapIcon className="w-6 h-6" />}
                title="AI Roadmaps"
                description="Get a personalized, step-by-step learning plan for any skill, tailored to your desired timeline."
              />
              <FeatureCard 
                icon={<JobsIcon className="w-6 h-6" />}
                title="Job Matching"
                description="Discover job opportunities that match your skills and learning progress, curated by AI."
              />
               <FeatureCard 
                icon={<GroupIcon className="w-6 h-6" />}
                title="Study Groups"
                description="Connect with peers who are on the same learning path, form study groups, and learn together."
              />
              <FeatureCard 
                icon={<ProgressIcon className="w-6 h-6" />}
                title="Progress Tracking"
                description="Visually track your learning journey, mark topics as complete, and stay motivated."
              />
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-white text-center p-6">
        <p className="text-gray-600">&copy; {new Date().getFullYear()} LearnPath AI. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
