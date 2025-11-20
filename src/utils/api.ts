// src/utils/api.ts
// Supabase 의존성 제거 + Node 서버(http://localhost:4000/api) 기준으로 재구성

const API_BASE_URL = "http://localhost:4000/api";

// ===============================
// Auth Token (세션 토큰)
// ===============================

// 세션 스토리지에서 토큰 가져오기
function getAuthToken(): string | null {
  return sessionStorage.getItem("cooking_assistant_auth_token");
}

// 세션 스토리지에 토큰 저장
export function setAuthToken(token: string) {
  sessionStorage.setItem("cooking_assistant_auth_token", token);
}

// 토큰 제거
export function removeAuthToken() {
  sessionStorage.removeItem("cooking_assistant_auth_token");
}

// ===============================
// 공통 API 호출 함수
// ===============================
async function apiCall(
    endpoint: string,
    options: RequestInit = {},
    requiresAuth: boolean = false
) {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (requiresAuth) {
    const token = getAuthToken();
    if (!token) {
      throw new Error("로그인이 필요합니다.");
    }
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // JSON 파싱 시도 (body가 비어있을 수도 있어서 예외 처리)
  const data = await response
      .json()
      .catch(() => ({} as any));

  if (!response.ok) {
    throw new Error(
        (data && (data.error || data.message)) || "API 요청 실패"
    );
  }

  return data;
}

// ===============================
// AUTH API
// ===============================

// 회원가입: POST /api/signup
export async function signUp(email: string, password: string, name: string) {
  return apiCall("/signup", {
    method: "POST",
    body: JSON.stringify({ email, password, name }),
  });
}

// 로그인: POST /api/login
export async function login(email: string, password: string) {
  return apiCall("/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

// ===============================
// PROFILE API ( /api/profile )
// ===============================

export async function getProfile() {
  return apiCall("/profile", {}, true);
}

export async function updateProfile(profileData: any) {
  return apiCall(
      "/profile",
      {
        method: "PUT",
        body: JSON.stringify(profileData),
      },
      true
  );
}

// ===============================
// INGREDIENTS API ( /api/ingredients )
// ===============================

// 재료 목록 조회
export async function getIngredients() {
  const res = await apiCall("/ingredients", {}, true);
  // 백엔드: { success, count, data: [...] }
  // 프론트가 기대: { ingredients: [...] }
  return {
    ingredients: res.data || res.ingredients || [],
  };
}

// 재료 추가
export async function addIngredient(ingredientData: any) {
  const res = await apiCall(
      "/ingredients",
      {
        method: "POST",
        body: JSON.stringify(ingredientData),
      },
      true
  );
  // 백엔드: { success, data: ingredient }
  return {
    ingredient: res.data || res.ingredient,
  };
}

// 재료 수정
export async function updateIngredient(id: string, ingredientData: any) {
  const res = await apiCall(
      `/ingredients/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(ingredientData),
      },
      true
  );
  return {
    ingredient: res.data || res.ingredient,
  };
}

// 재료 삭제
export async function deleteIngredient(id: string) {
  return apiCall(
      `/ingredients/${id}`,
      {
        method: "DELETE",
      },
      true
  );
}

// ===============================
// SAVED RECIPES API ( /api/saved-recipes )
// ===============================

export async function getSavedRecipes() {
  const res = await apiCall("/saved-recipes", {}, true);
  return {
    savedRecipes: res.data || res.savedRecipes || [],
  };
}

export async function saveRecipe(recipeData: any) {
  const res = await apiCall(
      "/saved-recipes",
      {
        method: "POST",
        body: JSON.stringify(recipeData),
      },
      true
  );
  return {
    savedRecipe: res.data || res.savedRecipe,
  };
}

export async function removeSavedRecipe(id: string) {
  return apiCall(
      `/saved-recipes/${id}`,
      {
        method: "DELETE",
      },
      true
  );
}

// ===============================
// HEALTH CHECK ( /api/health )
// ===============================

export async function healthCheck() {
  return apiCall("/health");
}

// ===============================
// AI VOICE ( /api/ai/voice/stt, tts )
// ===============================

export async function speechToText(
    audioBlob: Blob,
    currentStep?: string,
    recipeName?: string
) {
  const formData = new FormData();
  formData.append("audio", audioBlob);
  if (currentStep) formData.append("currentStep", currentStep);
  if (recipeName) formData.append("recipeName", recipeName);

  const headers: HeadersInit = {};
  const token = getAuthToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/ai/voice/stt`, {
    method: "POST",
    body: formData,
    headers,
  });

  const data = await response.json().catch(() => ({} as any));

  if (!response.ok) {
    throw new Error(
        (data && (data.error || data.message)) || "STT API 요청 실패"
    );
  }

  return data;
}

export async function textToSpeech(text: string) {
  return apiCall(
      "/ai/voice/tts",
      {
        method: "POST",
        body: JSON.stringify({ text }),
      },
      true
  );
}
