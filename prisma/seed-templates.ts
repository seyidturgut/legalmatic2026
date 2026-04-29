import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const presetTemplates = [
    {
        name: 'Hoş Geldin E-postası',
        subject: 'Legalmatic\'e Hoş Geldiniz! 🎉',
        category: 'NEWSLETTER',
        htmlContent: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 32px;">Hoş Geldiniz! 🎉</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <p style="font-size: 16px; line-height: 1.6; color: #333333; margin: 0 0 20px 0;">
                Merhaba <strong>{{firstName}}</strong>,
              </p>
              <p style="font-size: 16px; line-height: 1.6; color: #333333; margin: 0 0 20px 0;">
                Legalmatic ailesine katıldığınız için çok mutluyuz!
              </p>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="https://legalmatic.net/sozlesmeler?utm_source=email&utm_medium=welcome&utm_campaign=onboarding" style="display: inline-block; padding: 15px 40px; background-color: #667eea; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold;">Hemen Başla</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f8f9fa; padding: 30px; text-align: center;">
              <p style="font-size: 14px; color: #666666; margin: 0;">© 2024 Legalmatic</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
    },
    {
        name: 'Ürün Tanıtımı',
        subject: 'Yeni Ürünümüzü Keşfedin',
        category: 'PROMOTIONAL',
        htmlContent: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
          <tr>
            <td style="background-color: #2563eb; padding: 40px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Yeni Ürünümüzü Keşfedin</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <h2 style="color: #1f2937; margin: 0 0 20px 0;">{{productName}}</h2>
              <p style="font-size: 16px; line-height: 1.6; color: #333333; margin: 0 0 20px 0;">{{productDescription}}</p>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="https://legalmatic.net?utm_source=email&utm_medium=product&utm_campaign=launch" style="display: inline-block; padding: 15px 40px; background-color: #2563eb; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold;">Detayları İncele</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
    },
    {
        name: 'İndirim Kampanyası',
        subject: '%50 İndirim - Sınırlı Süre! 🔥',
        category: 'PROMOTIONAL',
        htmlContent: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
          <tr>
            <td style="background: linear-gradient(135deg, #f59e0b 0%, #dc2626 100%); padding: 40px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 36px;">%50 İNDİRİM! 🔥</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px; text-align: center;">
              <h2 style="color: #1f2937; margin: 0 0 20px 0;">Fırsatı Kaçırmayın!</h2>
              <div style="background-color: #fef3c7; border: 2px dashed #f59e0b; border-radius: 8px; padding: 20px; margin: 0 0 30px 0;">
                <p style="font-size: 24px; color: #92400e; margin: 0; font-weight: bold;">{{discountCode}}</p>
              </div>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="https://legalmatic.net/sozlesmeler?utm_source=email&utm_medium=promo&utm_campaign=discount50" style="display: inline-block; padding: 18px 50px; background-color: #dc2626; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 18px;">Hemen Al</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
    },
    {
        name: 'Newsletter',
        subject: 'Legalmatic Bülteni - Bu Haftanın Öne Çıkanları',
        category: 'NEWSLETTER',
        htmlContent: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
          <tr>
            <td style="background-color: #1f2937; padding: 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0;">📰 Legalmatic Bülteni</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <h2 style="color: #1f2937; margin: 0 0 20px 0;">Bu Haftanın Öne Çıkanları</h2>
              <div style="border-bottom: 1px solid #e5e7eb; padding-bottom: 25px; margin-bottom: 25px;">
                <h3 style="color: #2563eb; margin: 0 0 10px 0;">{{article1Title}}</h3>
                <p style="font-size: 15px; line-height: 1.6; color: #4b5563;">{{article1Summary}}</p>
                <a href="https://legalmatic.net/blog?utm_source=email&utm_medium=newsletter&utm_campaign=weekly" style="color: #2563eb; text-decoration: none; font-weight: bold;">Devamını Oku →</a>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
    },
    {
        name: 'Geri Bildirim Anketi',
        subject: 'Görüşünüz Bizim İçin Değerli 💚',
        category: 'TRANSACTIONAL',
        htmlContent: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
          <tr>
            <td style="background-color: #10b981; padding: 40px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0;">Görüşünüz Bizim İçin Değerli 💚</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <p style="font-size: 16px; line-height: 1.6; color: #333333; margin: 0 0 20px 0;">
                Merhaba <strong>{{firstName}}</strong>,
              </p>
              <p style="font-size: 16px; line-height: 1.6; color: #333333; margin: 0 0 30px 0;">
                Hizmetlerimizi geliştirmek için sizin görüşlerinize ihtiyacımız var.
              </p>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="https://legalmatic.net/anket?utm_source=email&utm_medium=feedback&utm_campaign=survey" style="display: inline-block; padding: 15px 40px; background-color: #10b981; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold;">Anketi Doldur</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
    },
];

async function seedTemplates() {
    console.log('🌱 Seeding preset email templates...');

    const admin = await prisma.user.findFirst({
        where: { role: 'ADMIN' },
    });

    if (!admin) {
        console.error('❌ No admin user found. Please create an admin user first.');
        return;
    }

    for (const template of presetTemplates) {
        const existing = await prisma.emailTemplate.findFirst({
            where: { name: template.name },
        });

        if (existing) {
            console.log(`⏭️  Template "${template.name}" already exists, skipping...`);
            continue;
        }

        await prisma.emailTemplate.create({
            data: {
                ...template,
                createdById: admin.id,
            },
        });

        console.log(`✅ Created template: ${template.name}`);
    }

    console.log('🎉 Template seeding completed!');
}

seedTemplates()
    .catch((e) => {
        console.error('❌ Error seeding templates:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
