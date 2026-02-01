import { readFile, writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import { homedir } from "os";
import { join } from "path";

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

const CREDENTIALS_DIR = join(homedir(), ".astralform");
const CREDENTIALS_FILE = join(CREDENTIALS_DIR, "credentials.json");

export function getApiUrl(): string {
  return process.env.ASTRALFORM_API_URL || "https://api.astralform.dev";
}

export async function loadCredentials(): Promise<Credentials | null> {
  try {
    if (!existsSync(CREDENTIALS_FILE)) {
      return null;
    }
    const data = await readFile(CREDENTIALS_FILE, "utf-8");
    return JSON.parse(data) as Credentials;
  } catch {
    return null;
  }
}

export async function saveCredentials(creds: Credentials): Promise<void> {
  if (!existsSync(CREDENTIALS_DIR)) {
    await mkdir(CREDENTIALS_DIR, { recursive: true, mode: 0o700 });
  }
  await writeFile(CREDENTIALS_FILE, JSON.stringify(creds, null, 2), {
    mode: 0o600,
  });
}

export async function clearCredentials(): Promise<void> {
  try {
    if (existsSync(CREDENTIALS_FILE)) {
      const { unlink } = await import("fs/promises");
      await unlink(CREDENTIALS_FILE);
    }
  } catch {
    // Ignore errors
  }
}

export async function getAccessToken(): Promise<string | null> {
  const creds = await loadCredentials();
  if (!creds) {
    return null;
  }

  // Check if token is expired (with 5 minute buffer)
  const now = Date.now() / 1000;
  if (creds.expires_at && creds.expires_at - 300 < now) {
    // Try to refresh
    const refreshed = await refreshAccessToken(creds.refresh_token);
    if (refreshed) {
      return refreshed.access_token;
    }
    return null;
  }

  return creds.access_token;
}

export async function requestDeviceCode(): Promise<DeviceCodeResponse> {
  const apiUrl = getApiUrl();
  const response = await fetch(`${apiUrl}/v1/auth/device`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: "claude-code-plugin",
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to request device code: ${error}`);
  }

  return response.json();
}

export async function pollForToken(
  deviceCode: string,
  interval: number,
): Promise<TokenResponse | "pending" | "expired" | "denied"> {
  const apiUrl = getApiUrl();
  const response = await fetch(`${apiUrl}/v1/auth/device/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      device_code: deviceCode,
      client_id: "claude-code-plugin",
      grant_type: "urn:ietf:params:oauth:grant-type:device_code",
    }),
  });

  if (response.status === 400) {
    const data = await response.json();
    if (data.error === "authorization_pending") {
      return "pending";
    }
    if (data.error === "expired_token") {
      return "expired";
    }
    if (data.error === "access_denied") {
      return "denied";
    }
    throw new Error(`Token error: ${data.error}`);
  }

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to get token: ${error}`);
  }

  const tokenData: TokenResponse = await response.json();

  // Save credentials
  const creds: Credentials = {
    access_token: tokenData.access_token,
    refresh_token: tokenData.refresh_token,
    expires_at: Date.now() / 1000 + tokenData.expires_in,
    token_type: tokenData.token_type,
  };
  await saveCredentials(creds);

  return tokenData;
}

export async function refreshAccessToken(
  refreshToken: string,
): Promise<Credentials | null> {
  const apiUrl = getApiUrl();
  try {
    const response = await fetch(`${apiUrl}/v1/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      }),
    });

    if (!response.ok) {
      await clearCredentials();
      return null;
    }

    const data: TokenResponse = await response.json();
    const creds: Credentials = {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_at: Date.now() / 1000 + data.expires_in,
      token_type: data.token_type,
    };
    await saveCredentials(creds);
    return creds;
  } catch {
    return null;
  }
}

export async function makeAuthenticatedRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = await getAccessToken();
  if (!token) {
    throw new Error(
      "Not authenticated. Run /astralform-login to authenticate.",
    );
  }

  const apiUrl = getApiUrl();
  const response = await fetch(`${apiUrl}${path}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (response.status === 401) {
    await clearCredentials();
    throw new Error(
      "Session expired. Run /astralform-login to re-authenticate.",
    );
  }

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API error (${response.status}): ${error}`);
  }

  return response.json();
}
