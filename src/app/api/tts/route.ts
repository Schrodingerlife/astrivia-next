import { NextResponse } from "next/server";
import { GEMINI_TTS_FALLBACK_MODEL, GEMINI_TTS_PRIMARY_MODEL } from "@/lib/ai-models";

const API_KEY = process.env.GOOGLE_API_KEY || "";
const GEMINI_TTS_MODELS = [GEMINI_TTS_PRIMARY_MODEL, GEMINI_TTS_FALLBACK_MODEL].filter(Boolean);
const GOOGLE_CLOUD_TTS_URL = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${API_KEY}`;

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
    return `Fale com voz masculina natural, tom profissional e caloroso de médico brasileiro. Ritmo moderado, claro e articulado. Evite sonar robótico e mantenha entonação humana:\n\n${text}`;
}

async function generateGeminiTts(prompt: string, model: string): Promise<Buffer> {
    const ttsUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`;

    const response = await fetch(ttsUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
                responseModalities: ["AUDIO"],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: {
                            voiceName: "Orus"
                        }
                    }
                }
            },
        }),
    });

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
}

async function generateGoogleCloudFallback(text: string): Promise<Buffer> {
    const response = await fetch(GOOGLE_CLOUD_TTS_URL, {
        method: "POST",
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

        const truncated = text.slice(0, 2000);
        const prompt = buildPrompt(truncated);

        // 1) Gemini TTS primary/fallback models
        for (const model of GEMINI_TTS_MODELS) {
            try {
                const wavBuffer = await generateGeminiTts(prompt, model);
                return new Response(new Uint8Array(wavBuffer), {
                    headers: {
                        "Content-Type": "audio/wav",
                        "Content-Length": wavBuffer.length.toString(),
                        "Cache-Control": "no-cache, no-store, must-revalidate",
                        "X-TTS-Provider": `gemini:${model}`,
                    },
                });
            } catch (error: unknown) {
                const message = error instanceof Error ? error.message : "Unknown Gemini TTS error";
                console.warn(message);
            }
        }

        // 2) Server-side Neural fallback before browser fallback
        try {
            const mp3Buffer = await generateGoogleCloudFallback(truncated);
            return new Response(new Uint8Array(mp3Buffer), {
                headers: {
                    "Content-Type": "audio/mpeg",
                    "Content-Length": mp3Buffer.length.toString(),
                    "Cache-Control": "no-cache, no-store, must-revalidate",
                    "X-TTS-Provider": "google-cloud-neural2",
                },
            });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Unknown Cloud TTS error";
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
