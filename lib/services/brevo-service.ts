import { prisma } from '@/lib/prisma';
import {
    getBrevoContactsApi,
    getBrevoCampaignApi,
    BrevoContact,
    BrevoCampaign,
    BrevoList,
} from '@/lib/brevo';
import * as brevo from '@getbrevo/brevo';

/**
 * Sync a CRM customer to Brevo contacts
 */
export async function syncContactToBrevo(customerId: string) {
    try {
        const customer = await prisma.customer.findUnique({
            where: { id: customerId },
        });

        if (!customer) {
            throw new Error('Customer not found');
        }

        const contactsApi = getBrevoContactsApi();

        const contactData: BrevoContact = {
            email: customer.email,
            attributes: {
                FIRSTNAME: customer.firstName,
                LASTNAME: customer.lastName,
                PHONE: customer.phone || '',
                COMPANY: customer.company || '',
                POSITION: customer.position || '',
                CITY: customer.city || '',
                COUNTRY: customer.country || 'Türkiye',
                SEGMENT: customer.segment || '',
                SOURCE: customer.source || '',
            },
            updateEnabled: true,
        };

        const createContact = new brevo.CreateContact();
        Object.assign(createContact, contactData);

        const response = await contactsApi.createContact(createContact);

        // Update customer with Brevo contact ID
        if (response.body && 'id' in response.body) {
            await prisma.customer.update({
                where: { id: customerId },
                data: { brevoContactId: (response.body as any).id },
            });
        }

        return response;
    } catch (error: any) {
        // If contact already exists, update it
        if (error.response?.statusCode === 400) {
            return await updateContactInBrevo(customerId);
        }
        throw error;
    }
}

/**
 * Update existing Brevo contact
 */
export async function updateContactInBrevo(customerId: string) {
    const customer = await prisma.customer.findUnique({
        where: { id: customerId },
    });

    if (!customer) {
        throw new Error('Customer not found');
    }

    const contactsApi = getBrevoContactsApi();

    const updateContact = new brevo.UpdateContact();
    updateContact.attributes = {
        FIRSTNAME: customer.firstName,
        LASTNAME: customer.lastName,
        PHONE: customer.phone || '',
        COMPANY: customer.company || '',
        POSITION: customer.position || '',
        CITY: customer.city || '',
        COUNTRY: customer.country || 'Türkiye',
        SEGMENT: customer.segment || '',
        SOURCE: customer.source || '',
    } as any;

    return await contactsApi.updateContact(customer.email, updateContact);
}

/**
 * Delete contact from Brevo
 */
export async function deleteContactFromBrevo(email: string) {
    const contactsApi = getBrevoContactsApi();
    return await contactsApi.deleteContact(email);
}

/**
 * Create or update a list in Brevo
 */
export async function syncListToBrevo(listId: string) {
    const list = await prisma.emailList.findUnique({
        where: { id: listId },
        include: {
            members: {
                include: {
                    customer: true,
                },
            },
        },
    });

    if (!list) {
        throw new Error('List not found');
    }

    const contactsApi = getBrevoContactsApi();

    // Create list in Brevo if not exists
    if (!list.brevoListId) {
        const createList = new brevo.CreateList();
        createList.name = list.name;
        createList.folderId = 1; // Default folder

        const response = await contactsApi.createList(createList);

        if (response.body && 'id' in response.body) {
            await prisma.emailList.update({
                where: { id: listId },
                data: { brevoListId: (response.body as any).id },
            });
        }
    }

    return list;
}

/**
 * Add contact to a Brevo list
 */
export async function addContactToBrevoList(
    email: string,
    brevoListId: number
) {
    const contactsApi = getBrevoContactsApi();

    const contactEmails = new brevo.AddContactToList();
    contactEmails.emails = [email];

    return await contactsApi.addContactToList(brevoListId, contactEmails);
}

/**
 * Remove contact from Brevo list
 */
export async function removeContactFromBrevoList(
    email: string,
    brevoListId: number
) {
    const contactsApi = getBrevoContactsApi();

    const contactEmails = new brevo.RemoveContactFromList();
    contactEmails.emails = [email];

    return await contactsApi.removeContactFromList(brevoListId, contactEmails);
}

/**
 * Create email campaign in Brevo
 */
export async function createBrevoCampaign(campaignId: string) {
    const campaign = await prisma.emailCampaign.findUnique({
        where: { id: campaignId },
        include: {
            lists: {
                include: {
                    list: true,
                },
            },
            template: true,
        },
    });

    if (!campaign) {
        throw new Error('Campaign not found');
    }

    const campaignApi = getBrevoCampaignApi();

    const emailCampaign = new brevo.CreateEmailCampaign();
    emailCampaign.name = campaign.name;
    emailCampaign.subject = campaign.subject;
    emailCampaign.sender = {
        name: 'Legalmatic',
        email: 'info@legalmatic.net',
    };
    emailCampaign.htmlContent = campaign.htmlContent || campaign.template?.htmlContent || '';

    // Get Brevo list IDs
    const listIds = campaign.lists
        .map((cl) => cl.list.brevoListId)
        .filter((id): id is number => id !== null);

    emailCampaign.recipients = { listIds };

    if (campaign.scheduledAt) {
        emailCampaign.scheduledAt = campaign.scheduledAt.toISOString();
    }

    const response = await campaignApi.createEmailCampaign(emailCampaign);

    // Update campaign with Brevo ID
    if (response.body && 'id' in response.body) {
        await prisma.emailCampaign.update({
            where: { id: campaignId },
            data: { brevoId: (response.body as any).id },
        });
    }

    return response;
}

/**
 * Send email campaign
 */
export async function sendBrevoCampaign(campaignId: string) {
    const campaign = await prisma.emailCampaign.findUnique({
        where: { id: campaignId },
    });

    if (!campaign || !campaign.brevoId) {
        throw new Error('Campaign not found or not synced to Brevo');
    }

    const campaignApi = getBrevoCampaignApi();

    const response = await campaignApi.sendEmailCampaignNow(campaign.brevoId);

    // Update campaign status
    await prisma.emailCampaign.update({
        where: { id: campaignId },
        data: {
            status: 'SENT',
            sentAt: new Date(),
        },
    });

    return response;
}

/**
 * Get campaign statistics from Brevo
 */
export async function getCampaignStats(campaignId: string) {
    const campaign = await prisma.emailCampaign.findUnique({
        where: { id: campaignId },
    });

    if (!campaign || !campaign.brevoId) {
        throw new Error('Campaign not found or not synced to Brevo');
    }

    const campaignApi = getBrevoCampaignApi();
    const stats = await campaignApi.getEmailCampaign(campaign.brevoId);

    if (stats.body && 'statistics' in stats.body) {
        const statistics = (stats.body as any).statistics;

        // Update campaign with latest stats
        await prisma.emailCampaign.update({
            where: { id: campaignId },
            data: {
                recipientCount: statistics.sent || 0,
                openRate: statistics.uniqueOpens
                    ? (statistics.uniqueOpens / statistics.sent) * 100
                    : 0,
                clickRate: statistics.uniqueClicks
                    ? (statistics.uniqueClicks / statistics.sent) * 100
                    : 0,
                bounceRate: statistics.hardBounces
                    ? ((statistics.hardBounces + statistics.softBounces) / statistics.sent) * 100
                    : 0,
                unsubscribeRate: statistics.unsubscriptions
                    ? (statistics.unsubscriptions / statistics.sent) * 100
                    : 0,
            },
        });
    }

    return stats;
}

/**
 * Handle Brevo webhook events
 */
export async function handleBrevoWebhook(event: any) {
    const { event: eventType, email, 'message-id': messageId, date, tag } = event;

    // Find campaign by Brevo ID or tag
    let campaign = null;
    if (tag) {
        campaign = await prisma.emailCampaign.findFirst({
            where: { brevoId: parseInt(tag) },
        });
    }

    if (!campaign) {
        console.log('Campaign not found for webhook event');
        return;
    }

    // Store analytics event
    await prisma.emailAnalytics.create({
        data: {
            campaignId: campaign.id,
            eventType: eventType.toUpperCase(),
            email,
            timestamp: new Date(date),
            metadata: JSON.stringify(event),
        },
    });

    // Update campaign stats
    await getCampaignStats(campaign.id);
}
