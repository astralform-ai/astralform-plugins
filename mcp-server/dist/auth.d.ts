export interface Credentials {
    access_token: string;
    refresh_token: string;
    expires_at: number;
    token_type: string;
}
export interface DeviceCodeResponse {
    device_code: string;
    user_code: string;
    verification_uri: string;
    verification_uri_complete: string;
    expires_in: number;
    interval: number;
}
export interface TokenResponse {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    token_type: string;
}
export declare function getApiUrl(): string;
export declare function loadCredentials(): Promise<Credentials | null>;
export declare function saveCredentials(creds: Credentials): Promise<void>;
export declare function clearCredentials(): Promise<void>;
export declare function getAccessToken(): Promise<string | null>;
export declare function requestDeviceCode(): Promise<DeviceCodeResponse>;
export declare function pollForToken(deviceCode: string, interval: number): Promise<TokenResponse | "pending" | "expired" | "denied">;
export declare function refreshAccessToken(refreshToken: string): Promise<Credentials | null>;
export declare function makeAuthenticatedRequest<T>(path: string, options?: RequestInit): Promise<T>;
