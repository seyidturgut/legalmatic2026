import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/crm/tasks - List tasks
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status') || '';
        const assignedTo = searchParams.get('assignedTo') || '';
        const customerId = searchParams.get('customerId') || '';

        const where: any = {};

        if (status) where.status = status;
        if (assignedTo) where.assignedTo = assignedTo;
        if (customerId) where.customerId = customerId;

        const tasks = await prisma.task.findMany({
            where,
            include: {
                customer: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
                lead: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
                assignedUser: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: [{ dueDate: 'asc' }, { createdAt: 'desc' }],
        });

        return NextResponse.json({ tasks });
    } catch (error) {
        console.error('Error fetching tasks:', error);
        return NextResponse.json(
            { error: 'Failed to fetch tasks' },
            { status: 500 }
        );
    }
}

// POST /api/crm/tasks - Create task
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const {
            title,
            description,
            type,
            status,
            priority,
            dueDate,
            customerId,
            leadId,
            assignedTo,
        } = body;

        if (!title) {
            return NextResponse.json(
                { error: 'Title is required' },
                { status: 400 }
            );
        }

        const task = await prisma.task.create({
            data: {
                title,
                description,
                type: type || 'GENERAL',
                status: status || 'TODO',
                priority: priority || 'MEDIUM',
                dueDate: dueDate ? new Date(dueDate) : null,
                customerId,
                leadId,
                assignedTo: assignedTo || session.user.id,
            },
            include: {
                customer: true,
                lead: true,
                assignedUser: true,
            },
        });

        return NextResponse.json(task, { status: 201 });
    } catch (error) {
        console.error('Error creating task:', error);
        return NextResponse.json(
            { error: 'Failed to create task' },
            { status: 500 }
        );
    }
}

// PATCH /api/crm/tasks/[id] - Update task
export async function PATCH(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const url = new URL(request.url);
        const id = url.pathname.split('/').pop();

        if (!id) {
            return NextResponse.json({ error: 'Task ID required' }, { status: 400 });
        }

        const body = await request.json();
        const { title, description, type, status, priority, dueDate, assignedTo } =
            body;

        const task = await prisma.task.update({
            where: { id },
            data: {
                title,
                description,
                type,
                status,
                priority,
                dueDate: dueDate ? new Date(dueDate) : undefined,
                assignedTo,
                completedAt: status === 'DONE' ? new Date() : undefined,
            },
            include: {
                customer: true,
                lead: true,
                assignedUser: true,
            },
        });

        return NextResponse.json(task);
    } catch (error) {
        console.error('Error updating task:', error);
        return NextResponse.json(
            { error: 'Failed to update task' },
            { status: 500 }
        );
    }
}
