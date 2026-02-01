import { makeAuthenticatedRequest } from "../auth.js";

export interface AnalyticsData {
  period: {
    start_date: string;
    end_date: string;
  };
  totals: {
    conversations: number;
    messages: number;
    input_tokens: number;
    output_tokens: number;
    total_tokens: number;
    tool_calls: number;
  };
  daily: DailyStats[];
  tool_usage: ToolUsageStats[];
}

export interface DailyStats {
  date: string;
  conversations: number;
  messages: number;
  tokens: number;
}

export interface ToolUsageStats {
  tool_name: string;
  call_count: number;
}

export interface GetAnalyticsInput {
  start_date?: string;
  end_date?: string;
}

export async function getAnalytics(
  projectId: string,
  input?: GetAnalyticsInput,
): Promise<AnalyticsData> {
  const params = new URLSearchParams();
  if (input?.start_date) params.append("start_date", input.start_date);
  if (input?.end_date) params.append("end_date", input.end_date);

  const queryString = params.toString();
  const path = `/v1/dashboard/projects/${projectId}/analytics${
    queryString ? `?${queryString}` : ""
  }`;

  return makeAuthenticatedRequest<AnalyticsData>(path);
}
