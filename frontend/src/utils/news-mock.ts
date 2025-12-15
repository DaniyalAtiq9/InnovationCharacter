export type NewsArticle = {
  id: string;
  title: string;
  description: string;
  url: string;
  virtues: string[]; // IDs of virtues demonstrated
  imageUrl?: string;
};

export const MOCK_NEWS_ARTICLES: NewsArticle[] = [
  {
    id: "n1",
    title: "Local Hero Shows Resilience in Community Rebuilding Effort",
    description: "After a devastating storm, Sarah led her community in a remarkable rebuilding effort, demonstrating incredible resilience and teamwork.",
    url: "https://example.com/news/resilience-hero",
    virtues: ["resilience", "teamwork"],
    imageUrl: "https://via.placeholder.com/150/FF5733/FFFFFF?text=Resilience",
  },
  {
    id: "n2",
    title: "CEO's Humility Leads to Breakthrough Innovation",
    description: "John, the CEO of a tech startup, openly admitted a product failure and pivoted the company, showcasing profound humility and a growth mindset.",
    url: "https://example.com/news/humility-ceo",
    virtues: ["humility", "growth_mindset"],
    imageUrl: "https://via.placeholder.com/150/33FF57/FFFFFF?text=Humility",
  },
  {
    id: "n3",
    title: "Scientist's Curiosity Unlocks New Medical Discovery",
    description: "Dr. Anya Sharma's relentless curiosity and wisdom in research led to a groundbreaking discovery in disease treatment.",
    url: "https://example.com/news/curiosity-discovery",
    virtues: ["curiosity", "wisdom"],
    imageUrl: "https://via.placeholder.com/150/3357FF/FFFFFF?text=Curiosity",
  },
  {
    id: "n4",
    title: "Activist's Courage Sparks Social Change",
    description: "Maria stood up against injustice, demonstrating immense courage and integrity in her fight for social equality.",
    url: "https://example.com/news/courage-activist",
    virtues: ["courage", "integrity"],
    imageUrl: "https://via.placeholder.com/150/FF33F0/FFFFFF?text=Courage",
  },
  {
    id: "n5",
    title: "Team's Empathy Transforms Customer Experience",
    description: "A customer service team, driven by empathy, redesigned their support process, leading to unprecedented customer satisfaction.",
    url: "https://example.com/news/empathy-team",
    virtues: ["empathy", "teamwork"],
    imageUrl: "https://via.placeholder.com/150/F0FF33/FFFFFF?text=Empathy",
  },
  {
    id: "n6",
    title: "Startup Founder's Adaptability Navigates Market Volatility",
    description: "Facing unexpected market shifts, entrepreneur David quickly adapted his business model, showcasing remarkable adaptability and resilience.",
    url: "https://example.com/news/adaptability-founder",
    virtues: ["adaptability", "resilience"],
    imageUrl: "https://via.placeholder.com/150/33FFF0/FFFFFF?text=Adaptability",
  },
];