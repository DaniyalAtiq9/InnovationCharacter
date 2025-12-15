import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllVirtues } from "@/utils/virtues";
import CalendarInsights from "@/components/dashboard/CalendarInsights";
import WeeklyChallenges from "@/components/dashboard/WeeklyChallenges";
import { api, WeeklyReflection } from "@/services/api";

const WeeklyReflectionPage: React.FC = () => {
  const [reflectionData, setReflectionData] = React.useState<WeeklyReflection | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const reflection = await api.getWeeklyReflection();
        setReflectionData(reflection);
      } catch (err: any) {
        console.error("Failed to fetch reflection:", err);
        setError(err.message || "Failed to load reflection");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (loading) {
    return <div className="p-8 text-center">Loading your weekly reflection...</div>;
  }

  if (error || !reflectionData) {
    return <div className="p-8 text-center text-red-500">{error || "Could not load reflection data."}</div>;
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-center text-primary">Weekly Character Reflection</h1>
      <p className="text-lg text-muted-foreground text-center">
        A personalized summary of your progress and a guide for the week ahead.
      </p>

      <Card className="shadow-lg border-l-4 border-blue-500">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-blue-700 dark:text-blue-300">Your Personalized Weekly Audio Clip (Text Summary)</CardTitle>
          <CardDescription className="text-muted-foreground">A reflection on your past week and focus for the coming one.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-lg leading-relaxed text-gray-800 dark:text-gray-200">{reflectionData.summary}</p>
          <p className="mt-4 text-sm text-muted-foreground italic">
            (In a full application, this would be a personalized audio clip.)
          </p>
        </CardContent>
      </Card>

      <CalendarInsights insights={reflectionData.insights} />

      <WeeklyChallenges />

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-primary">Focus for the Coming Week</CardTitle>
          <CardDescription className="text-muted-foreground">Specific virtues to practice and a small challenge.</CardDescription>
        </CardHeader>
        <CardContent>
          {reflectionData.focus && reflectionData.focus.length > 0 ? (
            <ul className="list-disc list-inside space-y-2 text-base text-gray-700 dark:text-gray-300">
              {reflectionData.focus.map((virtueId, index) => {
                const virtueName = getAllVirtues().find(v => v.id === virtueId)?.name || virtueId;
                return (
                  <li key={virtueId}>
                    <span className="font-semibold">Practice {virtueName}:</span> Identify one situation daily where you can intentionally apply {virtueName}.
                  </li>
                );
              })}
              <li><span className="font-semibold">Challenge:</span> Seek out a perspective different from your own in a work discussion and actively listen without interruption.</li>
            </ul>
          ) : (
            <p className="text-muted-foreground">Set your priority virtues in the assessment to get a tailored weekly focus.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WeeklyReflectionPage;