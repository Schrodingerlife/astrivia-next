import { useState, useCallback } from 'react';

export type RiskLevel = "grave" | "moderada" | "leve";

export interface Violation {
    id: number;
    tipo: RiskLevel;
    texto: string;
    trecho: string;
    artigo: string;
    sugestao: string;
    sugestao_reescrita?: string;
}

export interface AnalysisResult {
    score: number;
    resumo: string;
    tempoAnalise: number;
    violacoes: Violation[];
    retrievalCount?: number;
    analysisId?: string | null;
    referencias?: Array<{
        docId: string;
        title: string;
        trecho: string;
        uri?: string;
    }>;
}

const TEXT_MIME_TYPES = new Set(["text/plain", "text/markdown", "text/csv", "application/csv"]);
const OCR_MIME_TYPES = new Set([
    "application/pdf",
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/bmp",
    "image/tiff",
]);

export function useMedsafe() {
    const [text, setText] = useState("");
    const [fileName, setFileName] = useState<string | null>(null);
    const [isExtracting, setIsExtracting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<AnalysisResult | null>(null);

    const handleUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        event.target.value = "";
        setFileName(file.name);
        setError(null);

        const isText = TEXT_MIME_TYPES.has(file.type) || /\.(txt|md|csv)$/i.test(file.name);
        const isOcr = OCR_MIME_TYPES.has(file.type) || /\.(pdf|jpe?g|png|webp|gif|bmp|tiff?)$/i.test(file.name);

        if (isText) {
            const reader = new FileReader();
            reader.onload = () => setText(String(reader.result || ""));
            reader.readAsText(file);
            return;
        }

        if (isOcr) {
            setIsExtracting(true);
            setText("");
            const reader = new FileReader();
            reader.onload = async () => {
                try {
                    const dataUrl = reader.result as string;
                    const base64 = dataUrl.split(",")[1];
                    const mimeType = file.type || (file.name.endsWith(".pdf") ? "application/pdf" : "image/jpeg");

                    const response = await fetch("/api/medsafe/extract-text", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ fileBase64: base64, mimeType }),
                    });
                    const data = await response.json();
                    if (!response.ok) {
                        setError(data.error || "Falha na leitura do documento");
                    } else {
                        setText(data.text);
                    }
                } catch {
                    setError("Falha ao processar o arquivo");
                } finally {
                    setIsExtracting(false);
                }
            };
            reader.readAsDataURL(file);
            return;
        }

        setError("Formato não suportado. Use PDF, imagem (JPG, PNG, WEBP) ou texto.");
    }, []);

    const runAnalysis = useCallback(async () => {
        if (!text.trim()) return;
        setIsLoading(true);
        setResult(null);
        setError(null);
        try {
            const started = Date.now();
            const response = await fetch("/api/medsafe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ texto: text }),
            });
            if (!response.ok) {
                const payload = await response.json().catch(() => ({}));
                const msg = payload?.details
                    ? `${payload.error}: ${payload.details}`
                    : payload?.error || "Falha na análise RAG";
                throw new Error(msg);
            }
            const data = (await response.json()) as AnalysisResult;
            setResult({
                ...data,
                tempoAnalise: Number(((Date.now() - started) / 1000).toFixed(1)),
            });
        } catch (analysisError) {
            const message = analysisError instanceof Error ? analysisError.message : "Falha na análise RAG";
            setError(message);
        } finally {
            setIsLoading(false);
        }
    }, [text]);

    return {
        text,
        setText,
        fileName,
        isExtracting,
        isLoading,
        error,
        result,
        handleUpload,
        runAnalysis
    };
}
