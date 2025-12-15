import React from "react";
import DailyQuoteDisplay from "@/components/DailyQuoteDisplay";
import CharacterMomentLogger from "@/components/CharacterMomentLogger";
import LoggedMomentsDisplay from "@/components/dashboard/LoggedMomentsDisplay";

const EngagementPage: React.FC = () => {
  const [refreshTrigger, setRefreshTrigger] = React.useState(0);

  const handleMomentLogged = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-center text-primary">Daily Engagement</h1>
      <p className="text-lg text-muted-foreground text-center">
        Cultivate self-awareness and track your character growth every day.
      </p>
      <DailyQuoteDisplay />
      <CharacterMomentLogger onMomentLogged={handleMomentLogged} />
      <div className="pt-8">
        <LoggedMomentsDisplay refreshTrigger={refreshTrigger} />
      </div>
    </div>
  );
};

export default EngagementPage;