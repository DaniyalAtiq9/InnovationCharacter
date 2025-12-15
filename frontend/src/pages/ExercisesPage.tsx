import React from "react";
import ScenarioExercise from "@/components/exercises/ScenarioExercise";

const ExercisesPage: React.FC = () => {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-center text-primary">Interactive Character Exercises</h1>
      <p className="text-lg text-muted-foreground text-center">Practice applying virtues in real-world work scenarios and receive immediate feedback.</p>
      <ScenarioExercise />
    </div>
  );
};

export default ExercisesPage;