import { makeAuthenticatedRequest } from "../auth.js";
export async function listApiKeys(projectId) {
    return makeAuthenticatedRequest(`/v1/dashboard/projects/${projectId}/api-keys`);
}
export async function createApiKey(projectId, input) {
    return makeAuthenticatedRequest(`/v1/dashboard/projects/${projectId}/api-keys`, {
        method: "POST",
        body: JSON.stringify(input),
    });
}
export async function revokeApiKey(projectId, keyId) {
    await makeAuthenticatedRequest(`/v1/dashboard/projects/${projectId}/api-keys/${keyId}`, {
        method: "DELETE",
    });
}
