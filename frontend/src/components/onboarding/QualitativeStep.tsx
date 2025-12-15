import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface QualitativeStepProps {
  onNext: (data: { scenarioResponses: Record<string, string>; selfReflection: string }) => void;
  onBack: () => void;
  initialData: { scenarioResponses: Record<string, string>; selfReflection: string };
}

const scenarios = [
  { id: "s1", text: "Describe a time you had to challenge an established idea or process at work. What virtue(s) did you draw upon?" },
  { id: "s2", text: "Share an experience where you failed or made a significant mistake. How did you respond, and what did you learn about your character?" },
  { id: "s3", text: "Think of a situation where you had to understand a colleague's perspective that was very different from your own. How did you approach it?" },
];

const QualitativeStep: React.FC<QualitativeStepProps> = ({ onNext, onBack, initialData }) => {
  const [scenarioResponses, setScenarioResponses] = React.useState<Record<string, string>>(initialData.scenarioResponses);
  const [selfReflection, setSelfReflection] = React.useState<string>(initialData.selfReflection);

  const handleScenarioChange = (id: string, value: string) => {
    setScenarioResponses((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = () => {
    // Basic validation
    if (Object.values(scenarioResponses).some(res => res.trim() === "") || selfReflection.trim() === "") {
      alert("Please provide responses for all scenarios and the self-reflection.");
      return;
    }
    onNext({ scenarioResponses, selfReflection });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Qualitative Assessment & Self-Reflection</CardTitle>
        <CardDescription>Reflect on the following scenarios and prompts.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {scenarios.map((scenario) => (
            <div key={scenario.id} className="space-y-2">
              <Label htmlFor={scenario.id}>{scenario.text}</Label>
              <Textarea
                id={scenario.id}
                value={scenarioResponses[scenario.id] || ""}
                onChange={(e) => handleScenarioChange(scenario.id, e.target.value)}
                rows={4}
                placeholder="Your response..."
              />
            </div>
          ))}
          <div className="space-y-2">
            <Label htmlFor="self-reflection">In your own words, describe what character means to you in the context of innovation and your professional life.</Label>
            <Textarea
              id="self-reflection"
              value={selfReflection}
              onChange={(e) => setSelfReflection(e.target.value)}
              rows={6}
              placeholder="Your self-reflection..."
            />
          </div>
        </div>
        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={onBack}>Back</Button>
          <Button onClick={handleSubmit}>Next</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QualitativeStep;