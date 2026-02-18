import { NextResponse } from "next/server";

const API_KEY = process.env.GOOGLE_API_KEY || "";
const TTS_URL = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${API_KEY}`;

export async function POST(req: Request) {
    try {
        const { text } = await req.json();

        if (!text || typeof text !== "string") {
            return NextResponse.json({ error: "Text is required" }, { status: 400 });
        }

        // Truncate very long texts to avoid hitting limits
        const truncated = text.slice(0, 2000);

        const response = await fetch(TTS_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                input: { text: truncated },
                voice: {
                    languageCode: "pt-BR",
                    name: "pt-BR-Neural2-B", // Male neural voice, natural-sounding
                    ssmlGender: "MALE",
                },
                audioConfig: {
                    audioEncoding: "MP3",
                    speakingRate: 0.9,
                    pitch: 0,
                    volumeGainDb: 0,
                },
            }),
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error("TTS API error:", response.status, errorData);

            // If Neural2 voice fails, try Standard voice as fallback
            const fallbackResponse = await fetch(TTS_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    input: { text: truncated },
                    voice: {
                        languageCode: "pt-BR",
                        name: "pt-BR-Standard-B",
                        ssmlGender: "MALE",
                    },
                    audioConfig: {
                        audioEncoding: "MP3",
                        speakingRate: 0.9,
                        pitch: 0,
                    },
                }),
            });

            if (!fallbackResponse.ok) {
                return NextResponse.json(
                    { error: "TTS API unavailable", useBrowserFallback: true },
                    { status: 502 }
                );
            }

            const fallbackData = await fallbackResponse.json();
            return NextResponse.json({ audioContent: fallbackData.audioContent });
        }

        const data = await response.json();
        return NextResponse.json({ audioContent: data.audioContent });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unknown error";
        console.error("TTS route error:", message);
        return NextResponse.json(
            { error: "TTS failed", useBrowserFallback: true },
            { status: 500 }
        );
    }
}
