import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ONBOARDING_COMPLETED_KEY = "onboardingCompleted";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    const onboardingCompleted = localStorage.getItem(ONBOARDING_COMPLETED_KEY);

    if (!authToken) {
      navigate("/login");
      return;
    }

    if (onboardingCompleted === "true") {
      navigate("/dashboard");
    } else {
      navigate("/assessment");
    }
  }, [navigate]);

  // This page will quickly redirect, so a simple loading message is sufficient
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <p className="text-xl font-medium">Loading your character journey...</p>
    </div>
  );
};

export default Index;