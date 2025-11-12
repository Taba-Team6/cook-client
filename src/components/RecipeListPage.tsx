import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { ChefHat, Clock, TrendingUp } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function RecipeListPage() {
  const categories = [
    { name: "한식", count: 24 },
    { name: "양식", count: 18 },
    { name: "중식", count: 12 },
    { name: "일식", count: 15 },
    { name: "디저트", count: 10 },
  ];

  const popularRecipes = [
    {
      id: 1,
      name: "김치볶음밥",
      category: "한식",
      time: "20분",
      difficulty: "쉬움",
      image: "https://images.unsplash.com/photo-1744870132190-5c02d3f8d9f9?w=400",
    },
    {
      id: 2,
      name: "스파게티",
      category: "양식",
      time: "30분",
      difficulty: "보통",
      image: "https://images.unsplash.com/photo-1588013273468-315fd88ea34c?w=400",
    },
    {
      id: 3,
      name: "된장찌개",
      category: "한식",
      time: "25분",
      difficulty: "쉬움",
      image: "https://images.unsplash.com/photo-1665395876131-7cf7cb099a51?w=400",
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-20 pt-32">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2">레시피 모음</h1>
          <p className="text-muted-foreground">
            다양한 카테고리의 레시피를 탐색해보세요
          </p>
        </div>

        {/* 카테고리 섹션 */}
        <div className="mb-12">
          <h2 className="mb-4">카테고리</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((category) => (
              <Card
                key={category.name}
                className="hover:border-primary/40 transition-all cursor-pointer"
              >
                <CardContent className="pt-6 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <ChefHat className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="mb-1">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">{category.count}개</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* 인기 레시피 */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h2>인기 레시피</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularRecipes.map((recipe) => (
              <Card
                key={recipe.id}
                className="overflow-hidden hover:shadow-lg transition-all cursor-pointer"
              >
                <div className="aspect-video relative bg-muted">
                  <ImageWithFallback
                    src={recipe.image}
                    alt={recipe.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle>{recipe.name}</CardTitle>
                    <Badge variant="secondary">{recipe.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {recipe.time}
                    </div>
                    <div>📊 {recipe.difficulty}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
