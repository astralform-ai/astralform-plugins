import { makeAuthenticatedRequest } from "../auth.js";

export interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  rate_limit: number;
  is_active: boolean;
  last_used_at: string | null;
  created_at: string;
}

export interface ApiKeyWithSecret extends ApiKey {
  full_key: string;
}

export interface CreateApiKeyInput {
  name: string;
  environment?: "development" | "production";
}

export async function listApiKeys(projectId: string): Promise<ApiKey[]> {
  return makeAuthenticatedRequest<ApiKey[]>(
    `/v1/dashboard/projects/${projectId}/api-keys`,
  );
}

export async function createApiKey(
  projectId: string,
  input: CreateApiKeyInput,
): Promise<ApiKeyWithSecret> {
  return makeAuthenticatedRequest<ApiKeyWithSecret>(
    `/v1/dashboard/projects/${projectId}/api-keys`,
    {
      method: "POST",
      body: JSON.stringify(input),
    },
  );
}

export async function revokeApiKey(
  projectId: string,
  keyId: string,
): Promise<void> {
  await makeAuthenticatedRequest<void>(
    `/v1/dashboard/projects/${projectId}/api-keys/${keyId}`,
    {
      method: "DELETE",
    },
  );
}
