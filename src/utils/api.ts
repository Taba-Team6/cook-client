import { projectId, publicAnonKey } from './supabase/info';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-50b891bd`;

// Get auth token from session storage
function getAuthToken(): string | null {
  return sessionStorage.getItem('cooking_assistant_auth_token');
}

// Set auth token to session storage
export function setAuthToken(token: string) {
  sessionStorage.setItem('cooking_assistant_auth_token', token);
}

// Remove auth token from session storage
export function removeAuthToken() {
  sessionStorage.removeItem('cooking_assistant_auth_token');
}

// Generic API call function
async function apiCall(
  endpoint: string,
  options: RequestInit = {},
  requiresAuth = false
) {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (requiresAuth) {
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    } else {
      headers['Authorization'] = `Bearer ${publicAnonKey}`;
    }
  } else {
    headers['Authorization'] = `Bearer ${publicAnonKey}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
}

// ============================================
// AUTH API
// ============================================

export async function signUp(email: string, password: string, name: string) {
  return apiCall('/signup', {
    method: 'POST',
    body: JSON.stringify({ email, password, name }),
  });
}

// ============================================
// PROFILE API
// ============================================

export async function getProfile() {
  return apiCall('/profile', {}, true);
}

export async function updateProfile(profileData: any) {
  return apiCall('/profile', {
    method: 'PUT',
    body: JSON.stringify(profileData),
  }, true);
}

// ============================================
// INGREDIENTS API
// ============================================

export async function getIngredients() {
  return apiCall('/ingredients', {}, true);
}

export async function addIngredient(ingredientData: any) {
  return apiCall('/ingredients', {
    method: 'POST',
    body: JSON.stringify(ingredientData),
  }, true);
}

export async function updateIngredient(id: string, ingredientData: any) {
  return apiCall(`/ingredients/${id}`, {
    method: 'PUT',
    body: JSON.stringify(ingredientData),
  }, true);
}

export async function deleteIngredient(id: string) {
  return apiCall(`/ingredients/${id}`, {
    method: 'DELETE',
  }, true);
}

// ============================================
// SAVED RECIPES API
// ============================================

export async function getSavedRecipes() {
  return apiCall('/saved-recipes', {}, true);
}

export async function saveRecipe(recipeData: any) {
  return apiCall('/saved-recipes', {
    method: 'POST',
    body: JSON.stringify(recipeData),
  }, true);
}

export async function removeSavedRecipe(id: string) {
  return apiCall(`/saved-recipes/${id}`, {
    method: 'DELETE',
  }, true);
}

// ============================================
// HEALTH CHECK
// ============================================

export async function healthCheck() {
  return apiCall('/health');
}

// ============================================
// AI VOICE ASSISTANT API
// ============================================

export async function speechToText(audioBlob: Blob, currentStep?: string, recipeName?: string) {
  const formData = new FormData();
  formData.append('audio', audioBlob);
  if (currentStep) formData.append('currentStep', currentStep);
  if (recipeName) formData.append('recipeName', recipeName);

  const headers: HeadersInit = {};
  const token = sessionStorage.getItem('cooking_assistant_auth_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  } else {
    headers['Authorization'] = `Bearer ${publicAnonKey}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/ai/voice/stt`, {
      method: 'POST',
      headers,
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Speech to text failed');
    }

    return data;
  } catch (error) {
    console.error('STT API Error:', error);
    throw error;
  }
}

export async function textToSpeech(text: string) {
  return apiCall('/ai/voice/tts', {
    method: 'POST',
    body: JSON.stringify({ text }),
  }, true);
}