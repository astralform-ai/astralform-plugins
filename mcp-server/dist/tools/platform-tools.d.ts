export interface PlatformTool {
    name: string;
    display_name: string;
    description: string;
    requires_api_key: boolean;
    is_enabled_by_default: boolean;
}
export interface ProjectTool {
    name: string;
    is_enabled: boolean;
    has_custom_api_key: boolean;
}
export interface UpdateToolInput {
    enabled?: boolean;
    api_key?: string;
}
export declare function listPlatformTools(): Promise<PlatformTool[]>;
export declare function getProjectTools(projectId: string): Promise<ProjectTool[]>;
export declare function updateProjectTool(projectId: string, toolName: string, input: UpdateToolInput): Promise<ProjectTool>;
export declare function deleteProjectTool(projectId: string, toolName: string): Promise<void>;
