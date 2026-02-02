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
export declare function getAnalytics(projectId: string, input?: GetAnalyticsInput): Promise<AnalyticsData>;
