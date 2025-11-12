import { useState, useEffect } from "react";
import { Auth } from "./components/Auth";
import { HomePage } from "./components/HomePage";
import { ProfileSetup, UserProfile } from "./components/ProfileSetup";
import { ProfileComplete } from "./components/ProfileComplete";
import { IngredientsInput, CookingContext } from "./components/IngredientsInput";
import { RecipeRecommendation } from "./components/RecipeRecommendation";
import { RecipeDetail } from "./components/RecipeDetail";
import { Feedback } from "./components/Feedback";
import { VoiceAssistant } from "./components/VoiceAssistant";
import { RecipeIngredientCheck } from "./components/RecipeIngredientCheck";
import { CookingInProgress } from "./components/CookingInProgress";
import { TopNavBar } from "./components/TopNavBar";
import { BottomNavBar } from "./components/BottomNavBar";
import { RecipeListPage } from "./components/RecipeListPage";
import { SavedPage } from "./components/SavedPage";
import { MyPage } from "./components/MyPage";
import { IngredientsManagement } from "./components/IngredientsManagement";
import { AccountSettings } from "./components/AccountSettings";
import type { Recipe } from "./components/RecipeRecommendation";
import { createClient } from "./utils/supabase/client";
import { setAuthToken, removeAuthToken } from "./utils/api";

type AppStep = "auth" | "home" | "profile" | "profile-complete" | "ingredients" | "recommendations" | "recipe" | "feedback" | "voice-assistant" | "ingredient-check" | "cooking-in-progress" | "recipe-list" | "saved" | "mypage" | "ingredients-management" | "account-settings";

export default function App() {
  const [currentStep, setCurrentStep] = useState<AppStep>("auth");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ id: string; email: string; name: string } | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [cookingContext, setCookingContext] = useState<CookingContext | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  // Check if user has an active session
  useEffect(() => {
    const checkSession = async () => {
      const supabase = createClient();
      
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session check error:', error);
          setIsCheckingSession(false);
          return;
        }

        if (session && session.user) {
          // Store auth token
          setAuthToken(session.access_token);

          // Get user info
          const userName = session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User';
          
          const user = {
            id: session.user.id,
            email: session.user.email || '',
            name: userName,
          };

          setCurrentUser(user);
          sessionStorage.setItem("cooking_assistant_current_user", JSON.stringify(user));
          setIsAuthenticated(true);
          setCurrentStep("home");
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setIsCheckingSession(false);
      }
    };

    checkSession();

    // Set up auth state listener
    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        handleLogout();
      } else if (event === 'SIGNED_IN' && session) {
        setAuthToken(session.access_token);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Load dark mode preference
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("cooking_assistant_dark_mode");
    if (savedDarkMode === "true") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    if (newDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("cooking_assistant_dark_mode", "true");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("cooking_assistant_dark_mode", "false");
    }
  };

  const handleAuthSuccess = (userName: string) => {
    const user = localStorage.getItem("cooking_assistant_current_user");
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
    setIsAuthenticated(true);
    setCurrentStep("home");
  };

  const handleLogout = () => {
    localStorage.removeItem("cooking_assistant_current_user");
    removeAuthToken();
    setIsAuthenticated(false);
    setCurrentUser(null);
    setUserProfile(null);
    setCookingContext(null);
    setSelectedRecipe(null);
    setCurrentStep("auth");
  };

  const handleGetStarted = () => {
    setCurrentStep("profile");
  };

  const handleProfileComplete = (profile: UserProfile) => {
    setUserProfile(profile);
    setCurrentStep("profile-complete");
  };

  const handleQuickRecommendation = () => {
    setCookingContext(null);
    setCurrentStep("recommendations");
  };

  const handleDetailedRecommendation = () => {
    setCurrentStep("ingredients");
  };

  const handleIngredientsComplete = (context: CookingContext) => {
    setCookingContext(context);
    setCurrentStep("recommendations");
  };

  const handleRecipeSelect = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setCurrentStep("recipe");
  };

  const handleCookingComplete = () => {
    setCurrentStep("feedback");
  };

  const handleFeedbackComplete = () => {
    setCurrentStep("home");
    setSelectedRecipe(null);
  };

  const handleBackToHome = () => {
    setCurrentStep("home");
  };

  const handleBackToProfile = () => {
    setCurrentStep("profile");
  };

  const handleBackToProfileComplete = () => {
    setCurrentStep("profile-complete");
  };

  const handleBackToIngredients = () => {
    setCurrentStep("ingredients");
  };

  const handleBackToRecommendations = () => {
    setCurrentStep("recommendations");
  };

  const handleAddIngredientsFromRecommendation = () => {
    setCurrentStep("ingredients");
  };

  const handleVoiceAssistant = () => {
    setCurrentStep("voice-assistant");
  };

  const handleVoiceRecipeSelect = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setCurrentStep("ingredient-check");
  };

  const handleBackToVoiceAssistant = () => {
    setCurrentStep("voice-assistant");
  };

  const handleIngredientCheckConfirm = () => {
    if (selectedRecipe) {
      setCurrentStep("cooking-in-progress");
    }
  };

  const handleCookingInProgressComplete = () => {
    setCurrentStep("feedback");
  };

  const handleBackToIngredientCheck = () => {
    setCurrentStep("ingredient-check");
  };

  // 네비게이션 바 표시 여부 결정
  const shouldShowNavigation = isAuthenticated && currentStep !== "auth";

  // 하단 네비게이션 활성 탭 결정
  const getActiveBottomTab = () => {
    switch (currentStep) {
      case "home":
        return "home";
      case "recipe-list":
        return "recipe";
      case "voice-assistant":
      case "ingredient-check":
      case "cooking-in-progress":
        return "ai";
      case "ingredients-management":
        return "ingredients";
      case "mypage":
      case "profile":
      case "account-settings":
      case "saved":
        return "mypage";
      default:
        return "home";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* 상단 네비게이션 바 */}
      {shouldShowNavigation && (
        <TopNavBar
          isAuthenticated={isAuthenticated}
          userName={currentUser?.name}
          onLogout={handleLogout}
          onProfileClick={() => setCurrentStep("mypage")}
          onLogoClick={handleBackToHome}
          onSearch={(query) => console.log("Search:", query)}
          isDarkMode={isDarkMode}
          onToggleDarkMode={toggleDarkMode}
        />
      )}

      {/* 메인 컨텐츠 */}
      {currentStep === "auth" && !isAuthenticated && (
        <Auth onAuthSuccess={handleAuthSuccess} />
      )}

      {currentStep === "home" && isAuthenticated && (
        <HomePage 
          onGetStarted={handleGetStarted} 
          onVoiceAssistant={handleVoiceAssistant}
          onLogout={handleLogout} 
          userName={currentUser?.name} 
        />
      )}

      {currentStep === "voice-assistant" && isAuthenticated && (
        <VoiceAssistant 
          onRecipeSelect={handleVoiceRecipeSelect}
          onBack={handleBackToHome}
        />
      )}

      {currentStep === "ingredient-check" && isAuthenticated && selectedRecipe && (
        <RecipeIngredientCheck
          recipe={selectedRecipe}
          userProfile={userProfile}
          onConfirm={handleIngredientCheckConfirm}
          onBack={handleBackToVoiceAssistant}
        />
      )}

      {currentStep === "cooking-in-progress" && isAuthenticated && selectedRecipe && (
        <CookingInProgress
          recipe={selectedRecipe}
          onComplete={handleCookingInProgressComplete}
          onBack={handleBackToIngredientCheck}
        />
      )}

      {currentStep === "profile" && isAuthenticated && (
        <ProfileSetup onComplete={handleProfileComplete} onBack={() => setCurrentStep("mypage")} />
      )}

      {currentStep === "profile-complete" && userProfile && (
        <ProfileComplete
          profile={userProfile}
          onQuickRecommendation={handleQuickRecommendation}
          onDetailedRecommendation={handleDetailedRecommendation}
          onBack={handleBackToProfile}
        />
      )}

      {currentStep === "ingredients" && userProfile && (
        <IngredientsInput onComplete={handleIngredientsComplete} onBack={handleBackToProfileComplete} />
      )}

      {currentStep === "recommendations" && userProfile && (
        <RecipeRecommendation
          profile={userProfile}
          context={cookingContext}
          onSelectRecipe={handleRecipeSelect}
          onBack={cookingContext ? handleBackToIngredients : handleBackToProfileComplete}
          onAddIngredients={!cookingContext ? handleAddIngredientsFromRecommendation : undefined}
        />
      )}

      {currentStep === "recipe" && selectedRecipe && (
        <RecipeDetail
          recipe={selectedRecipe}
          onComplete={handleCookingComplete}
          onBack={handleBackToRecommendations}
        />
      )}

      {currentStep === "feedback" && selectedRecipe && (
        <Feedback recipe={selectedRecipe} onComplete={handleFeedbackComplete} />
      )}

      {currentStep === "recipe-list" && (
        <RecipeListPage />
      )}

      {currentStep === "saved" && (
        <SavedPage />
      )}

      {currentStep === "mypage" && (
        <MyPage
          userName={currentUser?.name}
          onProfileEdit={() => setCurrentStep("profile")}
          onAccountSettings={() => setCurrentStep("account-settings")}
          onSavedRecipes={() => setCurrentStep("saved")}
        />
      )}

      {currentStep === "ingredients-management" && (
        <IngredientsManagement />
      )}

      {currentStep === "account-settings" && (
        <AccountSettings onBack={() => setCurrentStep("mypage")} />
      )}

      {/* 하단 네비게이션 바 */}
      {shouldShowNavigation && (
        <BottomNavBar
          activeTab={getActiveBottomTab()}
          onHomeClick={handleBackToHome}
          onRecipeClick={() => setCurrentStep("recipe-list")}
          onAIClick={handleVoiceAssistant}
          onIngredientsClick={() => setCurrentStep("ingredients-management")}
          onMyPageClick={() => setCurrentStep("mypage")}
        />
      )}
    </div>
  );
}