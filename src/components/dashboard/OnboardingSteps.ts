import { Step } from "@/components/OnboardingProgress"

// Initial steps for onboarding - simplified to only 3 steps
export const initialSteps: Step[] = [
  {
    id: 1,
    name: "Sign Up",
    description: "Create your account",
    status: "completed",
    estimatedTime: "2-3 minutes",
  },
  {
    id: 2,
    name: "Create Profile",
    description: "Enter your information",
    status: "completed",
    estimatedTime: "5-7 minutes",
  },
  {
    id: 3,
    name: "Review Profile",
    description: "Review your profile",
    status: "current",
    estimatedTime: "3-5 minutes",
  },
]

// The full steps list for the dashboard view after onboarding is complete
export const fullStepsList: Step[] = [
  {
    id: 1,
    name: "Sign Up",
    description: "Create your account",
    status: "completed",
    estimatedTime: "2-3 minutes",
  },
  {
    id: 2,
    name: "Create Profile",
    description: "Enter your information",
    status: "completed",
    estimatedTime: "5-7 minutes",
  },
  {
    id: 3,
    name: "Review Profile",
    description: "Review your profile",
    status: "current",
    estimatedTime: "3-5 minutes",
  },
  {
    id: 4,
    name: "Branding",
    description: "Enhance your profile",
    status: "upcoming",
    estimatedTime: "5-8 minutes",
  },
  {
    id: 5,
    name: "Job Matching",
    description: "Get matched to jobs",
    status: "upcoming",
    estimatedTime: "3-5 minutes",
  },
]

// Function to get the next step information
export const getNextStepInfo = (nextStep: Step | undefined, steps: Step[]) => {
  if (!nextStep) {
    return {
      title: "You've Completed All Steps",
      description:
        "Congratulations! You've completed the entire onboarding process.",
      path: "/dashboard/waiting-room",
      buttonText: "View Job Matches",
      estimatedTime: "",
    }
  }

  switch (nextStep.id) {
    case 1:
      return {
        title: "Create Your Profile",
        description: "Let's start by setting up your professional profile.",
        path: "/create-profile",
        buttonText: "Create Profile",
        estimatedTime: nextStep.estimatedTime,
      }
    case 2:
      return {
        title: "Create Your Profile",
        description: "Let's start by setting up your professional profile.",
        path: "/create-profile",
        buttonText: "Create Profile",
        estimatedTime: nextStep.estimatedTime,
      }
    case 3:
      return {
        title: "Review Your Profile Snapshot",
        description:
          "Take a look at your profile summary and make any necessary adjustments.",
        path: "/edit-profile",
        buttonText: "Review Profile",
        estimatedTime: nextStep.estimatedTime,
      }
    case 4:
      return {
        title: "Enhance Your Professional Brand",
        description:
          "Take advantage of our tools to enhance your professional brand.",
        path: "/dashboard/branding",
        buttonText: "Enhance Brand",
        estimatedTime: nextStep.estimatedTime,
      }
    case 5:
      return {
        title: "Job Matching",
        description:
          "Get matched with job opportunities that fit your profile.",
        path: "/work-preferences",
        buttonText: "View Matches",
        estimatedTime: nextStep.estimatedTime,
      }
    default:
      return {
        title: "Continue Your Journey",
        description: "Continue with the next step in your onboarding process.",
        path: "/dashboard",
        buttonText: "Continue",
        estimatedTime: "",
      }
  }
}
