import { prisma } from '@/lib/prisma';

export async function getSettings(category?: string) {
    const where = category ? { category } : {};

    const settings = await prisma.settings.findMany({
        where,
    });

    return settings.reduce((acc, setting) => {
        acc[setting.key] = setting.value;
        return acc;
    }, {} as Record<string, string>);
}

export async function getSetting(key: string, defaultValue?: string) {
    const setting = await prisma.settings.findUnique({
        where: { key },
    });

    return setting?.value || defaultValue || null;
}

export async function updateSetting(
    key: string,
    value: string,
    category: string = 'general'
) {
    return await prisma.settings.upsert({
        where: { key },
        update: { value, category },
        create: { key, value, category },
    });
}
