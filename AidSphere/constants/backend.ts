import { Platform } from 'react-native';
import Constants from 'expo-constants';

const extra = (Constants as any)?.expoConfig?.extra;
const envUrl = (process && (process.env as any) && ((process.env.EXPO_PUBLIC_API_URL) || (process.env.API_URL))) || null;

const inferred = envUrl || (extra && (extra.API_URL || extra.apiUrl)) || null;

export const BACKEND_URL = ((): string => {
  if (inferred) return inferred;
  // Android emulator's special host mapping
  if (Platform.OS === 'android') return 'http://10.0.2.2:3000';
  // Default for iOS simulator / web / desktop
  return 'http://localhost:3000';
})();

export async function apiFetch(input: string, init?: RequestInit) {
  // If caller passed an absolute URL, use it directly
  if (input.startsWith('http')) {
    return fetch(input, init as any);
  }

  // Normalize joining BACKEND_URL and the provided path to avoid duplicates
  const base = BACKEND_URL.replace(/\/+$|\s+$/g, '');
  const path = String(input).replace(/^\/+/, '');
  const url = `${base}/${path}`;

  // Forward options directly to fetch. Caller may pass FormData for multipart.
  const resp = await fetch(url, init as any);
  return resp;
}

export default BACKEND_URL;
