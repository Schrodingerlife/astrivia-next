import { NextResponse } from "next/server";
import { z } from "zod";

const contactSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    company: z.string().min(2),
    role: z.string().optional(),
    category: z.string(),
    message: z.string().min(20),
    consent: z.boolean(),
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const validatedData = contactSchema.parse(body);

        // In production, you would:
        // 1. Send email with Resend/SendGrid
        // 2. Store in database
        // 3. Integrate with CRM

        console.log("Contact form submission:", validatedData);

        // Simulate processing delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        return NextResponse.json({
            success: true,
            message: "Message received successfully"
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Validation failed", details: error.issues },
                { status: 400 }
            );
        }

        console.error("Contact form error:", error);
        return NextResponse.json(
            { error: "Failed to process request" },
            { status: 500 }
        );
    }
}
