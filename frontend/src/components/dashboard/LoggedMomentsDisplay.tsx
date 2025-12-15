import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CharacterMoment, getAllVirtues } from "@/utils/virtues";
import { API_BASE_URL } from "@/services/api";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

interface LoggedMomentsDisplayProps {
  refreshTrigger?: number;
}

const LoggedMomentsDisplay: React.FC<LoggedMomentsDisplayProps> = ({ refreshTrigger }) => {
  const [moments, setMoments] = React.useState<CharacterMoment[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchMoments = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          setIsLoading(false);
          return;
        }

        const response = await fetch(`${API_BASE_URL}/moments`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          // Map backend response to CharacterMoment type
          const mappedMoments: CharacterMoment[] = data.map((m: any) => ({
            id: m.id || m._id,
            timestamp: m.timestamp,
            moment: m.content,
            virtueId: m.virtue_id,
            feedback: m.feedback
          }));
          setMoments(mappedMoments);
        }
      } catch (error) {
        console.error("Failed to fetch moments", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMoments();
  }, [refreshTrigger]);

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Your Logged Character Moments</CardTitle>
          <CardDescription>A history of your character reflections and insights.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (moments.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Your Logged Character Moments</CardTitle>
          <CardDescription>No moments logged yet. Start logging your daily reflections!</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Your character moments will appear here once you've logged them from the Engagement page.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Your Logged Character Moments</CardTitle>
        <CardDescription>A history of your character reflections and insights.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {moments.map((moment) => {
          const allVirtues = getAllVirtues();
          const virtue = allVirtues.find((v) => v.id === moment.virtueId);
          const formattedDate = format(new Date(moment.timestamp), "MMM dd, yyyy HH:mm");
          return (
            <div key={moment.id} className="border-b pb-4 last:border-b-0">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="secondary">{virtue?.name || moment.virtueId}</Badge>
                <span className="text-xs text-muted-foreground">{formattedDate}</span>
              </div>
              <p className="text-sm text-gray-800 dark:text-gray-200">{moment.moment}</p>
              {moment.feedback && (
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">AI Feedback: {moment.feedback}</p>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default LoggedMomentsDisplay;