import { makeAuthenticatedRequest, getAccessToken } from "../auth.js";

export interface Developer {
  id: string;
  email: string;
  name: string | null;
  is_admin: boolean;
  created_at: string;
}

export interface Stats {
  projects_count: number;
  api_keys_count: number;
  conversations_count: number;
  messages_count: number;
}

export async function whoami(): Promise<Developer> {
  return makeAuthenticatedRequest<Developer>("/v1/dashboard/me");
}

export async function getStats(): Promise<Stats> {
  return makeAuthenticatedRequest<Stats>("/v1/dashboard/stats");
}

export async function isAuthenticated(): Promise<boolean> {
  const token = await getAccessToken();
  return token !== null;
}
