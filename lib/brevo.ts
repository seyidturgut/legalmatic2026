import * as brevo from '@getbrevo/brevo';

// Initialize Brevo API client
let apiInstance: brevo.ContactsApi | null = null;
let campaignApi: brevo.EmailCampaignsApi | null = null;
let transactionalEmailsApi: brevo.TransactionalEmailsApi | null = null;

export function getBrevoContactsApi() {
    if (!apiInstance) {
        apiInstance = new brevo.ContactsApi();
        apiInstance.setApiKey(
            brevo.ContactsApiApiKeys.apiKey,
            process.env.BREVO_API_KEY || ''
        );
    }
    return apiInstance;
}

export function getBrevoCampaignApi() {
    if (!campaignApi) {
        campaignApi = new brevo.EmailCampaignsApi();
        campaignApi.setApiKey(
            brevo.EmailCampaignsApiApiKeys.apiKey,
            process.env.BREVO_API_KEY || ''
        );
    }
    return campaignApi;
}

export function getBrevoTransactionalApi() {
    if (!transactionalEmailsApi) {
        transactionalEmailsApi = new brevo.TransactionalEmailsApi();
        transactionalEmailsApi.setApiKey(
            brevo.TransactionalEmailsApiApiKeys.apiKey,
            process.env.BREVO_API_KEY || ''
        );
    }
    return transactionalEmailsApi;
}

// Helper function to verify webhook signature
export function verifyWebhookSignature(
    payload: string,
    signature: string
): boolean {
    const crypto = require('crypto');
    const secret = process.env.BREVO_WEBHOOK_SECRET || '';

    const hash = crypto
        .createHmac('sha256', secret)
        .update(payload)
        .digest('hex');

    return hash === signature;
}

// Types for better TypeScript support
export interface BrevoContact {
    email: string;
    attributes?: {
        FIRSTNAME?: string;
        LASTNAME?: string;
        PHONE?: string;
        COMPANY?: string;
        [key: string]: any;
    };
    listIds?: number[];
    updateEnabled?: boolean;
}

export interface BrevoCampaign {
    name: string;
    subject: string;
    sender: {
        name: string;
        email: string;
    };
    htmlContent: string;
    recipients: {
        listIds: number[];
    };
    scheduledAt?: string;
}

export interface BrevoList {
    name: string;
    folderId?: number;
}
