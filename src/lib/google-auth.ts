import crypto from "crypto";

interface ServiceAccount {
    type?: string;
    client_email: string;
    private_key: string;
    project_id?: string;
    token_uri?: string;
}

interface AuthorizedUser {
    type: "authorized_user";
    client_id: string;
    client_secret: string;
    refresh_token: string;
    quota_project_id?: string;
    token_uri?: string;
}

type GoogleCredentials = ServiceAccount | AuthorizedUser;

interface AccessTokenCache {
    token: string;
    expiresAt: number;
    scopeKey: string;
    identityKey: string;
}

let cachedToken: AccessTokenCache | null = null;

function base64UrlEncode(value: string): string {
    return Buffer.from(value)
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/g, "");
}

function readCredentialJson(): string | null {
    const raw =
        process.env.GOOGLE_SERVICE_ACCOUNT_JSON ||
        process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON ||
        process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

    return raw ? raw.trim() : null;
}

function parseGoogleCredentials(): GoogleCredentials | null {
    const raw = readCredentialJson();
    if (!raw) return null;

    try {
        const parsed = JSON.parse(raw) as GoogleCredentials;
        if (isServiceAccount(parsed) || isAuthorizedUser(parsed)) return parsed;
        return null;
    } catch {
        return null;
    }
}

function isServiceAccount(value: unknown): value is ServiceAccount {
    if (!value || typeof value !== "object") return false;
    const parsed = value as ServiceAccount;
    return Boolean(parsed.client_email && parsed.private_key);
}

function isAuthorizedUser(value: unknown): value is AuthorizedUser {
    if (!value || typeof value !== "object") return false;
    const parsed = value as AuthorizedUser;
    return (
        parsed.type === "authorized_user" &&
        Boolean(parsed.client_id) &&
        Boolean(parsed.client_secret) &&
        Boolean(parsed.refresh_token)
    );
}

function signJwt(unsignedToken: string, privateKey: string): string {
    const signer = crypto.createSign("RSA-SHA256");
    signer.update(unsignedToken);
    signer.end();
    const signature = signer.sign(privateKey, "base64");
    return signature.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function readProjectFromEnv(): string | null {
    const envProject = process.env.GOOGLE_CLOUD_PROJECT || process.env.GCP_PROJECT;
    const trimmed = envProject?.trim();
    return trimmed ? trimmed : null;
}

export function getGoogleProjectId(): string | null {
    const envProject = readProjectFromEnv();
    if (envProject) return envProject;

    const credentials = parseGoogleCredentials();
    if (credentials && isServiceAccount(credentials)) {
        const projectId = credentials.project_id?.trim();
        return projectId || null;
    }

    return null;
}

export function getGoogleQuotaProject(): string | null {
    const envProject = readProjectFromEnv();
    if (envProject) return envProject;

    const credentials = parseGoogleCredentials();
    if (credentials && isAuthorizedUser(credentials)) {
        const quotaProject = credentials.quota_project_id?.trim();
        return quotaProject || null;
    }

    return null;
}

async function fetchServiceAccountAccessToken(account: ServiceAccount, scopeKey: string, now: number): Promise<{
    accessToken: string;
    expiresIn: number;
}> {
    const tokenUri = (account.token_uri || "https://oauth2.googleapis.com/token").trim();
    const issuedAt = Math.floor(now / 1000);
    const expiry = issuedAt + 3600;

    const header = { alg: "RS256", typ: "JWT" };
    const payload = {
        iss: account.client_email,
        scope: scopeKey,
        aud: tokenUri,
        exp: expiry,
        iat: issuedAt,
    };

    const encodedHeader = base64UrlEncode(JSON.stringify(header));
    const encodedPayload = base64UrlEncode(JSON.stringify(payload));
    const unsignedToken = `${encodedHeader}.${encodedPayload}`;
    const signedToken = signJwt(unsignedToken, account.private_key);
    const assertion = `${unsignedToken}.${signedToken}`;

    const response = await fetch(tokenUri, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
            assertion,
        }),
    });

    if (!response.ok) {
        const details = await response.text();
        throw new Error(`OAuth token request failed: ${response.status} ${details.slice(0, 180)}`);
    }

    const data = await response.json();
    const accessToken = data?.access_token as string | undefined;
    const expiresIn = Number(data?.expires_in || 3600);

    if (!accessToken) {
        throw new Error("OAuth response returned no access_token");
    }

    return { accessToken, expiresIn };
}

async function fetchAuthorizedUserAccessToken(account: AuthorizedUser, scopeKey: string): Promise<{
    accessToken: string;
    expiresIn: number;
}> {
    const tokenUri = (account.token_uri || "https://oauth2.googleapis.com/token").trim();

    const response = await fetch(tokenUri, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            grant_type: "refresh_token",
            client_id: account.client_id,
            client_secret: account.client_secret,
            refresh_token: account.refresh_token,
            scope: scopeKey,
        }),
    });

    if (!response.ok) {
        const details = await response.text();
        throw new Error(`OAuth refresh token request failed: ${response.status} ${details.slice(0, 180)}`);
    }

    const data = await response.json();
    const accessToken = data?.access_token as string | undefined;
    const expiresIn = Number(data?.expires_in || 3600);

    if (!accessToken) {
        throw new Error("OAuth refresh response returned no access_token");
    }

    return { accessToken, expiresIn };
}

function resolveIdentityKey(credentials: GoogleCredentials): string {
    if (isServiceAccount(credentials)) return credentials.client_email;
    return credentials.client_id;
}

export async function getGoogleAccessToken(scopes: string[]): Promise<string | null> {
    const credentials = parseGoogleCredentials();
    if (!credentials) return null;

    const scopeKey = scopes.slice().sort().join(" ");
    const now = Date.now();
    const identityKey = resolveIdentityKey(credentials);

    if (
        cachedToken &&
        cachedToken.scopeKey === scopeKey &&
        cachedToken.identityKey === identityKey &&
        cachedToken.expiresAt > now + 60_000
    ) {
        return cachedToken.token;
    }

    const oauth = isServiceAccount(credentials)
        ? await fetchServiceAccountAccessToken(credentials, scopeKey, now)
        : await fetchAuthorizedUserAccessToken(credentials, scopeKey);

    cachedToken = {
        token: oauth.accessToken,
        expiresAt: now + oauth.expiresIn * 1000,
        scopeKey,
        identityKey,
    };

    return oauth.accessToken;
}
