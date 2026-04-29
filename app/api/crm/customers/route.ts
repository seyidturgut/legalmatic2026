import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { syncContactToBrevo } from '@/lib/services/brevo-service';

// GET /api/crm/customers - List all customers
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const search = searchParams.get('search') || '';
        const segment = searchParams.get('segment') || '';
        const status = searchParams.get('status') || '';

        const skip = (page - 1) * limit;

        const where: any = {};

        if (search) {
            where.OR = [
                { firstName: { contains: search } },
                { lastName: { contains: search } },
                { email: { contains: search } },
                { company: { contains: search } },
            ];
        }

        if (segment) {
            where.segment = segment;
        }

        if (status) {
            where.status = status;
        }

        const [customers, total] = await Promise.all([
            prisma.customer.findMany({
                where,
                skip,
                take: limit,
                include: {
                    _count: {
                        select: {
                            leads: true,
                            tasks: true,
                            notes: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
            }),
            prisma.customer.count({ where }),
        ]);

        return NextResponse.json({
            customers,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('Error fetching customers:', error);
        return NextResponse.json(
            { error: 'Failed to fetch customers' },
            { status: 500 }
        );
    }
}

// POST /api/crm/customers - Create new customer
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const {
            firstName,
            lastName,
            email,
            phone,
            company,
            position,
            address,
            city,
            country,
            segment,
            source,
            tags,
            customFields,
        } = body;

        // Validate required fields
        if (!firstName || !lastName || !email) {
            return NextResponse.json(
                { error: 'First name, last name, and email are required' },
                { status: 400 }
            );
        }

        // Check if email already exists
        const existingCustomer = await prisma.customer.findUnique({
            where: { email },
        });

        if (existingCustomer) {
            return NextResponse.json(
                { error: 'Customer with this email already exists' },
                { status: 400 }
            );
        }

        // Create customer
        const customer = await prisma.customer.create({
            data: {
                firstName,
                lastName,
                email,
                phone,
                company,
                position,
                address,
                city,
                country: country || 'Türkiye',
                segment,
                source,
                tags: tags ? JSON.stringify(tags) : null,
                customFields: customFields ? JSON.stringify(customFields) : null,
                createdById: session.user.id,
            },
        });

        // Sync to Brevo in background
        try {
            await syncContactToBrevo(customer.id);
        } catch (brevoError) {
            console.error('Failed to sync to Brevo:', brevoError);
            // Don't fail the request if Brevo sync fails
        }

        return NextResponse.json(customer, { status: 201 });
    } catch (error) {
        console.error('Error creating customer:', error);
        return NextResponse.json(
            { error: 'Failed to create customer' },
            { status: 500 }
        );
    }
}
