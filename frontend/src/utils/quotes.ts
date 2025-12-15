export type DailyQuote = {
  quote: string;
  author: string;
  reflectionPrompt: string;
};

export const PHILOSOPHICAL_QUOTES: DailyQuote[] = [
  {
    quote: "The only true wisdom is in knowing you know nothing.",
    author: "Socrates",
    reflectionPrompt: "How can embracing humility open new avenues for innovation in your work today?",
  },
  {
    quote: "It is not because things are difficult that we do not dare; it is because we do not dare that they are difficult.",
    author: "Seneca",
    reflectionPrompt: "What small act of courage can you practice today to overcome a perceived difficulty?",
  },
  {
    quote: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
    author: "Aristotle",
    reflectionPrompt: "Consider one virtue you want to cultivate. What daily habit can you start to embody it?",
  },
  {
    quote: "The unexamined life is not worth living.",
    author: "Plato",
    reflectionPrompt: "Take a moment to reflect on a recent decision. What character traits influenced your choice?",
  },
  {
    quote: "Happiness is not something ready-made. It comes from your own actions.",
    author: "Dalai Lama XIV",
    reflectionPrompt: "How can your actions today contribute to a more positive and innovative environment for yourself and others?",
  },
  {
    quote: "The mind is everything. What you think you become.",
    author: "Buddha",
    reflectionPrompt: "How can a growth mindset help you approach a challenging problem differently today?",
  },
  {
    quote: "Be the change that you wish to see in the world.",
    author: "Mahatma Gandhi",
    reflectionPrompt: "What change do you wish to see in your team or project? How can you embody that change through your character?",
  },
  {
    quote: "Knowing yourself is the beginning of all wisdom.",
    author: "Aristotle",
    reflectionPrompt: "What new insight about your character did you gain recently, and how can you apply it?",
  },
  {
    quote: "The greatest glory in living lies not in never falling, but in rising every time we fall.",
    author: "Nelson Mandela",
    reflectionPrompt: "Reflect on a recent setback. How can you demonstrate resilience in your next steps?",
  },
  {
    quote: "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.",
    author: "Ralph Waldo Emerson",
    reflectionPrompt: "How can you bring your authentic self and unique strengths to your work today, even if it challenges norms?",
  },
];

export const getRandomQuote = (): DailyQuote => {
  const randomIndex = Math.floor(Math.random() * PHILOSOPHICAL_QUOTES.length);
  return PHILOSOPHICAL_QUOTES[randomIndex];
};