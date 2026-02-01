import { makeAuthenticatedRequest } from "../auth.js";

export interface Project {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  api_keys_count?: number;
  llm_configured?: boolean;
}

export interface ProjectWithKey extends Project {
  encryption_key: string;
}

export interface CreateProjectInput {
  name: string;
}

export interface UpdateProjectInput {
  name: string;
}

export async function listProjects(): Promise<Project[]> {
  return makeAuthenticatedRequest<Project[]>("/v1/dashboard/projects");
}

export async function getProject(projectId: string): Promise<Project> {
  return makeAuthenticatedRequest<Project>(
    `/v1/dashboard/projects/${projectId}`,
  );
}

export async function createProject(
  input: CreateProjectInput,
): Promise<ProjectWithKey> {
  return makeAuthenticatedRequest<ProjectWithKey>("/v1/dashboard/projects", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function updateProject(
  projectId: string,
  input: UpdateProjectInput,
): Promise<Project> {
  return makeAuthenticatedRequest<Project>(
    `/v1/dashboard/projects/${projectId}`,
    {
      method: "PATCH",
      body: JSON.stringify(input),
    },
  );
}

export async function deleteProject(projectId: string): Promise<void> {
  await makeAuthenticatedRequest<void>(`/v1/dashboard/projects/${projectId}`, {
    method: "DELETE",
  });
}
