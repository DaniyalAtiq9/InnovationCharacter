import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { getAllVirtues, Virtue, UserGoals } from "@/utils/virtues"; // Use getAllVirtues
import { useToast } from "@/hooks/use-toast";
import { API_BASE_URL } from "@/services/api";

interface GoalSettingStepProps {
  onNext: (data: UserGoals) => void;
  onBack: () => void;
  initialData: UserGoals;
  assessmentResults: { virtueScores: { virtueId: string; score: number }[] }; // To help guide selection
}

const GoalSettingStep: React.FC<GoalSettingStepProps> = ({ onNext, onBack, initialData, assessmentResults }) => {
  const [selectedVirtues, setSelectedVirtues] = React.useState<string[]>(initialData.priorityVirtues);
  const [innovationGoals, setInnovationGoals] = React.useState<string>(initialData.innovationGoals);
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const allVirtues = getAllVirtues(); // Get all virtues, including custom ones

  const handleVirtueToggle = (virtueId: string) => {
    setSelectedVirtues((prev) => {
      if (prev.includes(virtueId)) {
        return prev.filter((id) => id !== virtueId);
      } else {
        if (prev.length < 3) { // Limit to 3 priority virtues
          return [...prev, virtueId];
        } else {
          alert("You can select a maximum of 3 priority virtues.");
          return prev;
        }
      }
    });
  };

  const handleSubmit = async () => {
    if (selectedVirtues.length === 0 || innovationGoals.trim() === "") {
      toast({
        title: "Incomplete Goals",
        description: "Please select at least one priority virtue and describe your innovation goals.",
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

      const payload = {
        priority_virtues: selectedVirtues,
        innovation_goal: innovationGoals,
      };

      const response = await fetch(`${API_BASE_URL}/goals`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to submit goals");
      }

      // Mocking behavioral commitments and coaching plan for now as backend doesn't return them yet
      const behavioralCommitments = selectedVirtues.map(
        (virtueId) => `Commit to practicing ${allVirtues.find(v => v.id === virtueId)?.name || virtueId} daily.`
      );
      const firstWeekCoachingPlan = selectedVirtues.map(
        (virtueId) => `Focus on identifying opportunities to apply ${allVirtues.find(v => v.id === virtueId)?.name || virtueId} in your work this week.`
      );

      toast({
        title: "Goals Saved",
        description: "Your goals have been recorded successfully.",
      });

      onNext({
        priorityVirtues: selectedVirtues,
        innovationGoals,
        behavioralCommitments,
        firstWeekCoachingPlan,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Submission Failed",
        description: "There was an error saving your goals. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Sort virtues by score (lowest first) to suggest growth areas,
  // placing custom virtues at the end or with a default score if not in assessmentResults
  const sortedVirtues = [...allVirtues].sort((a, b) => {
    const scoreA = assessmentResults.virtueScores.find(vs => vs.virtueId === a.id)?.score || (a.isCustom ? -1 : 0); // Custom virtues default to -1 for sorting
    const scoreB = assessmentResults.virtueScores.find(vs => vs.virtueId === b.id)?.score || (b.isCustom ? -1 : 0);
    return scoreA - scoreB;
  });

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Personal Character Goal Setting</CardTitle>
        <CardDescription>Select 2-3 priority virtues to develop and connect them to your innovation goals.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <Label className="text-base">Select Priority Virtues (up to 3):</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {sortedVirtues.map((virtue) => (
                <div key={virtue.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={virtue.id}
                    checked={selectedVirtues.includes(virtue.id)}
                    onCheckedChange={() => handleVirtueToggle(virtue.id)}
                  />
                  <Label htmlFor={virtue.id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {virtue.name}
                    <p className="text-muted-foreground text-xs">{virtue.description}</p>
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="innovation-goals">How do you connect these virtues to your innovation goals?</Label>
            <Textarea
              id="innovation-goals"
              value={innovationGoals}
              onChange={(e) => setInnovationGoals(e.target.value)}
              rows={5}
              placeholder="Describe your innovation goals and how developing these virtues will help you achieve them."
            />
          </div>
        </div>
        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={onBack}>Back</Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Completing..." : "Complete Onboarding"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default GoalSettingStep;