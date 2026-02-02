import { makeAuthenticatedRequest } from "../auth.js";
export async function listPlatformTools() {
    return makeAuthenticatedRequest("/v1/dashboard/platform-tools");
}
export async function getProjectTools(projectId) {
    return makeAuthenticatedRequest(`/v1/dashboard/projects/${projectId}/tools`);
}
export async function updateProjectTool(projectId, toolName, input) {
    return makeAuthenticatedRequest(`/v1/dashboard/projects/${projectId}/tools/${toolName}`, {
        method: "PUT",
        body: JSON.stringify(input),
    });
}
export async function deleteProjectTool(projectId, toolName) {
    await makeAuthenticatedRequest(`/v1/dashboard/projects/${projectId}/tools/${toolName}`, {
        method: "DELETE",
    });
}
