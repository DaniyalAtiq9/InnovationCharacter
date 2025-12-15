import React from "react";
import { useNavigate } from "react-router-dom";
import QuestionnaireStep from "@/components/onboarding/QuestionnaireStep";
import QualitativeStep from "@/components/onboarding/QualitativeStep";
import GoalSettingStep from "@/components/onboarding/GoalSettingStep";
import { RIGHT_VIRTUES, VirtueScore, AssessmentResult, UserGoals } from "@/utils/virtues";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = React.useState(1);
  const [questionnaireAnswers] = React.useState<Record<string, number>>({});
  const [qualitativeResponses, setQualitativeResponses] = React.useState<{ scenarioResponses: Record<string, string>; selfReflection: string }>({ scenarioResponses: {}, selfReflection: "" });
  const [userGoals, setUserGoals] = React.useState<UserGoals>({ priorityVirtues: [], innovationGoals: "", behavioralCommitments: [], firstWeekCoachingPlan: [] });
  const [assessmentResults, setAssessmentResults] = React.useState<AssessmentResult | null>(null);

  const handleQuestionnaireComplete = (result: AssessmentResult) => {
    setAssessmentResults(result);
    setStep(2);
  };

  const handleQualitativeComplete = (responses: { scenarioResponses: Record<string, string>; selfReflection: string }) => {
    setQualitativeResponses(responses);
    // Qualitative data is currently just local state, not sent to API yet
    setStep(3);
  };

  const handleGoalSettingComplete = (goals: UserGoals) => {
    setUserGoals(goals);
    // Goals are already submitted to API in GoalSettingStep
    navigate("/dashboard");
  };

  const progress = (step / 3) * 100;

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] p-4 lg:p-8">
      <Card className="w-full max-w-3xl mb-8 shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary">Character Assessment Journey</CardTitle>
          <CardDescription className="text-muted-foreground">Embark on your path to character-driven innovation.</CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={progress} className="w-full h-3" />
          <p className="text-center text-sm text-muted-foreground mt-3">Step {step} of 3</p>
        </CardContent>
      </Card>

      {step === 1 && (
        <QuestionnaireStep
          onNext={handleQuestionnaireComplete}
          onBack={() => navigate("/")} // Or a welcome screen
          initialData={questionnaireAnswers}
        />
      )}
      {step === 2 && (
        <QualitativeStep
          onNext={handleQualitativeComplete}
          onBack={() => setStep(1)}
          initialData={qualitativeResponses}
        />
      )}
      {step === 3 && assessmentResults && (
        <GoalSettingStep
          onNext={handleGoalSettingComplete}
          onBack={() => setStep(2)}
          initialData={userGoals}
          assessmentResults={assessmentResults}
        />
      )}
    </div>
  );
};

export default OnboardingPage;