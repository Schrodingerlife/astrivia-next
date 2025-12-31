import { NextResponse } from "next/server";
import { z } from "zod";

const newsletterSchema = z.object({
    email: z.string().email(),
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email } = newsletterSchema.parse(body);

        // In production, integrate with:
        // - Mailchimp
        // - ConvertKit
        // - SendGrid

        console.log("Newsletter subscription:", email);

        return NextResponse.json({
            success: true,
            message: "Subscribed successfully"
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Invalid email address" },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: "Failed to subscribe" },
            { status: 500 }
        );
    }
}
