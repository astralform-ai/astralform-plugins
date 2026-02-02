import { makeAuthenticatedRequest } from "../auth.js";
export async function listProjects() {
    return makeAuthenticatedRequest("/v1/dashboard/projects");
}
export async function getProject(projectId) {
    return makeAuthenticatedRequest(`/v1/dashboard/projects/${projectId}`);
}
export async function createProject(input) {
    return makeAuthenticatedRequest("/v1/dashboard/projects", {
        method: "POST",
        body: JSON.stringify(input),
    });
}
export async function updateProject(projectId, input) {
    return makeAuthenticatedRequest(`/v1/dashboard/projects/${projectId}`, {
        method: "PATCH",
        body: JSON.stringify(input),
    });
}
export async function deleteProject(projectId) {
    await makeAuthenticatedRequest(`/v1/dashboard/projects/${projectId}`, {
        method: "DELETE",
    });
}
