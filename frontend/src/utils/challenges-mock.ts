import { UserGoals, RIGHT_VIRTUES } from "./virtues";

export type Challenge = {
  id: string;
  title: string;
  description: string;
  virtueId: string;
  status: "pending" | "completed";
};

export const generateMockChallenges = (userGoals: UserGoals | null): Challenge[] => {
  if (!userGoals || userGoals.priorityVirtues.length === 0) {
    return [];
  }

  const challenges: Challenge[] = [];
  const selectedVirtues = userGoals.priorityVirtues;

  selectedVirtues.forEach((virtueId, index) => {
    const virtue = RIGHT_VIRTUES.find(v => v.id === virtueId);
    if (virtue) {
      // Generate a few challenges per selected virtue
      if (virtue.id === "courage") {
        challenges.push({
          id: `challenge-${virtue.id}-1`,
          title: `Speak Up with ${virtue.name}`,
          description: "In your next team meeting, identify one point where you can respectfully challenge an idea or offer a new perspective, even if it feels uncomfortable.",
          virtueId: virtue.id,
          status: "pending",
        });
        challenges.push({
          id: `challenge-${virtue.id}-2`,
          title: `Embrace a New Task`,
          description: "Volunteer for a task or project that is outside your comfort zone and requires you to learn something new.",
          virtueId: virtue.id,
          status: "pending",
        });
      } else if (virtue.id === "empathy") {
        challenges.push({
          id: `challenge-${virtue.id}-1`,
          title: `Active Listening Exercise`,
          description: "In your next one-on-one conversation, practice active listening by focusing entirely on the other person without interrupting or formulating your response. Summarize their points back to them.",
          virtueId: virtue.id,
          status: "pending",
        });
        challenges.push({
          id: `challenge-${virtue.id}-2`,
          title: `Understand a Different Perspective`,
          description: "Seek out a colleague with a different viewpoint on a current project and ask open-ended questions to truly understand their rationale.",
          virtueId: virtue.id,
          status: "pending",
        });
      } else if (virtue.id === "humility") {
        challenges.push({
          id: `challenge-${virtue.id}-1`,
          title: `Ask for Feedback`,
          description: "Proactively ask a peer or manager for constructive feedback on a recent piece of your work, and listen openly to their suggestions.",
          virtueId: virtue.id,
          status: "pending",
        });
        challenges.push({
          id: `challenge-${virtue.id}-2`,
          title: `Acknowledge Others' Contributions`,
          description: "Publicly acknowledge a colleague's contribution or idea that helped improve your work or a team project.",
          virtueId: virtue.id,
          status: "pending",
        });
      } else {
        // Generic challenge for other virtues
        challenges.push({
          id: `challenge-${virtue.id}-1`,
          title: `Apply ${virtue.name} in a Daily Task`,
          description: `Identify one routine task today and consciously think about how you can apply ${virtue.name} while performing it.`,
          virtueId: virtue.id,
          status: "pending",
        });
      }
    }
  });

  return challenges;
};