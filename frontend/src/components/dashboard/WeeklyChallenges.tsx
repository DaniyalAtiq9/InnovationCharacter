import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { api, Challenge } from "@/services/api";
import { getAllVirtues } from "@/utils/virtues";
import { Badge } from "@/components/ui/badge";

const WeeklyChallenges: React.FC = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      setLoading(true);
      const data = await api.getChallenges();
      setChallenges(data);
      setError(null);
    } catch (err: any) {
      console.error("Failed to fetch challenges:", err);
      setError("Failed to load challenges. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleChallengeToggle = async (challengeId: string, checked: boolean) => {
    // Optimistic update
    const previousChallenges = [...challenges];
    const newStatus = checked ? "completed" : "pending";
    
    setChallenges(prev => prev.map(c => 
      c._id === challengeId ? { ...c, status: newStatus } : c
    ));

    try {
      await api.updateChallengeStatus(challengeId, newStatus);
    } catch (err) {
      // Revert on failure
      console.error("Failed to update status", err);
      setChallenges(previousChallenges);
    }
  };

  if (loading) {
    return (
      <Card className="w-full shadow-lg">
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">Loading challenges...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
       <Card className="w-full shadow-lg border-red-200">
        <CardContent className="p-6">
          <p className="text-center text-red-500">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (challenges.length === 0) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-primary">Weekly Challenges</CardTitle>
          <CardDescription className="text-muted-foreground">No challenges available for this week.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Set your priority virtues in the assessment to get tailored challenges.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-primary">Weekly Challenges</CardTitle>
        <CardDescription className="text-muted-foreground">Actionable exercises to practice your target virtues.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {challenges.map((challenge) => {
          const virtue = getAllVirtues().find(v => v.id === challenge.virtueId);
          const isCompleted = challenge.status === "completed";
          
          return (
            <div key={challenge._id} className="flex items-start space-x-3 p-3 rounded-md bg-muted/30">
              <Checkbox
                id={`challenge-${challenge._id}`}
                checked={isCompleted}
                onCheckedChange={(checked) => handleChallengeToggle(challenge._id, checked as boolean)}
                className="mt-1"
              />
              <div className="grid gap-1.5 leading-none flex-1">
                <Label
                  htmlFor={`challenge-${challenge._id}`}
                  className={`text-base font-medium ${isCompleted ? "line-through text-muted-foreground" : "text-foreground"}`}
                >
                  {challenge.title}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {challenge.description}
                </p>
                {virtue && (
                  <Badge variant="secondary" className="w-fit mt-1">
                    {virtue.name}
                  </Badge>
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default WeeklyChallenges;