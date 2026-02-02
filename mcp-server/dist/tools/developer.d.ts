export interface Developer {
    id: string;
    email: string;
    name: string | null;
    is_admin: boolean;
    created_at: string;
}
export interface Stats {
    projects_count: number;
    api_keys_count: number;
    conversations_count: number;
    messages_count: number;
}
export declare function whoami(): Promise<Developer>;
export declare function getStats(): Promise<Stats>;
export declare function isAuthenticated(): Promise<boolean>;
