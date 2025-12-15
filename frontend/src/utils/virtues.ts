export type Virtue = {
  id: string;
  name: string;
  description: string;
  isCustom?: boolean; // Added to distinguish custom virtues
};

export type UserVirtue = {
  id: string;
  name: string;
  description: string;
  isCustom: true;
};

export const RIGHT_VIRTUES: Virtue[] = [
  { id: "resilience", name: "Resilience", description: "The capacity to recover quickly from difficulties." },
  { id: "integrity", name: "Integrity", description: "The quality of being honest and having strong moral principles." },
  { id: "growth_mindset", name: "Growth Mindset", description: "A belief that abilities can be developed through dedication and hard work." },
  { id: "humility", name: "Humility", description: "A modest or low view of one's own importance." },
  { id: "teamwork", name: "Teamwork", description: "The collaborative effort of a group to achieve a common goal." },
  { id: "courage", name: "Courage", description: "The ability to do something that frightens one." },
  { id: "empathy", name: "Empathy", description: "The ability to understand and share the feelings of another." },
  { id: "wisdom", name: "Wisdom", description: "The quality of having experience, knowledge, and good judgment." },
  { id: "curiosity", name: "Curiosity", description: "A strong desire to know or learn something." },
  { id: "adaptability", name: "Adaptability", description: "The quality of being able to adjust to new conditions." },
];

export const USER_VIRTUES_KEY = "userVirtues";

export const loadUserVirtues = (): UserVirtue[] => {
  if (typeof window === "undefined") return []; // Ensure this runs only in browser
  const savedVirtues = localStorage.getItem(USER_VIRTUES_KEY);
  return savedVirtues ? JSON.parse(savedVirtues) : [];
};

export const saveUserVirtues = (virtues: UserVirtue[]) => {
  if (typeof window === "undefined") return; // Ensure this runs only in browser
  localStorage.setItem(USER_VIRTUES_KEY, JSON.stringify(virtues));
};

export const getAllVirtues = (): Virtue[] => {
  const userVirtues = loadUserVirtues();
  return [...RIGHT_VIRTUES, ...userVirtues];
};

export type VirtueScore = {
  virtueId: string;
  score: number; // 0-100
};

export type AssessmentResult = {
  virtueScores: VirtueScore[];
  narrativeProfile: string;
  riskPatterns: string[];
  innovationBlindSpots: string[];
  behavioralCommitments: string[];
  firstWeekCoachingPlan: string[];
};

export type UserGoals = {
  priorityVirtues: string[]; // IDs of selected virtues
  innovationGoals: string;
  behavioralCommitments: string[];
  firstWeekCoachingPlan: string[];
};

export type CharacterMoment = {
  id: string;
  timestamp: string;
  moment: string;
  virtueId: string;
  feedback: string;
};