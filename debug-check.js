
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const p = await prisma.product.findUnique({
        where: { slug: 'ev-kira-sozlesmesi' }
    });

    if (!p) {
        console.log("Product not found!");
        return;
    }

    console.log("--- TEMPLATE SCHEMA ---");
    // Log first few items to check keys
    const schema = JSON.parse(p.templateSchema);
    console.log(JSON.stringify(schema.slice(0, 5), null, 2));

    console.log("\n--- HTML CONTENT SNIPPET ---");
    // Find a placeholder to see how it looks in HTML
    if (p.htmlContent) {
        const idx = p.htmlContent.indexOf("{{");
        if (idx !== -1) {
            console.log(p.htmlContent.substring(idx - 20, idx + 50));
        } else {
            console.log("No {{ placeholders found in HTML.");
        }
        // Check specific problematic one
        const specific = p.htmlContent.indexOf("kiralananinNumarasi");
        console.log("\n--- Specific Placeholder Check (kiralananinNumarasi) ---");
        if (specific !== -1) {
            console.log(p.htmlContent.substring(specific - 10, specific + 30));
        } else {
            console.log("Placeholder 'kiralananinNumarasi' NOT FOUND in HTML");
        }
    } else {
        console.log("HTML Content is null/empty");
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
