import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import WeeklyChallenges from "@/components/dashboard/WeeklyChallenges";

const ChallengesPage: React.FC = () => {
  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-center text-primary">Your Character Challenges</h1>
      <p className="text-lg text-muted-foreground text-center">
        Engage in actionable exercises to actively practice your target virtues and foster growth.
      </p>
      
      <div className="mt-8">
        <WeeklyChallenges />
      </div>
    </div>
  );
};

export default ChallengesPage;