
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const products = await prisma.product.findMany();
    console.log("--- PRODUCT LIST ---");
    products.forEach(p => {
        console.log(`Title: ${p.title} | Slug: ${p.slug} | ID: ${p.id}`);
    });
    console.log("--------------------");
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
