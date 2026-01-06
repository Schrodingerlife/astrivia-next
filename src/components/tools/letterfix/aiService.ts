import { AnalyzedField, EditableField } from "./types";

const extractErrorMessage = async (response: Response) => {
    try {
        const payload = await response.json();
        if (payload && typeof payload === "object" && typeof payload.error === "string") {
            return payload.error;
        }
    } catch (error) {
        console.warn("Failed to parse error response", error);
    }
    return response.statusText || "Erro desconhecido";
};

const readFileAsDataUrl = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error("Não foi possível ler o arquivo de imagem."));
        reader.readAsDataURL(file);
    });

export const analyzeImage = async (imageFile: File): Promise<AnalyzedField[]> => {
    const image = await readFileAsDataUrl(imageFile);

    const response = await fetch("/api/letterfix/analyze", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ image }),
    });

    if (!response.ok) {
        throw new Error(await extractErrorMessage(response));
    }

    const payload = await response.json();
    if (!payload || !Array.isArray(payload.fields)) {
        throw new Error("Resposta inválida da API de análise.");
    }

    return payload.fields as AnalyzedField[];
};

export const generateImage = async (data: EditableField[], imageFile: File): Promise<string> => {
    const hasChanges = data.some((field) => field.value !== field.originalValue);
    const image = await readFileAsDataUrl(imageFile);

    if (!hasChanges) {
        return image;
    }

    const response = await fetch("/api/letterfix/generate", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ image, fields: data }),
    });

    if (!response.ok) {
        throw new Error(await extractErrorMessage(response));
    }

    const payload = await response.json();
    if (!payload || typeof payload.image !== "string") {
        throw new Error("Resposta inválida da API de geração.");
    }

    return payload.image;
};
