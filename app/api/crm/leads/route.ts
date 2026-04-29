import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/crm/leads - List all leads
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status') || '';
        const priority = searchParams.get('priority') || '';
        const assignedTo = searchParams.get('assignedTo') || '';

        const where: any = {};

        if (status) where.status = status;
        if (priority) where.priority = priority;
        if (assignedTo) where.assignedTo = assignedTo;

        const leads = await prisma.lead.findMany({
            where,
            include: {
                customer: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        company: true,
                    },
                },
                assignedUser: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                _count: {
                    select: {
                        tasks: true,
                        notes: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({ leads });
    } catch (error) {
        console.error('Error fetching leads:', error);
        return NextResponse.json(
            { error: 'Failed to fetch leads' },
            { status: 500 }
        );
    }
}

// POST /api/crm/leads - Create new lead
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const {
            customerId,
            title,
            description,
            value,
            status,
            priority,
            source,
            assignedTo,
            expectedCloseDate,
        } = body;

        if (!customerId || !title) {
            return NextResponse.json(
                { error: 'Customer ID and title are required' },
                { status: 400 }
            );
        }

        const lead = await prisma.lead.create({
            data: {
                customerId,
                title,
                description,
                value,
                status: status || 'NEW',
                priority: priority || 'MEDIUM',
                source,
                assignedTo: assignedTo || session.user.id,
                expectedCloseDate: expectedCloseDate
                    ? new Date(expectedCloseDate)
                    : null,
            },
            include: {
                customer: true,
                assignedUser: true,
            },
        });

        return NextResponse.json(lead, { status: 201 });
    } catch (error) {
        console.error('Error creating lead:', error);
        return NextResponse.json(
            { error: 'Failed to create lead' },
            { status: 500 }
        );
    }
}

// PATCH /api/crm/leads/[id] - Update lead
export async function PATCH(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const url = new URL(request.url);
        const id = url.pathname.split('/').pop();

        if (!id) {
            return NextResponse.json({ error: 'Lead ID required' }, { status: 400 });
        }

        const body = await request.json();
        const {
            title,
            description,
            value,
            status,
            priority,
            assignedTo,
            expectedCloseDate,
        } = body;

        const lead = await prisma.lead.update({
            where: { id },
            data: {
                title,
                description,
                value,
                status,
                priority,
                assignedTo,
                expectedCloseDate: expectedCloseDate
                    ? new Date(expectedCloseDate)
                    : undefined,
                closedAt:
                    status === 'WON' || status === 'LOST' ? new Date() : undefined,
            },
            include: {
                customer: true,
                assignedUser: true,
            },
        });

        return NextResponse.json(lead);
    } catch (error) {
        console.error('Error updating lead:', error);
        return NextResponse.json(
            { error: 'Failed to update lead' },
            { status: 500 }
        );
    }
}
