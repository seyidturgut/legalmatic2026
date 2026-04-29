import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import {
    createBrevoCampaign,
    sendBrevoCampaign,
    getCampaignStats,
} from '@/lib/services/brevo-service';

// GET /api/campaigns - List campaigns
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status') || '';

        const where: any = {};
        if (status) where.status = status;

        const campaigns = await prisma.emailCampaign.findMany({
            where,
            include: {
                template: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                creator: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                lists: {
                    include: {
                        list: {
                            select: {
                                id: true,
                                name: true,
                                memberCount: true,
                            },
                        },
                    },
                },
                _count: {
                    select: {
                        analytics: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({ campaigns });
    } catch (error) {
        console.error('Error fetching campaigns:', error);
        return NextResponse.json(
            { error: 'Failed to fetch campaigns' },
            { status: 500 }
        );
    }
}

// POST /api/campaigns - Create campaign
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const {
            name,
            subject,
            previewText,
            templateId,
            htmlContent,
            listIds,
            scheduledAt,
        } = body;

        if (!name || !subject) {
            return NextResponse.json(
                { error: 'Name and subject are required' },
                { status: 400 }
            );
        }

        if (!templateId && !htmlContent) {
            return NextResponse.json(
                { error: 'Either templateId or htmlContent is required' },
                { status: 400 }
            );
        }

        // Create campaign
        const campaign = await prisma.emailCampaign.create({
            data: {
                name,
                subject,
                previewText,
                templateId,
                htmlContent,
                scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
                createdBy: session.user.id,
            },
        });

        // Add lists to campaign
        if (listIds && listIds.length > 0) {
            await prisma.campaignList.createMany({
                data: listIds.map((listId: string) => ({
                    campaignId: campaign.id,
                    listId,
                })),
            });
        }

        // Sync to Brevo
        try {
            await createBrevoCampaign(campaign.id);
        } catch (brevoError) {
            console.error('Failed to create campaign in Brevo:', brevoError);
        }

        const fullCampaign = await prisma.emailCampaign.findUnique({
            where: { id: campaign.id },
            include: {
                template: true,
                lists: {
                    include: {
                        list: true,
                    },
                },
            },
        });

        return NextResponse.json(fullCampaign, { status: 201 });
    } catch (error) {
        console.error('Error creating campaign:', error);
        return NextResponse.json(
            { error: 'Failed to create campaign' },
            { status: 500 }
        );
    }
}
