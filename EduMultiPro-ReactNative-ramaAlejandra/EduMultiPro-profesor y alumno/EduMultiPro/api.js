import { Platform } from "react-native";
import Constants from "expo-constants";

const getBaseURL = () => {
  // 🔹 Si tienes configurada una variable de entorno
  if (process.env.BACKEND_URL) {
    return process.env.BACKEND_URL;
  }

  // 🔹 Si corres desde Expo Go detecta la IP automáticamente
  if (Constants.expoConfig?.hostUri) {
    const ip = Constants.expoConfig.hostUri.split(":")[0]; 
    return `http://${ip}:3000/api/edumultipro`;
  }

  // 🔹 Fallback por defecto (localhost)
  return "http://localhost:3000/api/edumultipro";
};

// 👉 URL completa para API
const BASE_URL = getBaseURL();

// 👉 URL base sin /api/edumultipro (para imágenes y estáticos)
export const STATIC_URL = BASE_URL.replace("/api/edumultipro", "");

// 👇 Helper para fetch
export async function apiFetch(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  return fetch(url, options);
}