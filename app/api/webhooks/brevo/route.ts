import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhookSignature } from '@/lib/brevo';
import { handleBrevoWebhook } from '@/lib/services/brevo-service';

// POST /api/webhooks/brevo - Handle Brevo webhook events
export async function POST(request: NextRequest) {
    try {
        const signature = request.headers.get('x-brevo-signature') || '';
        const body = await request.text();

        // Verify webhook signature
        if (!verifyWebhookSignature(body, signature)) {
            console.error('Invalid webhook signature');
            return NextResponse.json(
                { error: 'Invalid signature' },
                { status: 401 }
            );
        }

        const event = JSON.parse(body);

        // Handle the webhook event
        await handleBrevoWebhook(event);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error handling Brevo webhook:', error);
        return NextResponse.json(
            { error: 'Failed to process webhook' },
            { status: 500 }
        );
    }
}
