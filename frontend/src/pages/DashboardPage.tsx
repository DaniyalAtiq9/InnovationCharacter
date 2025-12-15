import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import VirtueRadarChart from "@/components/dashboard/VirtueRadarChart";
import VirtueTrendChart from "@/components/dashboard/VirtueTrendChart";
import LoggedMomentsDisplay from "@/components/dashboard/LoggedMomentsDisplay";
import { getAllVirtues, VirtueScore } from "@/utils/virtues";
import { api, DashboardStats, AssessmentResponse, GoalResponse } from "@/services/api";

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [dashboardStats, setDashboardStats] = React.useState<DashboardStats | null>(null);
  const [assessmentData, setAssessmentData] = React.useState<AssessmentResponse | null>(null);
  const [userGoals, setUserGoals] = React.useState<GoalResponse | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [stats, assessment, goals] = await Promise.all([
          api.getDashboardStats(),
          api.getAssessment(),
          api.getGoals()
        ]);
        
        setDashboardStats(stats);
        setAssessmentData(assessment);
        setUserGoals(goals);
      } catch (err: any) {
        console.error("Failed to fetch dashboard data:", err);
        setError(err.message || "Failed to load dashboard data");
        // If unauthorized or not found, might need to redirect, but for now just show error
        if (err.message === "Unauthorized") {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle>Loading Dashboard...</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Fetching your latest insights...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !assessmentData || !userGoals || !dashboardStats) {
     // If we have a specific error, show it. If data is missing (maybe 404), likely means onboarding not done.
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle>Dashboard Unavailable</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              {error || "Please complete the onboarding assessment to view your dashboard."}
            </p>
            <Button onClick={() => navigate("/assessment")} className="mt-4">Go to Assessment</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const priorityVirtueNames = userGoals.priority_virtues.map(
    (id) => getAllVirtues().find((v) => v.id === id)?.name || id
  ).join(", ");
  
  // Transform API scores to ensure all virtues are represented (default to 0 if missing)
  const allVirtues = getAllVirtues();
  const allVirtueScores: VirtueScore[] = allVirtues.map(virtue => {
    const existingScore = dashboardStats.currentScores.find(vs => vs.virtueId === virtue.id);
    return {
      virtueId: virtue.id,
      score: existingScore ? existingScore.score : 0,
    };
  });

  // Mock data for missing backend fields to preserve UI
  const firstWeekCoachingPlan = [
    "Reflect on your top virtue daily.",
    "Identify one moment where you used a virtue.",
    "Set a small intention for tomorrow."
  ];
  const riskPatterns = ["Tendency to over-analyze", "Hesitation in rapid decision making"];
  const innovationBlindSpots = ["May overlook small details in favor of big picture"];

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-center text-primary">Your Innovation Character Dashboard</h1>
      <p className="text-lg text-muted-foreground text-center max-w-2xl mx-auto">
        A comprehensive overview of your character development journey, insights, and progress.
      </p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Priority Virtues</CardTitle>
            <CardDescription>Your chosen focus areas for character development.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{priorityVirtueNames || "No virtues selected yet."}</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Innovation Goals</CardTitle>
            <CardDescription>How character development supports your objectives.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-base text-gray-700 dark:text-gray-300">{userGoals.innovation_goal || "No goals set yet."}</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">First Week Coaching Plan</CardTitle>
            <CardDescription>Initial steps to kickstart your growth.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-base text-gray-700 dark:text-gray-300">
              {firstWeekCoachingPlan.map((plan, index) => (
                <li key={index}>{plan}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {allVirtueScores.length > 0 && (
        <div className="grid gap-6 lg:grid-cols-2">
          <VirtueRadarChart virtueScores={allVirtueScores} />
          <VirtueTrendChart
            initialVirtueScores={allVirtueScores}
            userGoals={{
               priorityVirtues: userGoals.priority_virtues,
               innovationGoals: userGoals.innovation_goal,
               behavioralCommitments: [],
               firstWeekCoachingPlan: []
            }}
            history={dashboardStats.history}
          />
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Narrative Virtue Profile</CardTitle>
            <CardDescription>A summary of your character assessment.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-base text-gray-700 dark:text-gray-300">{assessmentData.narrative_profile}</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Identified Risk Patterns & Blind Spots</CardTitle>
            <CardDescription>Areas to be mindful of in your innovation journey.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-base text-gray-700 dark:text-gray-300">
              {[...riskPatterns, ...innovationBlindSpots].map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <LoggedMomentsDisplay />
    </div>
  );
};

export default DashboardPage;