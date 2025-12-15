import { UserGoals, CharacterMoment, RIGHT_VIRTUES } from "./virtues";

export type CalendarInsight = {
  id: string;
  type: "support" | "hinder" | "opportunity";
  message: string;
  virtueId?: string;
};

export const generateMockCalendarInsights = (
  userGoals: UserGoals | null,
  characterMoments: CharacterMoment[]
): CalendarInsight[] => {
  const insights: CalendarInsight[] = [];

  // Mock insights based on user goals
  if (userGoals && userGoals.priorityVirtues.length > 0) {
    const primaryVirtue = RIGHT_VIRTUES.find(v => v.id === userGoals.priorityVirtues[0]);
    if (primaryVirtue) {
      insights.push({
        id: "ci-1",
        type: "opportunity",
        message: `You had an opportunity this week to practice ${primaryVirtue.name} during a team discussion. Consider how you might have voiced your thoughts more assertively.`,
        virtueId: primaryVirtue.id,
      });
    }
    if (userGoals.priorityVirtues.length > 1) {
      const secondaryVirtue = RIGHT_VIRTUES.find(v => v.id === userGoals.priorityVirtues[1]);
      if (secondaryVirtue) {
        insights.push({
          id: "ci-2",
          type: "hinder",
          message: `Your calendar shows a high number of back-to-back meetings, which might hinder your ability to reflect and apply ${secondaryVirtue.name}. Try scheduling short breaks.`,
          virtueId: secondaryVirtue.id,
        });
      }
    }
  }

  // Mock insights based on character moments
  if (characterMoments.length > 0) {
    const recentMoment = characterMoments[characterMoments.length - 1];
    const virtueName = RIGHT_VIRTUES.find(v => v.id === recentMoment.virtueId)?.name || recentMoment.virtueId;
    insights.push({
      id: "ci-3",
      type: "support",
      message: `Your recent log about "${recentMoment.moment.substring(0, 30)}..." shows a strong application of ${virtueName}. Keep up the great work!`,
      virtueId: recentMoment.virtueId,
    });
  } else {
    insights.push({
      id: "ci-4",
      type: "opportunity",
      message: "No character moments logged this week. Remember to capture your experiences to track your growth!",
    });
  }

  // Generic insights
  insights.push({
    id: "ci-5",
    type: "opportunity",
    message: "Consider dedicating 15 minutes each morning to planning how you'll embody a target virtue today.",
  });
  insights.push({
    id: "ci-6",
    type: "support",
    message: "You consistently allocated time for deep work this week, which supports focused application of wisdom and curiosity.",
  });

  return insights;
};