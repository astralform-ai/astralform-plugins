import { makeAuthenticatedRequest } from "../auth.js";

export interface McpTemplate {
  id: string;
  name: string;
  description: string;
  command: string;
  args: string[];
  env_vars: string[];
}

export interface McpServer {
  id: string;
  name: string;
  command: string;
  args: string[];
  env_vars: Record<string, string>;
  is_enabled: boolean;
  created_at: string;
}

export interface AddMcpServerInput {
  name: string;
  template_id?: string;
  command?: string;
  args?: string[];
  env_vars?: Record<string, string>;
}

export interface UpdateMcpServerInput {
  env_vars?: Record<string, string>;
}

export async function listMcpTemplates(): Promise<McpTemplate[]> {
  return makeAuthenticatedRequest<McpTemplate[]>("/v1/dashboard/mcp-templates");
}

export async function listMcpServers(projectId: string): Promise<McpServer[]> {
  return makeAuthenticatedRequest<McpServer[]>(
    `/v1/dashboard/projects/${projectId}/mcp-servers`,
  );
}

export async function addMcpServer(
  projectId: string,
  input: AddMcpServerInput,
): Promise<McpServer> {
  return makeAuthenticatedRequest<McpServer>(
    `/v1/dashboard/projects/${projectId}/mcp-servers`,
    {
      method: "POST",
      body: JSON.stringify(input),
    },
  );
}

export async function updateMcpServer(
  projectId: string,
  serverId: string,
  input: UpdateMcpServerInput,
): Promise<McpServer> {
  return makeAuthenticatedRequest<McpServer>(
    `/v1/dashboard/projects/${projectId}/mcp-servers/${serverId}`,
    {
      method: "PATCH",
      body: JSON.stringify(input),
    },
  );
}

export async function toggleMcpServer(
  projectId: string,
  serverId: string,
): Promise<McpServer> {
  return makeAuthenticatedRequest<McpServer>(
    `/v1/dashboard/projects/${projectId}/mcp-servers/${serverId}/toggle`,
    {
      method: "POST",
    },
  );
}

export async function deleteMcpServer(
  projectId: string,
  serverId: string,
): Promise<void> {
  await makeAuthenticatedRequest<void>(
    `/v1/dashboard/projects/${projectId}/mcp-servers/${serverId}`,
    {
      method: "DELETE",
    },
  );
}
