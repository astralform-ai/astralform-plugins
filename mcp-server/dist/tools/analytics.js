import { makeAuthenticatedRequest } from "../auth.js";
export async function getAnalytics(projectId, input) {
    const params = new URLSearchParams();
    if (input?.start_date)
        params.append("start_date", input.start_date);
    if (input?.end_date)
        params.append("end_date", input.end_date);
    const queryString = params.toString();
    const path = `/v1/dashboard/projects/${projectId}/analytics${queryString ? `?${queryString}` : ""}`;
    return makeAuthenticatedRequest(path);
}
