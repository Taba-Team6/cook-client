import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { ChefHat, Mic, Sparkles, TrendingUp, LogOut } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface HomePageProps {
  onGetStarted: () => void;
  onVoiceAssistant: () => void;
  onLogout?: () => void;
  userName?: string;
}

export function HomePage({ onGetStarted, onVoiceAssistant, onLogout, userName }: HomePageProps) {
  return (
    <div className="min-h-screen bg-background pb-20 pt-28">
      {/* Hero Section */}
      <div className="relative h-[500px] overflow-hidden">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1651697347337-0d018decfad4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb29raW5nJTIwa2l0Y2hlbiUyMGZyZXNoJTIwdmVnZXRhYmxlc3xlbnwxfHx8fDE3NjI3NDk2NTN8MA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Cooking Kitchen"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/60" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-primary-foreground px-4">
          <div className="max-w-4xl text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <ChefHat className="w-12 h-12" />
              <h1 className="text-primary-foreground">쿠킹 어시스턴트</h1>
            </div>
            <p className="mb-8 opacity-95 max-w-2xl mx-auto">
              당신의 냉장고 재료와 상황에 맞춘 맞춤형 레시피 추천. 
              AI가 실시간으로 요리 과정을 안내해드립니다.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button 
                onClick={onVoiceAssistant} 
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90 min-w-[200px]"
              >
                <Mic className="w-5 h-5 mr-2" />
                AI 음성 보조
              </Button>
              <Button 
                onClick={onGetStarted} 
                size="lg"
                variant="outline"
                className="bg-card text-foreground hover:bg-muted border-2 border-card min-w-[200px]"
              >
                프로필 설정하기
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="mb-4">주요 기능</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            요리 초보자부터 전문가까지, 모두를 위한 스마트 요리 도우미
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-2 border-primary/20 hover:border-primary/40 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>맞춤형 추천</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                개인 프로필과 선호도를 기반으로 당신에게 딱 맞는 레시피를 추천합니다.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/20 hover:border-primary/40 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <ChefHat className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>재료 기반 추천</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                냉장고에 있는 재료를 입력하면 활용 가능한 레시피와 대체재를 제안합니다.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/20 hover:border-primary/40 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Mic className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>실시간 음성 가이드</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                요리하는 동안 AI가 음성으로 실시간 조언과 팁을 제공합니다.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/20 hover:border-primary/40 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>학습형 AI</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                피드백을 통해 계속 학습하며 점점 더 정확한 추천을 제공합니다.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* How it Works */}
      <div className="bg-muted py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="mb-4">이용 방법</h2>
            <p className="text-muted-foreground">간단한 4단계로 완벽한 요리를 시작하세요</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4">
                1
              </div>
              <h3 className="mb-2">프로필 설정</h3>
              <p className="text-muted-foreground">선호 음식, 요리 수준, 알러지 정보 입력</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4">
                2
              </div>
              <h3 className="mb-2">재료 입력</h3>
              <p className="text-muted-foreground">냉장고에 있는 재료와 현재 상황 입력</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4">
                3
              </div>
              <h3 className="mb-2">레시피 선택</h3>
              <p className="text-muted-foreground">AI가 추천한 맞춤형 레시피 중 선택</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4">
                4
              </div>
              <h3 className="mb-2">요리 시작</h3>
              <p className="text-muted-foreground">음성 가이드와 함께 요리 완성</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="mb-4">지금 바로 시작하세요</h2>
          <p className="text-muted-foreground mb-8">
            요리의 즐거움을 발견하고, 맛있는 식사를 만들어보세요
          </p>
          <Button onClick={onGetStarted} size="lg">
            무료로 시작하기
          </Button>
        </div>
      </div>
    </div>
  );
}