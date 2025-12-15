import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { VirtueScore, UserGoals, getAllVirtues } from "@/utils/virtues"; // Use getAllVirtues
import { HistoricalVirtueScore } from "@/utils/mock-history";

interface VirtueTrendChartProps {
  initialVirtueScores: VirtueScore[]; // This now includes predefined and custom (with 0 score)
  userGoals: UserGoals | null;
  history?: HistoricalVirtueScore[];
}

const VirtueTrendChart: React.FC<VirtueTrendChartProps> = ({ initialVirtueScores, userGoals, history }) => {
  // Use passed history if available
  const historicalData = history || [];
  const allVirtues = getAllVirtues();

  // Define a consistent color palette for virtues
  const virtueColors: Record<string, string> = {
    resilience: "#8884d8",
    integrity: "#82ca9d",
    growth_mindset: "#ffc658",
    humility: "#ff7300",
    teamwork: "#0088fe",
    courage: "#00c49f",
    empathy: "#ffbb28",
    wisdom: "#a4de6c",
    curiosity: "#d0ed57",
    adaptability: "#83a6ed",
  };

  // Function to get a consistent color, cycling if needed
  const getVirtueColor = (virtueId: string, index: number) => {
    if (virtueColors[virtueId]) {
      return virtueColors[virtueId];
    }
    // Fallback to a cycling color palette for custom virtues or new ones
    const fallbackColors = ["#FF6347", "#4682B4", "#DA70D6", "#3CB371", "#FFA07A", "#6A5ACD", "#F08080", "#20B2AA"];
    return fallbackColors[index % fallbackColors.length];
  };

  // Only show trends for priority virtues if selected, otherwise show all
  const virtuesToShow = userGoals?.priorityVirtues.length > 0
    ? allVirtues.filter(v => userGoals.priorityVirtues.includes(v.id))
    : allVirtues;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Your Character Growth Trend</CardTitle>
        <CardDescription>Simulated progress of your virtue scores over the last few weeks.</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={historicalData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Legend />
            {virtuesToShow.map((virtue, index) => (
              <Line
                key={virtue.id}
                type="monotone"
                dataKey={virtue.id}
                name={virtue.name}
                stroke={getVirtueColor(virtue.id, index)}
                activeDot={{ r: 8 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default VirtueTrendChart;