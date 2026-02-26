import { NextResponse } from "next/server";
import { GEMINI_TTS_FALLBACK_MODEL, GEMINI_TTS_PRIMARY_MODEL } from "@/lib/ai-models";

const API_KEY = process.env.GOOGLE_API_KEY || "";
const FAST_TTS_MODEL = GEMINI_TTS_FALLBACK_MODEL || GEMINI_TTS_PRIMARY_MODEL;
const HQ_TTS_MODEL = GEMINI_TTS_PRIMARY_MODEL || GEMINI_TTS_FALLBACK_MODEL;
const GOOGLE_CLOUD_TTS_URL = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${API_KEY}`;
const FAST_TTS_TIMEOUT_MS = 4200;
const HQ_TTS_TIMEOUT_MS = 7000;
const CLOUD_TTS_TIMEOUT_MS = 4500;
const HQ_TTS_DELAY_MS = 220;
const CLOUD_TTS_DELAY_MS = 650;

// Create a WAV header for raw PCM data (16-bit LE, mono, 24000Hz)
function createWavHeader(pcmLength: number): Buffer {
    const header = Buffer.alloc(44);
    const sampleRate = 24000;
    const numChannels = 1;
    const bitsPerSample = 16;
    const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
    const blockAlign = numChannels * (bitsPerSample / 8);

    header.write("RIFF", 0);
    header.writeUInt32LE(36 + pcmLength, 4);
    header.write("WAVE", 8);
    header.write("fmt ", 12);
    header.writeUInt32LE(16, 16); // PCM chunk size
    header.writeUInt16LE(1, 20); // PCM format
    header.writeUInt16LE(numChannels, 22);
    header.writeUInt32LE(sampleRate, 24);
    header.writeUInt32LE(byteRate, 28);
    header.writeUInt16LE(blockAlign, 32);
    header.writeUInt16LE(bitsPerSample, 34);
    header.write("data", 36);
    header.writeUInt32LE(pcmLength, 40);

    return header;
}

function buildPrompt(text: string): string {
    return `Você é um médico brasileiro falando em consulta. Fale de forma completamente natural e humana: ritmo ágil e fluido como numa conversa real, entonação expressiva e variada, sem pausas artificiais entre frases. Tom direto e confiante, com calor humano. Não separe sílabas, não soe formal demais:\n\n${text}`;
}

async function generateGeminiTts(prompt: string, model: string, timeoutMs: number): Promise<Buffer> {
    const ttsUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
        const response = await fetch(ttsUrl, {
            method: "POST",
            signal: controller.signal,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    responseModalities: ["AUDIO"],
                    speechConfig: {
                        voiceConfig: {
                            prebuiltVoiceConfig: {
                                voiceName: "Orus",
                            },
                        },
                    },
                },
            }),
        });

        clearTimeout(timeout);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Gemini TTS (${model}) failed: ${response.status} ${errorText.slice(0, 240)}`);
        }

        const data = await response.json();
        const audioData = data?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (!audioData) {
            throw new Error(`Gemini TTS (${model}) returned no audio`);
        }

        const pcmBuffer = Buffer.from(audioData, "base64");
        const wavHeader = createWavHeader(pcmBuffer.length);
        return Buffer.concat([wavHeader, pcmBuffer]);
    } catch (err) {
        clearTimeout(timeout);
        throw err;
    }
}

async function generateGoogleCloudFallback(text: string, timeoutMs: number): Promise<Buffer> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    const response = await fetch(GOOGLE_CLOUD_TTS_URL, {
        method: "POST",
        signal: controller.signal,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            input: { text },
            voice: {
                languageCode: "pt-BR",
                name: "pt-BR-Neural2-B",
                ssmlGender: "MALE",
            },
            audioConfig: {
                audioEncoding: "MP3",
                speakingRate: 0.95,
                pitch: -1.0,
            },
        }),
    });

    clearTimeout(timeout);

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Google Cloud TTS failed: ${response.status} ${errorText.slice(0, 240)}`);
    }

    const data = await response.json();
    const audioContent = data?.audioContent;
    if (!audioContent) {
        throw new Error("Google Cloud TTS returned no audio");
    }

    return Buffer.from(audioContent, "base64");
}

function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function POST(req: Request) {
    try {
        const { text } = await req.json();

        if (!text || typeof text !== "string") {
            return NextResponse.json({ error: "Text is required" }, { status: 400 });
        }

        if (!API_KEY) {
            return NextResponse.json(
                { error: "GOOGLE_API_KEY is missing", useBrowserFallback: true },
                { status: 503 }
            );
        }

        const truncated = text.slice(0, 1800);
        const prompt = buildPrompt(truncated);
        const geminiFastTask = async () => {
            if (!FAST_TTS_MODEL) throw new Error("Missing FAST_TTS_MODEL");
            const wavBuffer = await generateGeminiTts(prompt, FAST_TTS_MODEL, FAST_TTS_TIMEOUT_MS);
            return {
                buffer: wavBuffer,
                contentType: "audio/wav",
                provider: `gemini-fast:${FAST_TTS_MODEL}`,
            };
        };

        const geminiHqTask = async () => {
            if (!HQ_TTS_MODEL || HQ_TTS_MODEL === FAST_TTS_MODEL) {
                throw new Error("Missing or duplicated HQ_TTS_MODEL");
            }
            await delay(HQ_TTS_DELAY_MS);
            const wavBuffer = await generateGeminiTts(prompt, HQ_TTS_MODEL, HQ_TTS_TIMEOUT_MS);
            return {
                buffer: wavBuffer,
                contentType: "audio/wav",
                provider: `gemini-hq:${HQ_TTS_MODEL}`,
            };
        };

        const cloudTask = async () => {
            await delay(CLOUD_TTS_DELAY_MS);
            const mp3Buffer = await generateGoogleCloudFallback(truncated, CLOUD_TTS_TIMEOUT_MS);
            return {
                buffer: mp3Buffer,
                contentType: "audio/mpeg",
                provider: "google-cloud-neural2",
            };
        };

        try {
            const winner = await Promise.any([geminiFastTask(), geminiHqTask(), cloudTask()]);
            return new Response(new Uint8Array(winner.buffer), {
                headers: {
                    "Content-Type": winner.contentType,
                    "Content-Length": winner.buffer.length.toString(),
                    "Cache-Control": "no-cache, no-store, must-revalidate",
                    "X-TTS-Provider": winner.provider,
                    "X-TTS-Strategy": "adaptive-race-v1",
                },
            });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Unknown adaptive TTS error";
            console.error(message);
            return NextResponse.json(
                { error: "TTS API unavailable", useBrowserFallback: true },
                { status: 502 }
            );
        }
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unknown error";
        console.error("TTS route error:", message);
        return NextResponse.json(
            { error: "TTS failed", useBrowserFallback: true },
            { status: 500 }
        );
    }
}
