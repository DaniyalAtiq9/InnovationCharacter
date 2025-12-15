import { VirtueScore, UserGoals, RIGHT_VIRTUES, getAllVirtues } from "./virtues";
import { format, subWeeks } from "date-fns";

export type HistoricalVirtueScore = {
  date: string; // e.g., "2024-01-01"
  [virtueId: string]: number | string; // virtueId: score, plus the date string
};

export const generateMockHistoricalVirtueScores = (
  initialVirtueScores: VirtueScore[], // This now includes predefined and custom (with 0 score)
  userGoals: UserGoals | null,
  weeks: number = 5
): HistoricalVirtueScore[] => {
  const historicalData: HistoricalVirtueScore[] = [];
  const today = new Date();
  const allVirtues = getAllVirtues(); // Get all virtues, including custom ones

  for (let i = weeks - 1; i >= 0; i--) {
    const date = subWeeks(today, i);
    const formattedDate = format(date, "MMM dd");
    const weekData: HistoricalVirtueScore = { date: formattedDate };

    allVirtues.forEach((virtue) => {
      let score = initialVirtueScores.find(vs => vs.virtueId === virtue.id)?.score || 0;

      // Simulate slight fluctuations and potential growth, especially for priority virtues
      const isPriority = userGoals?.priorityVirtues.includes(virtue.id);
      const fluctuation = (Math.random() - 0.5) * 10; // -5 to +5
      let trend = 0;

      if (isPriority) {
        // Gradual increase for priority virtues over time, starting from their initial score (or 0 for custom)
        trend = (weeks - i) * 2;
      } else {
        // Smaller fluctuations for non-priority, or stay at 0 for non-priority custom virtues
        trend = (Math.random() - 0.5) * 5;
      }

      // Ensure custom virtues start at 0 and only increase if they are priority
      if (virtue.isCustom && !isPriority) {
        score = 0; // Custom non-priority virtues stay at 0
      } else if (virtue.isCustom && isPriority) {
        score = Math.max(0, Math.min(100, score + trend)); // Custom priority virtues start from 0 and grow
      } else {
        score = Math.max(0, Math.min(100, score + fluctuation + trend)); // Predefined virtues
      }
      
      weekData[virtue.id] = Math.round(score);
    });
    historicalData.push(weekData);
  }

  return historicalData;
};