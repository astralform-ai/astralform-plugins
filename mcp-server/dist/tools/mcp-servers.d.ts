export interface McpTemplate {
    id: string;
    name: string;
    description: string;
    command: string;
    args: string[];
    env_vars: string[];
}
export interface McpServer {
    id: string;
    name: string;
    command: string;
    args: string[];
    env_vars: Record<string, string>;
    is_enabled: boolean;
    created_at: string;
}
export interface AddMcpServerInput {
    name: string;
    template_id?: string;
    command?: string;
    args?: string[];
    env_vars?: Record<string, string>;
}
export interface UpdateMcpServerInput {
    env_vars?: Record<string, string>;
}
export declare function listMcpTemplates(): Promise<McpTemplate[]>;
export declare function listMcpServers(projectId: string): Promise<McpServer[]>;
export declare function addMcpServer(projectId: string, input: AddMcpServerInput): Promise<McpServer>;
export declare function updateMcpServer(projectId: string, serverId: string, input: UpdateMcpServerInput): Promise<McpServer>;
export declare function toggleMcpServer(projectId: string, serverId: string): Promise<McpServer>;
export declare function deleteMcpServer(projectId: string, serverId: string): Promise<void>;
