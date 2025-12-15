import React from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VirtueScore, getAllVirtues } from "@/utils/virtues"; // Use getAllVirtues

interface VirtueRadarChartProps {
  virtueScores: VirtueScore[]; // This now includes predefined and custom (with 0 score)
}

const VirtueRadarChart: React.FC<VirtueRadarChartProps> = ({ virtueScores }) => {
  const allVirtues = getAllVirtues();

  const chartData = allVirtues.map((virtue) => {
    const score = virtueScores.find((vs) => vs.virtueId === virtue.id)?.score || 0;
    return {
      virtue: virtue.name,
      score: score,
      fullMark: 100, // Max score for the radar chart
    };
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Your Virtue Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="virtue" />
            <PolarRadiusAxis angle={90} domain={[0, 100]} />
            <Radar name="Your Score" dataKey="score" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default VirtueRadarChart;