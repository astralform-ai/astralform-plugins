export interface Project {
    id: string;
    name: string;
    created_at: string;
    updated_at: string;
    api_keys_count?: number;
    llm_configured?: boolean;
}
export interface ProjectWithKey extends Project {
    encryption_key: string;
}
export interface CreateProjectInput {
    name: string;
}
export interface UpdateProjectInput {
    name: string;
}
export declare function listProjects(): Promise<Project[]>;
export declare function getProject(projectId: string): Promise<Project>;
export declare function createProject(input: CreateProjectInput): Promise<ProjectWithKey>;
export declare function updateProject(projectId: string, input: UpdateProjectInput): Promise<Project>;
export declare function deleteProject(projectId: string): Promise<void>;
