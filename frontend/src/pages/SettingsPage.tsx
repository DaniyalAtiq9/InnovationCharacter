import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { RIGHT_VIRTUES, UserGoals, getAllVirtues, loadUserVirtues, saveUserVirtues, UserVirtue, USER_VIRTUES_KEY } from "@/utils/virtues";
import { showSuccess, showError } from "@/utils/toast";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import { API_BASE_URL } from "@/services/api";

const ONBOARDING_COMPLETED_KEY = "onboardingCompleted";
const ASSESSMENT_DATA_KEY = "assessmentData";
const USER_GOALS_KEY = "userGoals";
const QUESTIONNAIRE_ANSWERS_KEY = "questionnaireAnswers";
const QUALITATIVE_RESPONSES_KEY = "qualitativeResponses";
const CHARACTER_MOMENTS_KEY = "characterMoments";
const WEEKLY_CHALLENGES_KEY = "weeklyChallenges";

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentUserGoals, setCurrentUserGoals] = React.useState<UserGoals | null>(null);
  const [selectedVirtues, setSelectedVirtues] = React.useState<string[]>([]);
  const [innovationGoals, setInnovationGoals] = React.useState<string>("");
  const [customVirtues, setCustomVirtues] = React.useState<UserVirtue[]>([]);

  // State for dialog
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingVirtue, setEditingVirtue] = React.useState<UserVirtue | null>(null);
  const [virtueName, setVirtueName] = React.useState("");
  const [virtueDescription, setVirtueDescription] = React.useState("");

  React.useEffect(() => {
    const fetchGoals = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch(`${API_BASE_URL}/goals`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          const userGoals = {
              priorityVirtues: data.priority_virtues,
              innovationGoals: data.innovation_goal,
              behavioralCommitments: [], // Backend doesn't return this yet
              firstWeekCoachingPlan: [] // Backend doesn't return this yet
          };
          setCurrentUserGoals(userGoals);
          setSelectedVirtues(userGoals.priorityVirtues);
          setInnovationGoals(userGoals.innovationGoals);
        } else {
          showError("No user goals found. Please complete the assessment.");
          navigate("/assessment");
        }
      } catch (error) {
        console.error("Failed to fetch goals:", error);
        showError("Failed to load settings.");
      }
    };

    fetchGoals();
    setCustomVirtues(loadUserVirtues());
  }, [navigate]);

  const handleVirtueToggle = (virtueId: string) => {
    setSelectedVirtues((prev) => {
      if (prev.includes(virtueId)) {
        return prev.filter((id) => id !== virtueId);
      } else {
        if (prev.length < 3) {
          return [...prev, virtueId];
        } else {
          showError("You can select a maximum of 3 priority virtues.");
          return prev;
        }
      }
    });
  };

  const handleSaveGoals = () => {
    if (selectedVirtues.length === 0 || innovationGoals.trim() === "") {
      showError("Please select at least one priority virtue and describe your innovation goals.");
      return;
    }

    const updatedGoals: UserGoals = {
      ...currentUserGoals,
      priorityVirtues: selectedVirtues,
      innovationGoals: innovationGoals.trim(),
      // Re-generate mock behavioral commitments and coaching plan based on new virtues
      behavioralCommitments: selectedVirtues.map(
        (virtueId) => getAllVirtues().find(v => v.id === virtueId)?.name || virtueId
      ).map(name => `Commit to practicing ${name} daily.`),
      firstWeekCoachingPlan: selectedVirtues.map(
        (virtueId) => getAllVirtues().find(v => v.id === virtueId)?.name || virtueId
      ).map(name => `Focus on identifying opportunities to apply ${name} in your work this week.`),
    } as UserGoals; // Type assertion as currentUserGoals might be null initially

    localStorage.setItem(USER_GOALS_KEY, JSON.stringify(updatedGoals));
    setCurrentUserGoals(updatedGoals);
    showSuccess("Your character goals have been updated!");
  };

  const handleResetAssessment = () => {
    if (window.confirm("Are you sure you want to reset your entire assessment and progress? This cannot be undone.")) {
      localStorage.removeItem(ONBOARDING_COMPLETED_KEY);
      localStorage.removeItem(ASSESSMENT_DATA_KEY);
      localStorage.removeItem(USER_GOALS_KEY);
      localStorage.removeItem(QUESTIONNAIRE_ANSWERS_KEY);
      localStorage.removeItem(QUALITATIVE_RESPONSES_KEY);
      localStorage.removeItem(CHARACTER_MOMENTS_KEY);
      localStorage.removeItem(WEEKLY_CHALLENGES_KEY);
      localStorage.removeItem(USER_VIRTUES_KEY); // Clear custom virtues too
      showSuccess("Assessment and progress reset. Redirecting to onboarding.");
      navigate("/assessment");
    }
  };

  // Custom Virtue Management Handlers
  const openAddVirtueDialog = () => {
    setEditingVirtue(null);
    setVirtueName("");
    setVirtueDescription("");
    setIsDialogOpen(true);
  };

  const openEditVirtueDialog = (virtue: UserVirtue) => {
    setEditingVirtue(virtue);
    setVirtueName(virtue.name);
    setVirtueDescription(virtue.description);
    setIsDialogOpen(true);
  };

  const handleSaveCustomVirtue = () => {
    if (virtueName.trim() === "" || virtueDescription.trim() === "") {
      showError("Virtue name and description cannot be empty.");
      return;
    }

    const allVirtues = getAllVirtues();
    if (allVirtues.some(v => v.name.toLowerCase() === virtueName.trim().toLowerCase() && v.id !== editingVirtue?.id)) {
      showError("A virtue with this name already exists.");
      return;
    }

    let updatedVirtues: UserVirtue[];
    if (editingVirtue) {
      updatedVirtues = customVirtues.map((v) =>
        v.id === editingVirtue.id
          ? { ...v, name: virtueName.trim(), description: virtueDescription.trim() }
          : v
      );
      showSuccess("Custom virtue updated!");
    } else {
      const newVirtue: UserVirtue = {
        id: `custom-${Date.now()}`,
        name: virtueName.trim(),
        description: virtueDescription.trim(),
        isCustom: true,
      };
      updatedVirtues = [...customVirtues, newVirtue];
      showSuccess("Custom virtue added!");
    }
    setCustomVirtues(updatedVirtues);
    saveUserVirtues(updatedVirtues);
    setIsDialogOpen(false);
  };

  const handleDeleteCustomVirtue = (virtueId: string) => {
    if (window.confirm("Are you sure you want to delete this custom virtue? It will be removed from your goals and logged moments.")) {
      const updatedVirtues = customVirtues.filter((v) => v.id !== virtueId);
      saveUserVirtues(updatedVirtues);
      setCustomVirtues(updatedVirtues);
      // Also remove from selected virtues if it was a priority
      setSelectedVirtues(prev => prev.filter(id => id !== virtueId));
      showSuccess("Custom virtue deleted.");
    }
  };

  if (!currentUserGoals) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] p-4">
        <Card className="w-full max-w-md text-center shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-primary">Loading Settings...</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Please complete the onboarding assessment to manage your settings.</p>
            <Button onClick={() => navigate("/assessment")} className="mt-4">Go to Assessment</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const allVirtues = getAllVirtues();
  const predefinedVirtues = RIGHT_VIRTUES;

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-center text-primary">Settings & Character Focus</h1>
      <p className="text-lg text-muted-foreground text-center">
        Manage your character development goals, custom virtues, and application settings.
      </p>

      <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-primary">Adjust Your Character Goals</CardTitle>
          <CardDescription className="text-muted-foreground">Update your priority virtues and innovation goals.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-base font-medium">Select Priority Virtues (up to 3):</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {allVirtues.map((virtue) => (
                <div key={virtue.id} className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted/50 transition-colors">
                  <Checkbox
                    id={virtue.id}
                    checked={selectedVirtues.includes(virtue.id)}
                    onCheckedChange={() => handleVirtueToggle(virtue.id)}
                  />
                  <Label htmlFor={virtue.id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                    {virtue.name} {virtue.isCustom && "(Custom)"}
                    <p className="text-muted-foreground text-xs">{virtue.description}</p>
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="innovation-goals" className="text-base font-medium">How do you connect these virtues to your innovation goals?</Label>
            <Textarea
              id="innovation-goals"
              value={innovationGoals}
              onChange={(e) => setInnovationGoals(e.target.value)}
              rows={5}
              placeholder="Describe your innovation goals and how developing these virtues will help you achieve them."
              className="min-h-[120px]"
            />
          </div>
          <Button onClick={handleSaveGoals} className="w-full text-lg py-6">Save Changes</Button>
        </CardContent>
      </Card>

      <Separator className="my-8" />

      <Card className="w-full shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-semibold text-primary">Manage Custom Virtues</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" onClick={openAddVirtueDialog} className="text-base">
                <PlusCircle className="mr-2 h-4 w-4" /> Add New Virtue
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{editingVirtue ? "Edit Custom Virtue" : "Add New Custom Virtue"}</DialogTitle>
                <DialogDescription>
                  {editingVirtue ? "Make changes to your custom virtue here." : "Define a new character virtue that's important to you."}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="virtue-name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="virtue-name"
                    value={virtueName}
                    onChange={(e) => setVirtueName(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="virtue-description" className="text-right">
                    Description
                  </Label>
                  <Textarea
                    id="virtue-description"
                    value={virtueDescription}
                    onChange={(e) => setVirtueDescription(e.target.value)}
                    className="col-span-3 min-h-[80px]"
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleSaveCustomVirtue}>Save changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent className="space-y-4">
          {customVirtues.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No custom virtues added yet. Click "Add New Virtue" to get started!</p>
          ) : (
            <div className="space-y-2">
              {customVirtues.map((virtue) => (
                <div key={virtue.id} className="flex items-center justify-between p-3 border rounded-md bg-muted/30">
                  <div>
                    <p className="font-medium text-foreground">{virtue.name}</p>
                    <p className="text-sm text-muted-foreground">{virtue.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => openEditVirtueDialog(virtue)}>
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteCustomVirtue(virtue.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Separator className="my-8" />

      <Card className="w-full shadow-lg border-destructive">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-destructive">Reset Assessment</CardTitle>
          <CardDescription className="text-muted-foreground">Clear all your progress and restart the character assessment. This action cannot be undone.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" onClick={handleResetAssessment} className="w-full text-lg py-6">Reset All Progress</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;