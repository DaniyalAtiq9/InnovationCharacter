import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { MOCK_SCENARIOS, Scenario, ScenarioOption } from "@/utils/scenarios";
import { RIGHT_VIRTUES, getAllVirtues } from "@/utils/virtues";
import { showSuccess, showError } from "@/utils/toast";

const ScenarioExercise: React.FC = () => {
  const [currentScenarioIndex, setCurrentScenarioIndex] = React.useState(0);
  const [selectedOptionId, setSelectedOptionId] = React.useState<string | null>(null);
  const [feedback, setFeedback] = React.useState<string | null>(null);
  const [showFeedback, setShowFeedback] = React.useState(false);

  const currentScenario = MOCK_SCENARIOS[currentScenarioIndex];
  const allVirtues = getAllVirtues();

  const handleOptionSelect = (value: string) => {
    setSelectedOptionId(value);
    setShowFeedback(false); // Hide previous feedback when a new option is selected
  };

  const handleSubmit = () => {
    if (!selectedOptionId) {
      showError("Please select an option before submitting.");
      return;
    }

    const chosenOption = currentScenario.options.find(opt => opt.id === selectedOptionId);
    if (chosenOption) {
      setFeedback(chosenOption.feedback);
      setShowFeedback(true);
      showSuccess("Feedback received!");
    }
  };

  const handleNextScenario = () => {
    if (currentScenarioIndex < MOCK_SCENARIOS.length - 1) {
      setCurrentScenarioIndex(prevIndex => prevIndex + 1);
      setSelectedOptionId(null);
      setFeedback(null);
      setShowFeedback(false);
    } else {
      showSuccess("You've completed all scenarios for now! More coming soon.");
      // Optionally, navigate back to dashboard or reset
      setCurrentScenarioIndex(0); // Loop back to start for demo
      setSelectedOptionId(null);
      setFeedback(null);
      setShowFeedback(false);
    }
  };

  if (!currentScenario) {
    return (
      <Card className="w-full max-w-2xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-primary">Interactive Exercises</CardTitle>
          <CardDescription className="text-muted-foreground">No scenarios available.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-primary">Scenario: {currentScenario.title}</CardTitle>
        <CardDescription className="text-muted-foreground">Reflect and choose the best course of action.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <p className="text-lg font-medium text-gray-800 dark:text-gray-200">{currentScenario.description}</p>

          <RadioGroup
            onValueChange={handleOptionSelect}
            value={selectedOptionId || ""}
            className="space-y-4"
          >
            {currentScenario.options.map((option) => (
              <div key={option.id} className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted transition-colors duration-200 cursor-pointer">
                <RadioGroupItem value={option.id} id={option.id} className="mt-1" />
                <Label htmlFor={option.id} className="flex-1 text-base cursor-pointer">
                  {option.text}
                  <span className="block text-xs text-muted-foreground mt-1">
                    (Related Virtue: {allVirtues.find(v => v.id === option.virtueId)?.name || option.virtueId})
                  </span>
                </Label>
              </div>
            ))}
          </RadioGroup>

          <div className="flex justify-between mt-6">
            <Button onClick={handleSubmit} disabled={!selectedOptionId || showFeedback} className="px-6 py-3 text-base">
              Get Feedback
            </Button>
            <Button onClick={handleNextScenario} variant="outline" className="px-6 py-3 text-base">
              {currentScenarioIndex < MOCK_SCENARIOS.length - 1 ? "Next Scenario" : "Restart Exercises"}
            </Button>
          </div>

          {showFeedback && feedback && (
            <div className="mt-6 p-4 bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-200 rounded-md border border-blue-200 dark:border-blue-800">
              <p className="font-semibold text-lg mb-2">AI Feedback:</p>
              <p className="text-base">{feedback}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ScenarioExercise;