import { VirtueScore } from "@/utils/virtues";

// Define Types based on Backend Models
export interface DashboardStats {
  currentScores: VirtueScore[];
  history: Array<{
    date: string;
    [key: string]: string | number; // virtueId: score
  }>;
}

export interface CalendarInsight {
  id: string;
  type: string;
  message: string;
  virtueId?: string | null;
}

export interface WeeklyReflection {
  summary: string;
  insights: CalendarInsight[];
  focus: string[];
}

export interface GoalResponse {
  _id?: string;
  user_id?: string;
  priority_virtues: string[];
  innovation_goal: string;
}

export interface AssessmentResponse {
  _id?: string;
  user_id?: string;
  scores: VirtueScore[];
  narrative_profile: string;
}

export interface Challenge {
  _id: string;
  user_id: string;
  title: string;
  description: string;
  virtueId: string;
  status: "pending" | "completed";
  week_start: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  url: string;
  virtues: string[];
  imageUrl?: string;
}

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    if (response.status === 401) {
      // Handle unauthorized (e.g., redirect to login)
      // For now, throw error so component can handle it
      throw new Error("Unauthorized");
    }
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "API request failed");
  }
  return response.json();
};

export const api = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await fetch(`${API_BASE_URL}/dashboard/stats`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getWeeklyReflection: async (): Promise<WeeklyReflection> => {
    const response = await fetch(`${API_BASE_URL}/reflection/weekly`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getAssessment: async (): Promise<AssessmentResponse> => {
    const response = await fetch(`${API_BASE_URL}/assessment`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getGoals: async (): Promise<GoalResponse> => {
    const response = await fetch(`${API_BASE_URL}/goals`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getChallenges: async (): Promise<Challenge[]> => {
    const response = await fetch(`${API_BASE_URL}/challenges`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  updateChallengeStatus: async (id: string, status: "pending" | "completed"): Promise<Challenge> => {
    const response = await fetch(`${API_BASE_URL}/challenges/${id}`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    return handleResponse(response);
  },

  getNewsArticles: async (query?: string): Promise<NewsArticle[]> => {
    const url = new URL(`${API_BASE_URL}/news`);
    if (query) {
      url.searchParams.append("q", query);
    }
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};