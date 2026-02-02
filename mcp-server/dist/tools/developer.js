import { makeAuthenticatedRequest, getAccessToken } from "../auth.js";
export async function whoami() {
    return makeAuthenticatedRequest("/v1/dashboard/me");
}
export async function getStats() {
    return makeAuthenticatedRequest("/v1/dashboard/stats");
}
export async function isAuthenticated() {
    const token = await getAccessToken();
    return token !== null;
}
