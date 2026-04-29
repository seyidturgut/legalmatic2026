import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { sendBrevoCampaign } from '@/lib/services/brevo-service';

// POST /api/campaigns/[id]/send - Send campaign
export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const result = await sendBrevoCampaign(params.id);

        return NextResponse.json({
            success: true,
            message: 'Campaign sent successfully',
            result,
        });
    } catch (error: any) {
        console.error('Error sending campaign:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to send campaign' },
            { status: 500 }
        );
    }
}
