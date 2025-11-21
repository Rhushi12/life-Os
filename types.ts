
export interface Task {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
}

export interface Milestone {
  id: string;
  title: string;
  kpi: string;
  estimatedHours: number;
  tasks: Task[];
}

export interface Plan {
  goalTitle: string;
  totalEstimatedHours: number;
  feasibilityScore: number;
  realismAssessment: string;
  milestones: Milestone[];
}

export type AgentName = 'Interviewer' | 'Deep Research Agent' | 'Researcher Agent' | 'Strategist Agent' | 'Referee Agent' | 'Planner Agent';

export interface AgentStatus {
  name: AgentName;
  status: 'pending' | 'running' | 'complete' | 'error';
  message: string;
  result?: any; // Stores the "Blackboard" data for this agent
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface ResearchContext {
  goal: string;
  constraints: string[];
  preferences: string[];
  experienceLevel?: string;
  budget?: string;
  timeline?: string;
  userTier?: 'Free' | 'Pro';
  userProfile?: UserProfile;
}

// Blackboard Data Structures
export interface ResearchResult {
  keySuccessFactors: string[];
  potentialRisks: string[];
  recommendedResources: string[];
  marketAnalysis: string;
  report?: string;
  initialStrategy?: any;
}

export interface StrategyResult {
  milestones: Milestone[];
  strategyRationale: string;
}

export interface RefereeResult {
  feasibilityScore: number;
  assessment: string;
  approved: boolean;
}

export type View = 'landing' | 'auth' | 'pricing' | 'dashboard' | 'goal-intake' | 'goal-detail' | 'feedback' | 'strategy' | 'planner' | 'settings';

export interface UserProfile {
  uid: string;
  displayName: string;
  age: string;
  occupation: string;
  email: string;
  onboardingCompleted: boolean;
}
