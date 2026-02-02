import { makeAuthenticatedRequest } from "../auth.js";
export async function listMcpTemplates() {
    return makeAuthenticatedRequest("/v1/dashboard/mcp-templates");
}
export async function listMcpServers(projectId) {
    return makeAuthenticatedRequest(`/v1/dashboard/projects/${projectId}/mcp-servers`);
}
export async function addMcpServer(projectId, input) {
    return makeAuthenticatedRequest(`/v1/dashboard/projects/${projectId}/mcp-servers`, {
        method: "POST",
        body: JSON.stringify(input),
    });
}
export async function updateMcpServer(projectId, serverId, input) {
    return makeAuthenticatedRequest(`/v1/dashboard/projects/${projectId}/mcp-servers/${serverId}`, {
        method: "PATCH",
        body: JSON.stringify(input),
    });
}
export async function toggleMcpServer(projectId, serverId) {
    return makeAuthenticatedRequest(`/v1/dashboard/projects/${projectId}/mcp-servers/${serverId}/toggle`, {
        method: "POST",
    });
}
export async function deleteMcpServer(projectId, serverId) {
    await makeAuthenticatedRequest(`/v1/dashboard/projects/${projectId}/mcp-servers/${serverId}`, {
        method: "DELETE",
    });
}
