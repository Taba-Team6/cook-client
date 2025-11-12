import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { 
  User, 
  Settings, 
  ChefHat, 
  Heart, 
  Bookmark, 
  TrendingUp,
  Bell,
  Shield,
  HelpCircle,
  UserCog
} from "lucide-react";

interface MyPageProps {
  userName?: string;
  onProfileEdit: () => void;
  onAccountSettings?: () => void;
  onSavedRecipes?: () => void;
}

export function MyPage({ userName = "사용자", onProfileEdit, onAccountSettings, onSavedRecipes }: MyPageProps) {
  const stats = [
    { label: "완료한 요리", value: 12, icon: <ChefHat className="w-5 h-5" /> },
    { label: "좋아요", value: 24, icon: <Heart className="w-5 h-5" /> },
    { label: "저장", value: 8, icon: <Bookmark className="w-5 h-5" /> },
    { label: "레벨", value: 3, icon: <TrendingUp className="w-5 h-5" /> },
  ];

  const menuItems = [
    {
      icon: <Settings className="w-5 h-5" />,
      title: "개인정보 설정",
      description: "계정 정보 및 비밀번호 변경",
      onClick: onAccountSettings,
    },
    {
      icon: <UserCog className="w-5 h-5" />,
      title: "요리 프로필 설정",
      description: "음식 선호도, 알러지, 요리 수준 관리",
      onClick: onProfileEdit,
    },
    {
      icon: <Bookmark className="w-5 h-5" />,
      title: "저장된 레시피",
      description: "내가 저장한 레시피 보기",
      onClick: onSavedRecipes,
    },
    {
      icon: <Bell className="w-5 h-5" />,
      title: "알림 설정",
      description: "푸시 알림 및 이메일 설정",
      onClick: () => {},
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: "개인정보 보호",
      description: "데이터 및 보안 설정",
      onClick: () => {},
    },
    {
      icon: <HelpCircle className="w-5 h-5" />,
      title: "도움말",
      description: "FAQ 및 고객 지원",
      onClick: () => {},
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-20 pt-32">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 프로필 섹션 */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <Avatar className="w-24 h-24">
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                  {userName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-center md:text-left">
                <h2 className="mb-1">{userName}</h2>
                <p className="text-muted-foreground mb-4">요리 초보 탈출 중!</p>
                <Badge className="bg-primary text-primary-foreground">
                  레벨 3 - 주방 견습생
                </Badge>
              </div>
              <Button onClick={onProfileEdit}>
                <Settings className="w-4 h-4 mr-2" />
                프로필 수정
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 통계 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 text-primary">
                  {stat.icon}
                </div>
                <p className="text-2xl mb-1">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 설정 메뉴 */}
        <div className="space-y-4">
          <h3 className="mb-4">설정</h3>
          {menuItems.map((item) => (
            <Card
              key={item.title}
              className="hover:border-primary/40 transition-all cursor-pointer"
              onClick={item.onClick}
            >
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}