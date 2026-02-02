import { makeAuthenticatedRequest } from "../auth.js";
export async function listLlmProviders() {
    return makeAuthenticatedRequest("/v1/dashboard/llm-providers");
}
export async function getLlmConfig(projectId) {
    try {
        return await makeAuthenticatedRequest(`/v1/dashboard/projects/${projectId}/llm-config`);
    }
    catch (error) {
        if (error instanceof Error && error.message.includes("404")) {
            return null;
        }
        throw error;
    }
}
export async function setLlmConfig(projectId, input) {
    return makeAuthenticatedRequest(`/v1/dashboard/projects/${projectId}/llm-config`, {
        method: "PUT",
        body: JSON.stringify(input),
    });
}
export async function deleteLlmConfig(projectId) {
    await makeAuthenticatedRequest(`/v1/dashboard/projects/${projectId}/llm-config`, {
        method: "DELETE",
    });
}
