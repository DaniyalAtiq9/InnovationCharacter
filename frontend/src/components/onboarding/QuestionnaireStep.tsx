import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { RIGHT_VIRTUES, Virtue, AssessmentResult } from "@/utils/virtues";
import { useToast } from "@/hooks/use-toast";
import { API_BASE_URL } from "@/services/api";

interface QuestionnaireStepProps {
  onNext: (data: AssessmentResult) => void;
  onBack: () => void;
  initialData: Record<string, number>;
}

const statements = [
  { id: "q1", text: "I bounce back quickly from setbacks.", virtueId: "resilience" },
  { id: "q2", text: "I always act in accordance with my values, even when it's difficult.", virtueId: "integrity" },
  { id: "q3", text: "I believe my intelligence and talents can be developed.", virtueId: "growth_mindset" },
  { id: "q4", text: "I am open to admitting my mistakes and learning from them.", virtueId: "humility" },
  { id: "q5", text: "I enjoy collaborating with others to achieve shared goals.", virtueId: "teamwork" },
  { id: "q6", text: "I am willing to take risks and face challenges head-on.", virtueId: "courage" },
  { id: "q7", text: "I try to understand others' feelings and perspectives.", virtueId: "empathy" },
  { id: "q8", text: "I seek out knowledge and apply it to make sound decisions.", virtueId: "wisdom" },
  { id: "q9", text: "I am eager to explore new ideas and concepts.", virtueId: "curiosity" },
  { id: "q10", text: "I adjust well to changes in plans or circumstances.", virtueId: "adaptability" },
];

const QuestionnaireStep: React.FC<QuestionnaireStepProps> = ({ onNext, onBack, initialData }) => {
  const [answers, setAnswers] = React.useState<Record<string, number>>(initialData);
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: parseInt(value) }));
  };

  const handleSubmit = async () => {
    // Basic validation: ensure all questions are answered
    if (Object.keys(answers).length !== statements.length) {
      toast({
        title: "Incomplete Assessment",
        description: "Please answer all questions before proceeding.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast({
          title: "Authentication Error",
          description: "You must be logged in to submit.",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch(`${API_BASE_URL}/assessment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ answers }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit assessment");
      }

      const data = await response.json();

      const assessmentResult: AssessmentResult = {
        virtueScores: data.scores,
        narrativeProfile: data.narrative_profile,
        // Fill defaults for now as backend doesn't generate these yet
        riskPatterns: [],
        innovationBlindSpots: [],
        behavioralCommitments: [],
        firstWeekCoachingPlan: [],
      };

      toast({
        title: "Assessment Saved",
        description: "Your responses have been recorded.",
      });

      onNext(assessmentResult);
    } catch (error) {
      console.error(error);
      toast({
        title: "Submission Failed",
        description: "There was an error saving your assessment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Quantitative Assessment</CardTitle>
        <CardDescription>Rate how much you agree with the following statements (1: Strongly Disagree, 5: Strongly Agree).</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {statements.map((statement) => (
            <div key={statement.id} className="border-b pb-4 last:border-b-0">
              <p className="font-medium mb-2">{statement.text}</p>
              <RadioGroup
                onValueChange={(value) => handleChange(statement.id, value)}
                value={answers[statement.id]?.toString() || ""}
                className="flex flex-wrap gap-4"
              >
                {[1, 2, 3, 4, 5].map((score) => (
                  <div key={score} className="flex items-center space-x-2">
                    <RadioGroupItem value={score.toString()} id={`${statement.id}-${score}`} />
                    <Label htmlFor={`${statement.id}-${score}`}>{score}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={onBack}>Back</Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Next"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionnaireStep;