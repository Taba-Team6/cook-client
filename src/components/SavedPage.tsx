import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Bookmark, Heart, Clock } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function SavedPage() {
  const savedRecipes = [
    {
      id: 1,
      name: "김치볶음밥",
      category: "한식",
      savedAt: "2일 전",
      isLiked: true,
      image: "https://images.unsplash.com/photo-1744870132190-5c02d3f8d9f9?w=400",
    },
    {
      id: 2,
      name: "스파게티 까르보나라",
      category: "양식",
      savedAt: "5일 전",
      isLiked: true,
      image: "https://images.unsplash.com/photo-1588013273468-315fd88ea34c?w=400",
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-20 pt-32">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2">저장한 레시피</h1>
          <p className="text-muted-foreground">
            나중에 다시 만들고 싶은 레시피를 모아보세요
          </p>
        </div>

        {savedRecipes.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedRecipes.map((recipe) => (
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
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-card/90 backdrop-blur-sm">
                      <Bookmark className="w-3 h-3 mr-1 fill-primary text-primary" />
                      저장됨
                    </Badge>
                  </div>
                </div>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle>{recipe.name}</CardTitle>
                    {recipe.isLiked && (
                      <Heart className="w-5 h-5 fill-accent text-accent" />
                    )}
                  </div>
                  <CardDescription>{recipe.category}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{recipe.savedAt} 저장</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <Bookmark className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="mb-2">저장한 레시피가 없습니다</h3>
              <p className="text-muted-foreground">
                마음에 드는 레시피를 저장해보세요
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
