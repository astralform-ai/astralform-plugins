import { makeAuthenticatedRequest } from "../auth.js";

export interface LlmProvider {
  id: string;
  name: string;
  tier: "platform" | "byok";
  requires_api_key: boolean;
  models: LlmModel[];
}

export interface LlmModel {
  id: string;
  name: string;
  context_window: number;
  supports_vision: boolean;
  supports_tools: boolean;
}

export interface LlmConfig {
  id: string;
  provider: string;
  tier: string;
  model_name: string;
  base_url: string | null;
  has_api_key: boolean;
}

export interface SetLlmConfigInput {
  provider: string;
  model: string;
  api_key?: string;
  base_url?: string;
}

export async function listLlmProviders(): Promise<LlmProvider[]> {
  return makeAuthenticatedRequest<LlmProvider[]>("/v1/dashboard/llm-providers");
}

export async function getLlmConfig(
  projectId: string,
): Promise<LlmConfig | null> {
  try {
    return await makeAuthenticatedRequest<LlmConfig>(
      `/v1/dashboard/projects/${projectId}/llm-config`,
    );
  } catch (error) {
    if (error instanceof Error && error.message.includes("404")) {
      return null;
    }
    throw error;
  }
}

export async function setLlmConfig(
  projectId: string,
  input: SetLlmConfigInput,
): Promise<LlmConfig> {
  return makeAuthenticatedRequest<LlmConfig>(
    `/v1/dashboard/projects/${projectId}/llm-config`,
    {
      method: "PUT",
      body: JSON.stringify(input),
    },
  );
}

export async function deleteLlmConfig(projectId: string): Promise<void> {
  await makeAuthenticatedRequest<void>(
    `/v1/dashboard/projects/${projectId}/llm-config`,
    {
      method: "DELETE",
    },
  );
}
