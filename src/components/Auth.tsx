// src/components/Auth.tsx
import { useState, FormEvent } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ChefHat, Mail, Lock, User } from "lucide-react";

import { signUp, login, setAuthToken } from "../utils/api";

interface AuthProps {
  onAuthSuccess: (userName: string) => void;
}

export function Auth({ onAuthSuccess }: AuthProps) {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");

  // 로그인 폼 상태
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // 회원가입 폼 상태
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  // 공통: 현재 유저 정보 localStorage 저장
  const saveCurrentUser = (id: string, email: string, name: string) => {
    const user = { id, email, name };
    localStorage.setItem(
        "cooking_assistant_current_user",
        JSON.stringify(user)
    );
  };

  // ===========================
  // 로그인 처리
  // ===========================
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!loginEmail || !loginPassword) {
      setError("이메일과 비밀번호를 입력해주세요");
      return;
    }

    setLoading(true);
    try {
      const result = await login(loginEmail, loginPassword);
      // 백엔드 형식: { success: boolean, data: { id, name, email, token }, error? }
      if (!result.success) {
        setError(result.error || "이메일 또는 비밀번호가 일치하지 않습니다");
        setLoading(false);
        return;
      }

      const { id, name, email, token } = result.data;
      const userName = name || (email ? email.split("@")[0] : "사용자");

      // JWT 토큰 저장 (sessionStorage)
      setAuthToken(token);

      // 유저 정보 localStorage 저장 (App.tsx 에서 읽음)
      saveCurrentUser(id, email, userName);

      // 상위(App)에 로그인 성공 알림
      onAuthSuccess(userName);
      setLoading(false);
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "로그인 중 오류가 발생했습니다");
      setLoading(false);
    }
  };

  // ===========================
  // 회원가입 처리
  // ===========================
  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!signupName || !signupEmail || !signupPassword || !signupConfirmPassword) {
      setError("모든 필드를 입력해주세요");
      return;
    }

    if (signupPassword.length < 6) {
      setError("비밀번호는 최소 6자 이상이어야 합니다");
      return;
    }

    if (signupPassword !== signupConfirmPassword) {
      setError("비밀번호가 일치하지 않습니다");
      return;
    }

    setLoading(true);
    try {
      const result = await signUp(signupEmail, signupPassword, signupName);
      // 백엔드 형식: { success, data: { id, name, email, token }, error? }
      if (!result.success) {
        setError(result.error || "회원가입에 실패했습니다");
        setLoading(false);
        return;
      }

      const { id, name, email, token } = result.data;
      const userName = name || (email ? email.split("@")[0] : signupName);

      // 회원가입 후 바로 로그인 상태로 전환
      setAuthToken(token);
      saveCurrentUser(id, email, userName);
      onAuthSuccess(userName);

      setLoading(false);
    } catch (err: any) {
      console.error("Signup error:", err);
      setError(err.message || "회원가입 중 오류가 발생했습니다");
      setLoading(false);
    }
  };

  return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-background">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <ChefHat className="w-10 h-10 text-primary-foreground" />
            </div>
            <h1 className="mb-2">쿠킹 어시스턴트</h1>
            <p className="text-muted-foreground">
              AI가 도와주는 맞춤형 요리 가이드
            </p>
          </div>

          <Tabs
              value={activeTab}
              onValueChange={(v) => setActiveTab(v as "login" | "signup")}
          >
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">로그인</TabsTrigger>
              <TabsTrigger value="signup">회원가입</TabsTrigger>
            </TabsList>

            {/* 로그인 탭 */}
            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>로그인</CardTitle>
                  <CardDescription>
                    저장된 레시피와 나만의 요리 기록을 확인하세요
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">이메일</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="login-email"
                            type="email"
                            placeholder="you@example.com"
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                            className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="login-password">비밀번호</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="login-password"
                            type="password"
                            placeholder="••••••••"
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            className="pl-10"
                        />
                      </div>
                    </div>

                    {error && activeTab === "login" && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                          {error}
                        </div>
                    )}

                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "로그인 중..." : "로그인"}
                    </Button>

                    <div className="text-center text-sm text-muted-foreground">
                      아직 계정이 없으신가요?{" "}
                      <button
                          type="button"
                          onClick={() => {
                            setError("");
                            setActiveTab("signup");
                          }}
                          className="text-primary hover:underline"
                      >
                        회원가입
                      </button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 회원가입 탭 */}
            <TabsContent value="signup">
              <Card>
                <CardHeader>
                  <CardTitle>회원가입</CardTitle>
                  <CardDescription>
                    새 계정을 만들어 요리 여정을 시작하세요
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name">이름</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="signup-name"
                            type="text"
                            placeholder="홍길동"
                            value={signupName}
                            onChange={(e) => setSignupName(e.target.value)}
                            className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-email">이메일</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="signup-email"
                            type="email"
                            placeholder="you@example.com"
                            value={signupEmail}
                            onChange={(e) => setSignupEmail(e.target.value)}
                            className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-password">비밀번호</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="signup-password"
                            type="password"
                            placeholder="최소 6자 이상"
                            value={signupPassword}
                            onChange={(e) => setSignupPassword(e.target.value)}
                            className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-confirm-password">비밀번호 확인</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="signup-confirm-password"
                            type="password"
                            placeholder="비밀번호를 한 번 더 입력해주세요"
                            value={signupConfirmPassword}
                            onChange={(e) =>
                                setSignupConfirmPassword(e.target.value)
                            }
                            className="pl-10"
                        />
                      </div>
                    </div>

                    {error && activeTab === "signup" && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                          {error}
                        </div>
                    )}

                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "가입 중..." : "회원가입"}
                    </Button>

                    <div className="text-center text-sm text-muted-foreground">
                      이미 계정이 있으신가요?{" "}
                      <button
                          type="button"
                          onClick={() => {
                            setError("");
                            setActiveTab("login");
                          }}
                          className="text-primary hover:underline"
                      >
                        로그인
                      </button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground">
              회원가입을 진행하면 서비스 이용약관 및 개인정보 처리방침에
              동의하는 것으로 간주됩니다
            </p>
          </div>
        </div>
      </div>
  );
}
