import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Mic, MicOff, ChefHat, ArrowLeft, Sparkles, Volume2 } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { speechToText } from "../utils/api";
import { toast } from "sonner@2.0.3";

interface Recipe {
  id: string;
  name: string;
  category: string;
  difficulty: string;
  cookingTime: string;
  image: string;
  description: string;
}

interface VoiceAssistantProps {
  onRecipeSelect: (recipe: Recipe) => void;
  onBack: () => void;
}

const RECIPES: Recipe[] = [
  {
    id: "1",
    name: "김치볶음밥",
    category: "한식",
    difficulty: "쉬움",
    cookingTime: "20분",
    image: "https://images.unsplash.com/photo-1744870132190-5c02d3f8d9f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBmcmllZCUyMHJpY2UlMjBraW1jaGl8ZW58MXx8fHwxNzYyODM1ODQwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "간단하고 빠르게 만들 수 있는 한국의 대표 요리"
  },
  {
    id: "2",
    name: "스파게티 까르보나라",
    category: "양식",
    difficulty: "보통",
    cookingTime: "30분",
    image: "https://images.unsplash.com/photo-1588013273468-315fd88ea34c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGFnaGV0dGklMjBjYXJib25hcmElMjBwYXN0YXxlbnwxfHx8fDE3NjI3Nzc0NDh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "크리미한 소스가 일품인 이탈리아 파스타"
  },
  {
    id: "3",
    name: "된장찌개",
    category: "한식",
    difficulty: "쉬움",
    cookingTime: "25분",
    image: "https://images.unsplash.com/photo-1665395876131-7cf7cb099a51?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBkb2VuamFuZyUyMGpqaWdhZSUyMHN0ZXd8ZW58MXx8fHwxNzYyODM1ODQwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "구수한 맛이 일품인 한국 전통 찌개"
  },
  {
    id: "4",
    name: "치킨 샐러드",
    category: "샐러드",
    difficulty: "쉬움",
    cookingTime: "15분",
    image: "https://images.unsplash.com/photo-1729719930828-6cd60cb7d10f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlja2VuJTIwc2FsYWQlMjBoZWFsdGh5fGVufDF8fHx8MTc2MjgzNTg0MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "신선한 채소와 닭가슴살로 만드는 건강 요리"
  },
  {
    id: "5",
    name: "오므라이스",
    category: "양식",
    difficulty: "보통",
    cookingTime: "25분",
    image: "https://images.unsplash.com/photo-1743148509702-2198b23ede1c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvbXVyaWNlJTIwamFwYW5lc2UlMjByaWNlfGVufDF8fHx8MTc2MjgzNTg0MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "부드러운 계란과 볶음밥의 조화"
  },
  {
    id: "6",
    name: "비빔밥",
    category: "한식",
    difficulty: "보통",
    cookingTime: "35분",
    image: "https://images.unsplash.com/photo-1718777791239-c473e9ce7376?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaWJpbWJhcCUyMGtvcmVhbiUyMG1peGVkJTIwcmljZXxlbnwxfHx8fDE3NjI4MzU4NDF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "다양한 나물과 고기가 어우러진 영양 만점 한 그릇 요리"
  },
  {
    id: "7",
    name: "토마토 파스타",
    category: "양식",
    difficulty: "쉬움",
    cookingTime: "20분",
    image: "https://images.unsplash.com/photo-1751151497799-8b4057a2638e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b21hdG8lMjBwYXN0YSUyMHJlZCUyMHNhdWNlfGVufDF8fHx8MTc2MjgzNTg0Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "신선한 토마토로 만드는 상큼한 파스타"
  },
  {
    id: "8",
    name: "새우볶음밥",
    category: "중식",
    difficulty: "보통",
    cookingTime: "25분",
    image: "https://images.unsplash.com/photo-1747228469026-7298b12d9963?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaHJpbXAlMjBmcmllZCUyMHJpY2UlMjBjaGluZXNlfGVufDF8fHx8MTc2MjgzNTg0Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "통통한 새우가 들어간 고소한 볶음밥"
  }
];

export function VoiceAssistant({ onRecipeSelect, onBack }: VoiceAssistantProps) {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [transcribedText, setTranscribedText] = useState<string>("");
  const [aiResponse, setAiResponse] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const categories = ["전체", "한식", "양식", "중식", "샐러드"];

  const filteredRecipes = selectedCategory && selectedCategory !== "전체"
    ? RECIPES.filter(recipe => recipe.category === selectedCategory)
    : RECIPES;

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Reset chunks
      audioChunksRef.current = [];
      
      // Create MediaRecorder with webm format
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm;codecs=opus' });
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
        
        // Process the audio
        await processAudio(audioBlob);
      };

      mediaRecorder.start();
      setIsListening(true);
      toast.info("음성 녹음 중... 완료되면 버튼을 다시 클릭하세요");
      
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error('마이크 접근 권한이 필요합니다');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsListening(false);
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    setIsProcessing(true);
    
    try {
      // Call STT API
      const result = await speechToText(audioBlob, "레시피 검색", "음성 검색");
      
      setTranscribedText(result.text);
      setAiResponse(result.response);
      
      toast.success("음성 인식 완료!");
      
      // Play TTS audio if available
      if (result.audioUrl) {
        playAudio(result.audioUrl);
      }
      
    } catch (error) {
      console.error('Error processing audio:', error);
      toast.error('음성 처리 중 오류가 발생했습니다');
    } finally {
      setIsProcessing(false);
    }
  };

  const playAudio = (audioUrl: string) => {
    // Stop current audio if playing
    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(audioUrl);
    audioRef.current = audio;

    audio.onplay = () => setIsPlaying(true);
    audio.onended = () => setIsPlaying(false);
    audio.onerror = () => {
      console.error('Error playing audio');
      setIsPlaying(false);
      toast.error('음성 재생 중 오류가 발생했습니다');
    };

    audio.play();
  };

  const handleVoiceCommand = () => {
    if (isListening) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 pt-32">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="mb-2">AI 음성 보조</h1>
            <p className="text-muted-foreground">
              만들고 싶은 요리를 선택하거나 음성으로 말씀해주세요
            </p>
          </div>
        </div>

        {/* Voice Input Section */}
        <Card className="mb-8 border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-background">
          <CardContent className="pt-8 pb-8">
            <div className="flex flex-col items-center text-center">
              <div 
                className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 transition-all ${ 
                  isListening 
                    ? "bg-primary animate-pulse shadow-lg shadow-primary/30" 
                    : isProcessing 
                    ? "bg-secondary animate-spin" 
                    : "bg-primary/10 hover:bg-primary/20"
                }`}
              >
                {isListening ? (
                  <Mic className="w-12 h-12 text-primary-foreground animate-pulse" />
                ) : isProcessing ? (
                  <Sparkles className="w-12 h-12 text-secondary-foreground" />
                ) : (
                  <Mic className="w-12 h-12 text-primary" />
                )}
              </div>
              
              <h3 className="mb-2">
                {isListening 
                  ? "듣고 있습니다..." 
                  : isProcessing 
                  ? "처리 중..." 
                  : "음성으로 요리 검색"}
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                "김치볶음밥 만들고 싶어", "파스타 요리 알려줘" 등으로 말씀해주세요
              </p>
              
              <Button 
                size="lg" 
                onClick={handleVoiceCommand}
                disabled={isProcessing}
                variant={isListening ? "destructive" : "default"}
                className="min-w-[200px]"
              >
                {isListening ? (
                  <>
                    <MicOff className="w-5 h-5 mr-2" />
                    녹음 중지
                  </>
                ) : isProcessing ? (
                  <>
                    <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                    처리 중...
                  </>
                ) : (
                  <>
                    <Mic className="w-5 h-5 mr-2" />
                    음성으로 검색
                  </>
                )}
              </Button>

              {/* Display transcribed text and AI response */}
              {transcribedText && (
                <div className="mt-6 w-full max-w-2xl">
                  <div className="bg-muted rounded-lg p-4 mb-3 text-left">
                    <p className="text-sm text-muted-foreground mb-1">인식된 음성:</p>
                    <p className="text-foreground">{transcribedText}</p>
                  </div>
                  {aiResponse && (
                    <div className="bg-primary/10 rounded-lg p-4 text-left relative">
                      <p className="text-sm text-primary mb-1">AI 응답:</p>
                      <p className="text-foreground">{aiResponse}</p>
                      {isPlaying && (
                        <Volume2 className="w-5 h-5 text-primary absolute top-4 right-4 animate-pulse" />
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Category Filter */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-primary" />
            <h2>카테고리 선택</h2>
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Recipe Grid */}
        <div>
          <h2 className="mb-4">추천 요리 ({filteredRecipes.length})</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onSelect={() => onRecipeSelect(recipe)}
              />
            ))}
          </div>
        </div>

        {filteredRecipes.length === 0 && (
          <div className="text-center py-12">
            <ChefHat className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">해당 카테고리의 요리가 없습니다</p>
          </div>
        )}
      </div>
    </div>
  );
}

interface RecipeCardProps {
  recipe: Recipe;
  onSelect: () => void;
}

function RecipeCard({ recipe, onSelect }: RecipeCardProps) {
  return (
    <Card 
      className="overflow-hidden hover:shadow-lg transition-all cursor-pointer border-2 border-transparent hover:border-primary/40"
      onClick={onSelect}
    >
      <div className="aspect-video relative overflow-hidden bg-muted">
        <ImageWithFallback
          src={recipe.image}
          alt={recipe.name}
          className="w-full h-full object-cover"
        />
      </div>
      <CardHeader>
        <div className="flex items-start justify-between mb-2">
          <CardTitle className="text-lg">{recipe.name}</CardTitle>
          <Badge variant="secondary">{recipe.category}</Badge>
        </div>
        <CardDescription>{recipe.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 text-sm text-muted-foreground">
          <div>⏱️ {recipe.cookingTime}</div>
          <div>📊 {recipe.difficulty}</div>
        </div>
      </CardContent>
    </Card>
  );
}
