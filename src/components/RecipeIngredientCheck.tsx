import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { ArrowLeft, AlertTriangle, CheckCircle2, ChefHat, Utensils } from "lucide-react";
import { UserProfile } from "./ProfileSetup";

interface Recipe {
  id: string;
  name: string;
  category: string;
  difficulty: string;
  cookingTime: string;
  image: string;
  description: string;
}

interface Ingredient {
  id: string;
  name: string;
  amount: string;
  isAllergen?: boolean;
  allergenType?: string;
}

interface Tool {
  id: string;
  name: string;
}

interface RecipeIngredientCheckProps {
  recipe: Recipe;
  userProfile: UserProfile | null;
  onConfirm: () => void;
  onBack: () => void;
}

// Mock data - 실제로는 레시피 ID에 따라 다른 재료와 도구를 보여줘야 함
const getIngredientsForRecipe = (recipeId: string, allergies: string[]): Ingredient[] => {
  const baseIngredients: { [key: string]: Ingredient[] } = {
    "1": [ // 김치볶음밥
      { id: "1", name: "밥", amount: "2공기" },
      { id: "2", name: "김치", amount: "1/2포기" },
      { id: "3", name: "돼지고기", amount: "100g", isAllergen: allergies.includes("돼지고기"), allergenType: "돼지고기" },
      { id: "4", name: "식용유", amount: "2스푼" },
      { id: "5", name: "참기름", amount: "1스푼" },
      { id: "6", name: "김", amount: "1장" },
    ],
    "2": [ // 스파게티 까르보나라
      { id: "1", name: "스파게티 면", amount: "200g", isAllergen: allergies.includes("밀"), allergenType: "밀" },
      { id: "2", name: "베이컨", amount: "100g" },
      { id: "3", name: "달걀", amount: "2개", isAllergen: allergies.includes("달걀"), allergenType: "달걀" },
      { id: "4", name: "파르메산 치즈", amount: "50g", isAllergen: allergies.includes("유제품"), allergenType: "유제품" },
      { id: "5", name: "마늘", amount: "3쪽" },
      { id: "6", name: "생크림", amount: "100ml", isAllergen: allergies.includes("유제품"), allergenType: "유제품" },
      { id: "7", name: "후추", amount: "약간" },
    ],
    "3": [ // 된장찌개
      { id: "1", name: "된장", amount: "2스푼", isAllergen: allergies.includes("콩"), allergenType: "콩" },
      { id: "2", name: "두부", amount: "1/2모", isAllergen: allergies.includes("콩"), allergenType: "콩" },
      { id: "3", name: "감자", amount: "1개" },
      { id: "4", name: "양파", amount: "1/2개" },
      { id: "5", name: "애호박", amount: "1/3개" },
      { id: "6", name: "대파", amount: "1대" },
      { id: "7", name: "청양고추", amount: "1개" },
    ],
  };

  return baseIngredients[recipeId] || [
    { id: "1", name: "재료 1", amount: "적당량" },
    { id: "2", name: "재료 2", amount: "적당량" },
    { id: "3", name: "재료 3", amount: "적당량" },
  ];
};

const getToolsForRecipe = (recipeId: string): Tool[] => {
  const baseTools: { [key: string]: Tool[] } = {
    "1": [
      { id: "1", name: "프라이팬" },
      { id: "2", name: "주걱" },
      { id: "3", name: "도마" },
      { id: "4", name: "칼" },
    ],
    "2": [
      { id: "1", name: "냄비 (면 삶기용)" },
      { id: "2", name: "프라이팬" },
      { id: "3", name: "거품기" },
      { id: "4", name: "볼" },
    ],
    "3": [
      { id: "1", name: "냄비" },
      { id: "2", name: "도마" },
      { id: "3", name: "칼" },
      { id: "4", name: "국자" },
    ],
  };

  return baseTools[recipeId] || [
    { id: "1", name: "프라이팬" },
    { id: "2", name: "칼" },
    { id: "3", name: "도마" },
  ];
};

export function RecipeIngredientCheck({ recipe, userProfile, onConfirm, onBack }: RecipeIngredientCheckProps) {
  const allergies = userProfile?.allergies || [];
  const ingredients = getIngredientsForRecipe(recipe.id, allergies);
  const tools = getToolsForRecipe(recipe.id);

  const [checkedIngredients, setCheckedIngredients] = useState<Set<string>>(new Set());
  const [checkedTools, setCheckedTools] = useState<Set<string>>(new Set());

  const allergenIngredients = ingredients.filter(ing => ing.isAllergen);
  const hasAllergens = allergenIngredients.length > 0;

  const handleIngredientToggle = (id: string) => {
    const newChecked = new Set(checkedIngredients);
    if (newChecked.has(id)) {
      newChecked.delete(id);
    } else {
      newChecked.add(id);
    }
    setCheckedIngredients(newChecked);
  };

  const handleToolToggle = (id: string) => {
    const newChecked = new Set(checkedTools);
    if (newChecked.has(id)) {
      newChecked.delete(id);
    } else {
      newChecked.add(id);
    }
    setCheckedTools(newChecked);
  };

  const allIngredientsChecked = ingredients.length === checkedIngredients.size;
  const allToolsChecked = tools.length === checkedTools.size;
  const canProceed = allIngredientsChecked && allToolsChecked;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="mb-2">재료 및 도구 확인</h1>
            <p className="text-muted-foreground">
              {recipe.name} 요리에 필요한 재료와 도구를 확인해주세요
            </p>
          </div>
        </div>

        {/* Allergen Warning */}
        {hasAllergens && (
          <Alert className="mb-6 border-2 border-red-500 bg-red-50">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <AlertTitle className="text-red-900">알러지 경고</AlertTitle>
            <AlertDescription className="text-red-800">
              이 레시피에는 다음과 같은 알러지 유발 재료가 포함되어 있습니다:
              <div className="flex gap-2 mt-2 flex-wrap">
                {allergenIngredients.map(ing => (
                  <Badge key={ing.id} variant="destructive">
                    {ing.name} ({ing.allergenType})
                  </Badge>
                ))}
              </div>
              <p className="mt-2">
                알러지가 있으신 경우 이 요리를 만들지 마시고 다른 요리를 선택해주세요.
              </p>
            </AlertDescription>
          </Alert>
        )}

        {/* Recipe Info */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>{recipe.name}</CardTitle>
                <CardDescription>{recipe.description}</CardDescription>
              </div>
              <Badge>{recipe.category}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-6 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">조리시간:</span>
                <span>{recipe.cookingTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">난이도:</span>
                <span>{recipe.difficulty}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ingredients */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-green-600" />
                <CardTitle>필요한 재료</CardTitle>
              </div>
              <Badge variant={allIngredientsChecked ? "default" : "secondary"}>
                {checkedIngredients.size} / {ingredients.length}
              </Badge>
            </div>
            <CardDescription>
              보유하고 있는 재료를 체크해주세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {ingredients.map((ingredient) => (
                <div
                  key={ingredient.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-colors ${
                    checkedIngredients.has(ingredient.id)
                      ? "border-green-300 bg-green-50"
                      : "border-gray-200 hover:border-gray-300"
                  } ${ingredient.isAllergen ? "bg-red-50 border-red-300" : ""}`}
                >
                  <Checkbox
                    id={ingredient.id}
                    checked={checkedIngredients.has(ingredient.id)}
                    onCheckedChange={() => handleIngredientToggle(ingredient.id)}
                  />
                  <label
                    htmlFor={ingredient.id}
                    className="flex-1 cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span>{ingredient.name}</span>
                      {ingredient.isAllergen && (
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                    <span className="text-muted-foreground text-sm">{ingredient.amount}</span>
                  </label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tools */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Utensils className="w-5 h-5 text-green-600" />
                <CardTitle>필요한 조리 도구</CardTitle>
              </div>
              <Badge variant={allToolsChecked ? "default" : "secondary"}>
                {checkedTools.size} / {tools.length}
              </Badge>
            </div>
            <CardDescription>
              보유하고 있는 조리 도구를 체크해주세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-3">
              {tools.map((tool) => (
                <div
                  key={tool.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-colors ${
                    checkedTools.has(tool.id)
                      ? "border-green-300 bg-green-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Checkbox
                    id={`tool-${tool.id}`}
                    checked={checkedTools.has(tool.id)}
                    onCheckedChange={() => handleToolToggle(tool.id)}
                  />
                  <label
                    htmlFor={`tool-${tool.id}`}
                    className="flex-1 cursor-pointer"
                  >
                    {tool.name}
                  </label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            variant="outline"
            size="lg"
            onClick={onBack}
            className="flex-1"
          >
            다른 요리 선택
          </Button>
          <Button
            size="lg"
            onClick={onConfirm}
            disabled={!canProceed}
            className="flex-1"
          >
            {canProceed ? (
              <>
                <CheckCircle2 className="w-5 h-5 mr-2" />
                요리 시작하기
              </>
            ) : (
              "모든 항목을 확인해주세요"
            )}
          </Button>
        </div>

        {!canProceed && (
          <Alert className="mt-4">
            <AlertDescription>
              {!allIngredientsChecked && "필요한 재료를 모두 확인해주세요. "}
              {!allToolsChecked && "필요한 조리 도구를 모두 확인해주세요. "}
              재료나 도구가 부족하다면 '다른 요리 선택' 버튼을 눌러주세요.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}
