
export interface User {
  id: string;
  name: string;
  email: string;
  skill: string | null;
  duration: string | null;
  progress: number;
}

export interface RoadmapTopic {
  title: string;
  completed: boolean;
  resources: string[];
}

export interface RoadmapWeek {
  week: number;
  title: string;
  topics: RoadmapTopic[];
  project: string;
}

export interface Roadmap {
  weeks: RoadmapWeek[];
}

export interface Job {
  title: string;
  company: string;
  link: string;
  description: string;
}

export interface StudyGroupMember {
  id: string;
  name: string;
  skill: string;
  progress: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
}
