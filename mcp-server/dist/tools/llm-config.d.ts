export interface LlmProvider {
    id: string;
    name: string;
    tier: "platform" | "byok";
    requires_api_key: boolean;
    models: LlmModel[];
}
export interface LlmModel {
    id: string;
    name: string;
    context_window: number;
    supports_vision: boolean;
    supports_tools: boolean;
}
export interface LlmConfig {
    id: string;
    provider: string;
    tier: string;
    model_name: string;
    base_url: string | null;
    has_api_key: boolean;
}
export interface SetLlmConfigInput {
    provider: string;
    model: string;
    api_key?: string;
    base_url?: string;
}
export declare function listLlmProviders(): Promise<LlmProvider[]>;
export declare function getLlmConfig(projectId: string): Promise<LlmConfig | null>;
export declare function setLlmConfig(projectId: string, input: SetLlmConfigInput): Promise<LlmConfig>;
export declare function deleteLlmConfig(projectId: string): Promise<void>;
