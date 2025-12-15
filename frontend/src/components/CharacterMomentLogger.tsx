import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getAllVirtues, Virtue } from "@/utils/virtues"; // Use getAllVirtues
import { API_BASE_URL } from "@/services/api";
import { showSuccess, showError } from "@/utils/toast";

interface CharacterMomentLoggerProps {
  onMomentLogged?: () => void;
}

const CharacterMomentLogger: React.FC<CharacterMomentLoggerProps> = ({ onMomentLogged }) => {
  const [momentText, setMomentText] = React.useState<string>("");
  const [selectedVirtueId, setSelectedVirtueId] = React.useState<string>("");
  const [feedback, setFeedback] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const allVirtues = getAllVirtues(); // Get all virtues, including custom ones

  const handleSubmit = async () => {
    if (momentText.trim() === "" || selectedVirtueId === "") {
      showError("Please describe your moment and select a virtue.");
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        showError("You must be logged in to log a moment.");
        setIsSubmitting(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/moments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: momentText.trim(),
          virtue_id: selectedVirtueId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save moment");
      }

      const data = await response.json();

      setFeedback(data.feedback);
      showSuccess("Character moment logged successfully!");
      setMomentText("");
      setSelectedVirtueId("");
      
      if (onMomentLogged) {
        onMomentLogged();
      }

      // Clear feedback after a short delay
      setTimeout(() => setFeedback(null), 10000);
    } catch (error) {
      console.error("Error logging moment:", error);
      showError("Failed to log moment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-primary">Log a Character Moment</CardTitle>
        <CardDescription className="text-muted-foreground">Quickly capture successes, challenges, or insights related to your character.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="character-moment" className="text-base font-medium">What happened? (Voice or text)</Label>
          <Textarea
            id="character-moment"
            placeholder="Describe a situation where you demonstrated or needed to demonstrate a virtue..."
            value={momentText}
            onChange={(e) => setMomentText(e.target.value)}
            rows={5}
            className="min-h-[120px]"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="select-virtue" className="text-base font-medium">Which virtue was most relevant?</Label>
          <Select value={selectedVirtueId} onValueChange={setSelectedVirtueId}>
            <SelectTrigger id="select-virtue">
              <SelectValue placeholder="Select a virtue" />
            </SelectTrigger>
            <SelectContent>
              {allVirtues.map((virtue) => (
                <SelectItem key={virtue.id} value={virtue.id}>
                  {virtue.name} {virtue.isCustom && "(Custom)"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full text-lg py-6">
          {isSubmitting ? "Logging..." : "Log Moment"}
        </Button>
        {feedback && (
          <div className="mt-4 p-4 bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-200 rounded-md border border-blue-200 dark:border-blue-800">
            <p className="font-semibold">AI Feedback:</p>
            <p>{feedback}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CharacterMomentLogger;