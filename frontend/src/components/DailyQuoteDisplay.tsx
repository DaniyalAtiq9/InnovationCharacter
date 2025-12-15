import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getRandomQuote, DailyQuote } from "@/utils/quotes";

const DailyQuoteDisplay: React.FC = () => {
  const [quote, setQuote] = React.useState<DailyQuote | null>(null);

  React.useEffect(() => {
    // For a real app, you might fetch a new quote daily or based on user's target virtues
    setQuote(getRandomQuote());
  }, []);

  if (!quote) {
    return null;
  }

  return (
    <Card className="w-full shadow-lg border-l-4 border-primary">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-primary">Daily Philosophical Reflection</CardTitle>
        <CardDescription className="text-muted-foreground">A thought to guide your character development today.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <blockquote className="text-xl italic font-serif text-gray-800 dark:text-gray-200">
          "{quote.quote}"
          <footer className="text-sm mt-3 not-italic text-gray-500 dark:text-gray-400 font-sans">— {quote.author}</footer>
        </blockquote>
        <p className="font-medium text-lg text-blue-600 dark:text-blue-400">{quote.reflectionPrompt}</p>
      </CardContent>
    </Card>
  );
};

export default DailyQuoteDisplay;