
import { GoogleGenAI, Type } from "@google/genai";
import type { Roadmap, Job } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const roadmapSchema = {
    type: Type.OBJECT,
    properties: {
        weeks: {
            type: Type.ARRAY,
            description: "An array of weekly learning plans.",
            items: {
                type: Type.OBJECT,
                properties: {
                    week: { type: Type.INTEGER, description: "The week number." },
                    title: { type: Type.STRING, description: "The title for the week's curriculum." },
                    topics: {
                        type: Type.ARRAY,
                        description: "An array of topics to study during the week.",
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                title: { type: Type.STRING, description: "The specific topic title." },
                                completed: { type: Type.BOOLEAN, description: "Status of completion, default to false." },
                                resources: {
                                    type: Type.ARRAY,
                                    description: "A list of useful links or resources for the topic.",
                                    items: { type: Type.STRING }
                                }
                            },
                            required: ["title", "completed", "resources"]
                        }
                    },
                    project: { type: Type.STRING, description: "A small project to complete at the end of the week." }
                },
                required: ["week", "title", "topics", "project"]
            }
        }
    },
    required: ["weeks"]
};

const jobsSchema = {
    type: Type.OBJECT,
    properties: {
        jobs: {
            type: Type.ARRAY,
            description: "A list of relevant job opportunities.",
            items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING, description: "The job title." },
                    company: { type: Type.STRING, description: "The company name." },
                    link: { type: Type.STRING, description: "A link to the job application or description." },
                    description: { type: Type.STRING, description: "A brief description of the job role." }
                },
                required: ["title", "company", "link", "description"]
            }
        }
    },
    required: ["jobs"]
};


export const generateRoadmap = async (skill: string, duration: string): Promise<Roadmap> => {
    const prompt = `Generate a detailed learning roadmap for a beginner to learn ${skill} over a period of ${duration}. The roadmap should be divided by weeks. For each week, provide a title, a list of key topics with suggested online resources (like articles, tutorials, or documentation), and a small project to apply the learned concepts. Ensure the response is in JSON format. For each topic, include a 'completed' field set to false.`;
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: roadmapSchema,
            },
        });
        const jsonText = response.text.trim();
        const parsedJson = JSON.parse(jsonText);
        return parsedJson as Roadmap;
    } catch (error) {
        console.error("Error generating roadmap:", error);
        throw new Error("Failed to generate learning roadmap.");
    }
};

export const matchJobs = async (skill: string, progress: number): Promise<Job[]> => {
    const prompt = `Based on a user who is learning ${skill} and is ${progress}% complete with their learning roadmap, find 5 relevant beginner or intermediate job listings. Provide the job title, company, a valid application link, and a short description for each. Ensure the response is in JSON format.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: jobsSchema,
            },
        });
        const jsonText = response.text.trim();
        const parsedJson = JSON.parse(jsonText);
        return parsedJson.jobs as Job[];
    } catch (error) {
        console.error("Error matching jobs:", error);
        throw new Error("Failed to match jobs.");
    }
};
