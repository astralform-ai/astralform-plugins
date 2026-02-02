export interface ApiKey {
    id: string;
    name: string;
    prefix: string;
    rate_limit: number;
    is_active: boolean;
    last_used_at: string | null;
    created_at: string;
}
export interface ApiKeyWithSecret extends ApiKey {
    full_key: string;
}
export interface CreateApiKeyInput {
    name: string;
    environment?: "development" | "production";
}
export declare function listApiKeys(projectId: string): Promise<ApiKey[]>;
export declare function createApiKey(projectId: string, input: CreateApiKeyInput): Promise<ApiKeyWithSecret>;
export declare function revokeApiKey(projectId: string, keyId: string): Promise<void>;
