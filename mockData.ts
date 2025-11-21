import { Plan } from './types';

export const MOCK_PLAN: Plan = {
    goalTitle: "Become a Senior Full Stack Developer in 6 Months",
    totalEstimatedHours: 480,
    feasibilityScore: 85,
    realismAssessment: "This plan is ambitious but achievable given your background. It requires consistent effort of ~20 hours per week. The timeline allows for deep dives into advanced topics, but burnout is a risk.",
    milestones: [
        {
            id: "m-1",
            title: "Advanced Frontend Mastery",
            kpi: "Build 3 complex UI components with 100% test coverage",
            estimatedHours: 120,
            tasks: [
                { id: "t-1-1", title: "Deep Dive into React Fiber Architecture", description: "Understand reconciliation and rendering optimization", durationMinutes: 240 },
                { id: "t-1-2", title: "Master CSS Grid & Flexbox", description: "Build a complex responsive layout clone", durationMinutes: 180 },
                { id: "t-1-3", title: "State Management Patterns", description: "Compare Redux, Zustand, and Context API", durationMinutes: 300 },
            ]
        },
        {
            id: "m-2",
            title: "Backend Scalability & Architecture",
            kpi: "Deploy a microservice capable of handling 1k RPS",
            estimatedHours: 160,
            tasks: [
                { id: "t-2-1", title: "Node.js Event Loop Internals", description: "Study libuv and non-blocking I/O", durationMinutes: 240 },
                { id: "t-2-2", title: "Database Design & Normalization", description: "Design schema for an e-commerce platform", durationMinutes: 360 },
                { id: "t-2-3", title: "Redis Caching Strategies", description: "Implement caching for high-read endpoints", durationMinutes: 180 },
            ]
        },
        {
            id: "m-3",
            title: "DevOps & System Design",
            kpi: "Pass a mock System Design Interview",
            estimatedHours: 200,
            tasks: [
                { id: "t-3-1", title: "Docker & Kubernetes Basics", description: "Containerize the full stack app", durationMinutes: 480 },
                { id: "t-3-2", title: "CI/CD Pipeline Setup", description: "Automate testing and deployment with GitHub Actions", durationMinutes: 300 },
                { id: "t-3-3", title: "System Design Patterns", description: "Study Load Balancing, Sharding, and CAP Theorem", durationMinutes: 420 },
            ]
        }
    ]
};
