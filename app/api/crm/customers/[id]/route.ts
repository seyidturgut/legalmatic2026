import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import {
    updateContactInBrevo,
    deleteContactFromBrevo,
} from '@/lib/services/brevo-service';

// GET /api/crm/customers/[id] - Get single customer
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        const customer = await prisma.customer.findUnique({
            where: { id },
            include: {
                leads: {
                    orderBy: { createdAt: 'desc' },
                },
                tasks: {
                    orderBy: { createdAt: 'desc' },
                    take: 10,
                },
                notes: {
                    include: {
                        author: {
                            select: {
                                name: true,
                                email: true,
                            },
                        },
                    },
                    orderBy: { createdAt: 'desc' },
                },
                emailLists: {
                    include: {
                        list: true,
                    },
                },
            },
        });

        if (!customer) {
            return NextResponse.json(
                { error: 'Customer not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(customer);
    } catch (error) {
        console.error('Error fetching customer:', error);
        return NextResponse.json(
            { error: 'Failed to fetch customer' },
            { status: 500 }
        );
    }
}

// PATCH /api/crm/customers/[id] - Update customer
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
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
            status,
        } = body;

        // Check if customer exists
        const existingCustomer = await prisma.customer.findUnique({
            where: { id },
        });

        if (!existingCustomer) {
            return NextResponse.json(
                { error: 'Customer not found' },
                { status: 404 }
            );
        }

        // If email is being changed, check for duplicates
        if (email && email !== existingCustomer.email) {
            const duplicateEmail = await prisma.customer.findUnique({
                where: { email },
            });

            if (duplicateEmail) {
                return NextResponse.json(
                    { error: 'Email already in use' },
                    { status: 400 }
                );
            }
        }

        // Update customer
        const customer = await prisma.customer.update({
            where: { id },
            data: {
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
                tags: tags ? JSON.stringify(tags) : undefined,
                customFields: customFields ? JSON.stringify(customFields) : undefined,
                status,
            },
        });

        // Sync to Brevo
        try {
            await updateContactInBrevo(customer.id);
        } catch (brevoError) {
            console.error('Failed to sync to Brevo:', brevoError);
        }

        return NextResponse.json(customer);
    } catch (error) {
        console.error('Error updating customer:', error);
        return NextResponse.json(
            { error: 'Failed to update customer' },
            { status: 500 }
        );
    }
}

// DELETE /api/crm/customers/[id] - Delete customer
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        const customer = await prisma.customer.findUnique({
            where: { id },
        });

        if (!customer) {
            return NextResponse.json(
                { error: 'Customer not found' },
                { status: 404 }
            );
        }

        // Delete from Brevo first
        try {
            await deleteContactFromBrevo(customer.email);
        } catch (brevoError) {
            console.error('Failed to delete from Brevo:', brevoError);
        }

        // Delete customer (cascade will handle related records)
        await prisma.customer.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting customer:', error);
        return NextResponse.json(
            { error: 'Failed to delete customer' },
            { status: 500 }
        );
    }
}
