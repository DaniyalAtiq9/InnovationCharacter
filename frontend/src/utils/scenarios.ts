import { Virtue } from "./virtues";

export type ScenarioOption = {
  id: string;
  text: string;
  virtueId: Virtue["id"];
  feedback: string;
};

export type Scenario = {
  id: string;
  title: string;
  description: string;
  options: ScenarioOption[];
};

export const MOCK_SCENARIOS: Scenario[] = [
  {
    id: "s1",
    title: "The Challenging Project Deadline",
    description: "Your team is facing an aggressive deadline for a critical project. A key team member, Alex, seems overwhelmed and is falling behind, but hasn't asked for help. You notice the quality of their work is starting to slip, which could jeopardize the entire project.",
    options: [
      {
        id: "s1o1",
        text: "Privately approach Alex, express concern, and offer support or to help re-prioritize tasks.",
        virtueId: "empathy",
        feedback: "Excellent! Approaching Alex privately shows empathy and a willingness to support your team member, fostering a collaborative environment. This also demonstrates courage to address a difficult situation constructively.",
      },
      {
        id: "s1o2",
        text: "Report Alex's performance issues to the project manager immediately to ensure the deadline is met.",
        virtueId: "integrity", // Could be seen as integrity to the project, but lacks empathy
        feedback: "While ensuring project success is important, immediately escalating without first speaking to Alex might damage trust and morale. Consider a more empathetic approach first.",
      },
      {
        id: "s1o3",
        text: "Take on some of Alex's tasks yourself without telling anyone, hoping to cover the gaps.",
        virtueId: "teamwork", // Good intention, but not ideal
        feedback: "Taking on tasks is a sign of teamwork, but doing so without communication can lead to burnout for you and prevent Alex from addressing their challenges. Open communication is key.",
      },
    ],
  },
  {
    id: "s2",
    title: "The Innovative but Risky Idea",
    description: "During a brainstorming session, you propose a highly innovative idea that could revolutionize your product, but it also carries significant risks and requires a substantial investment. Your colleagues are hesitant, preferring a safer, incremental approach.",
    options: [
      {
        id: "s2o1",
        text: "Present a detailed, data-backed case for your idea, acknowledging risks but emphasizing potential rewards.",
        virtueId: "courage",
        feedback: "Great! Standing firm on a bold idea with a well-reasoned argument demonstrates courage and conviction. It also shows wisdom in preparing a thorough case.",
      },
      {
        id: "s2o2",
        text: "Defer to the team's preference for a safer approach, saving your idea for another time.",
        virtueId: "adaptability", // Could be seen as adaptability, but also lack of courage
        feedback: "While adaptability is valuable, consistently deferring innovative ideas can stifle progress. Sometimes, courage is needed to champion new directions.",
      },
      {
        id: "s2o3",
        text: "Suggest a small-scale pilot project to test a component of your idea with minimal risk.",
        virtueId: "wisdom",
        feedback: "Excellent! This approach demonstrates wisdom by seeking a pragmatic way to test innovation while mitigating risk, showing both courage and adaptability.",
      },
    ],
  },
  {
    id: "s3",
    title: "Receiving Critical Feedback",
    description: "Your manager gives you constructive criticism on a recent presentation, pointing out areas where your communication could be clearer and more engaging. You initially feel defensive, as you put a lot of effort into it.",
    options: [
      {
        id: "s3o1",
        text: "Thank your manager for the feedback, ask clarifying questions, and commit to applying it in your next presentation.",
        virtueId: "humility",
        feedback: "Fantastic! Responding with humility and a growth mindset allows you to learn and improve. Asking clarifying questions also shows curiosity and a desire for wisdom.",
      },
      {
        id: "s3o2",
        text: "Politely explain your rationale for the choices you made in the presentation, defending your approach.",
        virtueId: "integrity", // Standing by your work, but potentially missing the learning opportunity
        feedback: "It's good to stand by your work, but being overly defensive can prevent you from receiving valuable insights. Humility is key to growth.",
      },
      {
        id: "s3o3",
        text: "Nod along, but internally dismiss the feedback, believing your presentation was fine.",
        virtueId: "growth_mindset", // Lack of growth mindset
        feedback: "Dismissing feedback hinders your growth. A growth mindset encourages you to see criticism as an opportunity for development.",
      },
    ],
  },
];