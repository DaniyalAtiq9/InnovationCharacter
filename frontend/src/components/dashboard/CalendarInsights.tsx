import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CalendarInsight } from "@/services/api";
import { Lightbulb, AlertTriangle, CheckCircle, Trophy, TrendingUp, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface CalendarInsightsProps {
  insights: CalendarInsight[];
}

const iconMap: Record<string, any> = {
  support: CheckCircle,
  hinder: AlertTriangle,
  opportunity: Lightbulb,
  pattern: TrendingUp,
  suggestion: Lightbulb,
  achievement: Trophy,
};

const colorMap: Record<string, string> = {
  support: "text-green-600 dark:text-green-400",
  hinder: "text-red-600 dark:text-red-400",
  opportunity: "text-blue-600 dark:text-blue-400",
  pattern: "text-purple-600 dark:text-purple-400",
  suggestion: "text-amber-600 dark:text-amber-400",
  achievement: "text-yellow-600 dark:text-yellow-400",
};

const CalendarInsights: React.FC<CalendarInsightsProps> = ({ insights }) => {
  if (!insights || insights.length === 0) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-primary">Calendar Insights</CardTitle>
          <CardDescription className="text-muted-foreground">No insights available for this week.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Log more character moments and set your goals to get personalized insights.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-primary">Calendar & Pattern Insights</CardTitle>
        <CardDescription className="text-muted-foreground">How your daily work patterns align with your character goals.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
      {insights.map((insight) => {
        const Icon = iconMap[insight.type] || Info;
        const colorClass = colorMap[insight.type] || "text-gray-600 dark:text-gray-400";
        return (
          <div key={insight.id} className="flex items-start space-x-3 p-3 rounded-md bg-muted/30">
            <Icon className={cn("h-5 w-5 flex-shrink-0 mt-1", colorClass)} />
            <p className="text-sm text-gray-700 dark:text-gray-300">{insight.message}</p>
          </div>
        );
      })}
    </CardContent>
    </Card>
  );
};

export default CalendarInsights;