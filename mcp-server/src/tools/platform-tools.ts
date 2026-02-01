import { makeAuthenticatedRequest } from "../auth.js";

export interface PlatformTool {
  name: string;
  display_name: string;
  description: string;
  requires_api_key: boolean;
  is_enabled_by_default: boolean;
}

export interface ProjectTool {
  name: string;
  is_enabled: boolean;
  has_custom_api_key: boolean;
}

export interface UpdateToolInput {
  enabled?: boolean;
  api_key?: string;
}

export async function listPlatformTools(): Promise<PlatformTool[]> {
  return makeAuthenticatedRequest<PlatformTool[]>(
    "/v1/dashboard/platform-tools",
  );
}

export async function getProjectTools(
  projectId: string,
): Promise<ProjectTool[]> {
  return makeAuthenticatedRequest<ProjectTool[]>(
    `/v1/dashboard/projects/${projectId}/tools`,
  );
}

export async function updateProjectTool(
  projectId: string,
  toolName: string,
  input: UpdateToolInput,
): Promise<ProjectTool> {
  return makeAuthenticatedRequest<ProjectTool>(
    `/v1/dashboard/projects/${projectId}/tools/${toolName}`,
    {
      method: "PUT",
      body: JSON.stringify(input),
    },
  );
}

export async function deleteProjectTool(
  projectId: string,
  toolName: string,
): Promise<void> {
  await makeAuthenticatedRequest<void>(
    `/v1/dashboard/projects/${projectId}/tools/${toolName}`,
    {
      method: "DELETE",
    },
  );
}
