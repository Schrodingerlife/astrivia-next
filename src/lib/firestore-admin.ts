import crypto from "crypto";
import { getGoogleAccessToken, getGoogleProjectId, getGoogleQuotaProject } from "@/lib/google-auth";

const CLOUD_PLATFORM_SCOPE = "https://www.googleapis.com/auth/cloud-platform";

type FirestoreValue = {
    nullValue?: null;
    stringValue?: string;
    integerValue?: string;
    doubleValue?: number;
    booleanValue?: boolean;
    timestampValue?: string;
    mapValue?: { fields: Record<string, FirestoreValue> };
    arrayValue?: { values: FirestoreValue[] };
};

function toFirestoreValue(value: unknown): FirestoreValue {
    if (value === null || value === undefined) return { nullValue: null };
    if (value instanceof Date) return { timestampValue: value.toISOString() };
    if (Array.isArray(value)) {
        return { arrayValue: { values: value.map((item) => toFirestoreValue(item)) } };
    }

    switch (typeof value) {
        case "string":
            return { stringValue: value };
        case "number":
            if (Number.isInteger(value)) return { integerValue: String(value) };
            return { doubleValue: value };
        case "boolean":
            return { booleanValue: value };
        case "object": {
            const fields: Record<string, FirestoreValue> = {};
            for (const [key, item] of Object.entries(value as Record<string, unknown>)) {
                if (item === undefined) continue;
                fields[key] = toFirestoreValue(item);
            }
            return { mapValue: { fields } };
        }
        default:
            return { stringValue: String(value) };
    }
}

function toFirestoreFields(data: Record<string, unknown>): Record<string, FirestoreValue> {
    const fields: Record<string, FirestoreValue> = {};
    for (const [key, value] of Object.entries(data)) {
        if (value === undefined) continue;
        fields[key] = toFirestoreValue(value);
    }
    return fields;
}

function collectionPath(path: string): string {
    return path
        .split("/")
        .map((part) => encodeURIComponent(part))
        .join("/");
}

export async function writeFirestoreDocument(
    collection: string,
    data: Record<string, unknown>,
    documentId?: string
): Promise<{ id: string } | null> {
    const projectId = getGoogleProjectId();
    if (!projectId) return null;

    const token = await getGoogleAccessToken([CLOUD_PLATFORM_SCOPE]);
    if (!token) return null;
    const quotaProject = getGoogleQuotaProject();

    const id = documentId || crypto.randomUUID();
    const path = collectionPath(collection);
    const endpoint = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${path}/${encodeURIComponent(id)}`;

    const response = await fetch(endpoint, {
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            ...(quotaProject ? { "x-goog-user-project": quotaProject } : {}),
        },
        body: JSON.stringify({
            fields: toFirestoreFields({
                ...data,
                updatedAt: new Date().toISOString(),
            }),
        }),
    });

    if (!response.ok) {
        const details = await response.text();
        throw new Error(`Firestore write failed: ${response.status} ${details.slice(0, 220)}`);
    }

    return { id };
}
