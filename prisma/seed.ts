
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const email = 'info@legalmatic.net'
    const password = 'Legal2025'
    const hashedPassword = await bcrypt.hash(password, 10)

    // 1. Upsert Admin User
    const user = await prisma.user.upsert({
        where: { email },
        update: {
            password: hashedPassword,
            role: 'ADMIN'
        },
        create: {
            email,
            name: 'Legalmatic Admin',
            password: hashedPassword,
            role: 'ADMIN',
            image: 'https://api.dicebear.com/7.x/initials/svg?seed=LM',
        },
    })

    // 2. Upsert "Ev Kira Sözleşmesi" Product
    // Schema with Descriptions
    const rentalSchema = [
        // Kiralanan Bilgileri
        {
            id: "kiralananinCinsi",
            label: "Kiralananın Cinsi",
            type: "text",
            placeholder: "Örn: Daire, Dükkan",
            required: true,
            description: "Kiralanan mülkün türü."
        },
        {
            id: "kiralananinMahallesi",
            label: "Mahalle",
            type: "text",
            placeholder: "Örn: Caferağa Mah.",
            required: true,
            description: "Mülkün bulunduğu mahalle."
        },
        {
            id: "kiralananinCaddeSokagi",
            label: "Cadde/Sokak",
            type: "text",
            placeholder: "Örn: Moda Cd.",
            required: true,
            description: "Cadde veya sokak ismi."
        },
        {
            id: "kiralananinNumarasi",
            label: "Bina ve Daire No",
            type: "text",
            placeholder: "Örn: No:12 D:5",
            required: true,
            description: "Kapı numarası."
        },
        {
            id: "kiralananinKullanimSekli",
            label: "Kullanım Şekli",
            type: "text",
            placeholder: "Örn: Konut, İşyeri",
            required: true,
            description: "Kiralanan yerin kullanım amacı."
        },
        {
            id: "kiralananinDurumu",
            label: "Kiralananın Durumu",
            type: "text",
            placeholder: "Örn: Boyalı, Temiz",
            required: true,
            description: "Teslim anındaki fiziksel durum."
        },

        // Kiralayan (Ev Sahibi)
        {
            id: "kiralayan",
            label: "Kiralayan (Ev Sahibi) Adı Soyadı",
            type: "text",
            placeholder: "Örn: Mehmet Öz",
            required: true,
            description: "Mülk sahibinin tam adı."
        },
        {
            id: "kirayaVereninTcKimlikNo",
            label: "Kiralayan TC Kimlik No",
            type: "number",
            placeholder: "11 haneli TC no",
            required: true,
            description: "Ev sahibinin TC kimlik numarası."
        },
        {
            id: "kirayaVereninAdresi",
            label: "Kiralayan Adresi",
            type: "textarea",
            required: true,
            description: "Ev sahibinin ikamet adresi."
        },

        // Kiracı
        {
            id: "kiracininAdisoyadi",
            label: "Kiracının Adı Soyadı",
            type: "text",
            placeholder: "Örn: Ahmet Yılmaz",
            required: true,
            description: "Kiracının tam adı."
        },
        {
            id: "kiracininTcKimlikNo",
            label: "Kiracının TC Kimlik Numarası",
            type: "number",
            placeholder: "11 haneli TC no",
            required: true,
            description: "Kiracının kimlik numarası."
        },
        {
            id: "kiracininAdresi",
            label: "Kiracının Adresi",
            type: "textarea",
            required: true,
            description: "Kiracının güncel adresi."
        },

        // Sözleşme Detayları
        {
            id: "kiraBaslangicTarihi",
            label: "Kira Başlangıç Tarihi",
            type: "date",
            required: true,
            description: "Sözleşmenin başlama tarihi."
        },
        {
            id: "kiraSuresi",
            label: "Kira Süresi",
            type: "text",
            placeholder: "Örn: 1 Yıl",
            required: true,
            description: "Kiralamanın süresi."
        },
        {
            id: "aylikKiraBedeli",
            label: "Aylık Kira Bedeli",
            type: "number",
            placeholder: "25000",
            required: true,
            description: "Aylık ödenecek tutar."
        },
        {
            id: "yillikKiraBedeli",
            label: "Yıllık Kira Bedeli",
            type: "number",
            placeholder: "300000",
            required: true,
            description: "Yıllık toplam tutar."
        },
        {
            id: "kiraninOdemeSekli",
            label: "Ödeme Şekli",
            type: "text",
            placeholder: "Örn: Banka havalesi ile her ayın 5'inde",
            required: true,
            description: "Kiranın nasıl ve ne zaman ödeneceği."
        },
        {
            id: "kiralananlaBirlikteTeslimEdilenDemirbaslar",
            label: "Demirbaşlar",
            type: "textarea",
            placeholder: "Örn: Kombi, Ankastre Set...",
            required: false,
            description: "Evle birlikte teslim edilen eşyalar."
        }
    ];

    const rentalProduct = await prisma.product.upsert({
        where: { slug: 'ev-kira-sozlesmesi' },
        update: {
            templateSchema: JSON.stringify(rentalSchema),
            price: 150.00
        },
        create: {
            title: "Ev Kira Sözleşmesi",
            slug: "ev-kira-sozlesmesi",
            description: "Standart ev kiralama sözleşmesi.",
            price: 150.00,
            category: "Konut ve Gayrimenkul",
            image: "/images/contract-rental.png",
            templateSchema: JSON.stringify(rentalSchema),
            details: {
                intro: "Kiracı ve mülk sahibi arasındaki tüm hak ve yükümlülükleri koruma altına alan, güncel yasalara tam uyumlu kira sözleşmesi.",
                whatIsIt: {
                    title: "Bu Sözleşme Ne İşe Yarar?",
                    content: "Ev sahibi ve kiracı arasında, mülkün kullanımı, kira bedeli, ödeme koşulları ve depozito gibi kritik konuları yasal zeminde netleştirir. İleride doğabilecek anlaşmazlıkları önler."
                },
                whoUses: {
                    title: "Kimler Kullanır?",
                    content: "Evini kiraya veren mülk sahipleri ve konut kiralayan kiracılar için uygundur."
                },
                scope: [
                    "Kira Bedeli ve Ödeme Şartları",
                    "Depozito ve İade Koşulları",
                    "Demirbaş Listesi ve Durumu",
                    "Kiracının ve Ev Sahibinin Yükümlülükleri",
                    "Fesih ve Tahliye Şartları"
                ],
                faq: [
                    {
                        q: "Bu sözleşme noterde onaylatılmalı mı?",
                        a: "Zorunlu değildir, ancak noterde yapılması imza inkarını önler ve ispat kuvvetini artırır."
                    },
                    {
                        q: "Kefil ekleyebilir miyim?",
                        a: "Evet, sözleşme oluşturma sihirbazında kefil seçeneğini aktif ederek kefil bilgilerini ekleyebilirsiniz."
                    }
                ]
            }
        }
    })

    // 3. Upsert "Araç Satış Sözleşmesi" Product
    const vehicleSchema = [
        {
            id: "satici_ad",
            label: "Satıcının Adı Soyadı",
            type: "text",
            required: true,
            description: "Aracı satan kişinin kimlik bilgileri."
        },
        {
            id: "alici_ad",
            label: "Alıcının Adı Soyadı",
            type: "text",
            required: true,
            description: "Aracı satın alan kişinin kimlik bilgileri."
        },
        {
            id: "plaka",
            label: "Araç Plakası",
            type: "text",
            placeholder: "34 ABC 123",
            required: true,
            description: "Satışa konu olan aracın resmi plakası."
        },
        {
            id: "satis_bedeli",
            label: "Satış Bedeli (TL)",
            type: "number",
            placeholder: "750000",
            required: true,
            description: "Aracın anlaşılan toplam satış fiyatı."
        }
    ];

    const vehicleProduct = await prisma.product.upsert({
        where: { slug: 'arac-satis-sozlesmesi' },
        update: {
            templateSchema: JSON.stringify(vehicleSchema),
            price: 125.00
        },
        create: {
            title: "Araç Satış Sözleşmesi",
            slug: "arac-satis-sozlesmesi",
            description: "Noter öncesi araç satış protokolü.",
            price: 125.00,
            category: "Bireysel",
            image: "/images/contract-vehicle.png",
            templateSchema: JSON.stringify(vehicleSchema),
            details: {
                intro: "Araç alım-satım işlemlerinde, notere gitmeden önce taraflar arasındaki anlaşmayı yazılı hale getiren güvenli satış protokolü.",
                whatIsIt: {
                    title: "Bu Sözleşme Ne İşe Yarar?",
                    content: "Araç satışında kapora, ödeme yöntemi, araçtaki hasar durumu ve teslim tarihi gibi konuları kayıt altına alır. Dolandırıcılık veya cayma durumlarına karşı ön hazırlıktır."
                },
                whoUses: {
                    title: "Kimler Kullanır?",
                    content: "İkinci el araç alan ve satan şahıslar veya galeriler."
                },
                scope: [
                    "Araç Kimlik Bilgileri (Plaka, Şase No)",
                    "Satış Bedeli ve Kapora",
                    "Araçtaki Mevcut Hasarlar",
                    "Teslim Tarihi ve Yeri",
                    "Cayma Bedeli"
                ],
                faq: [
                    {
                        q: "Bu sözleşme satış yerine geçer mi?",
                        a: "Hayır, araç mülkiyetinin devri için mutlaka noterde satış işlemi yapılması gereklidir. Bu belge, taraflar arası bir ön protokoldür."
                    }
                ]
            }
        }
    })

    // 4. Upsert "Taşeronluk Sözleşmesi" Product
    const subcontractorSchema = [
        {
            id: "isverenUnvan",
            label: "İşveren Firma Ünvanı",
            type: "text",
            required: true,
            description: "İşi veren firmanın tam ticari ünvanı."
        },
        {
            id: "taseronUnvan",
            label: "Taşeron Firma Ünvanı",
            type: "text",
            required: true,
            description: "İşi üstlenen firmanın tam ticari ünvanı."
        },
        {
            id: "isinKonusu",
            label: "İşin Konusu",
            type: "textarea",
            required: true,
            description: "Yapılacak işin detaylı tanımı."
        },
        {
            id: "sozlesmeBedeli",
            label: "Sözleşme Bedeli (TL)",
            type: "number",
            required: true
        }
    ];

    const subcontractorProduct = await prisma.product.upsert({
        where: { slug: 'taseronluk-sozlesmesi' },
        update: {
            templateSchema: JSON.stringify(subcontractorSchema),
            price: 579.00,
            details: {
                intro: "Bir şirketin üstlendiği işin belirli bölümlerini, gerekli makine, ekipman ve iş gücü ile birlikte taşerona yaptırmasına ilişkin profesyonel alt yüklenici sözleşmesi.",
                whatIsIt: {
                    title: "Bu Sözleşme Ne İşe Yarar?",
                    content: "İşin konusu, tarafların yükümlülükleri, ekipman temini, işçilik giderleri, ödeme şekilleri, işin süresi, fesih şartları ve yasal sorumluluklar bu sözleşmede net bir şekilde düzenlenir. Taraflar arası uyuşmazlıkları minimize eder."
                },
                whoUses: {
                    title: "Kimler Kullanır?",
                    content: "İşveren şirketler (yüklenici firmalar), taşeron firmalar, şantiye şefleri, proje yöneticileri ve inşaat/üretim sektöründeki paydaşlar."
                },
                suitability: [
                    { question: "İşi başkasına (taşerona) yaptıracak mısınız?", answer: true },
                    { question: "Taraflar arasında ast-üst (alt işveren-asıl işveren) ilişkisi olacak mı?", answer: true },
                    { question: "İşin süresi ve bedeli belli mi?", answer: true }
                ],
                risks: [
                    { title: "Müteselsil Sorumluluk", description: "SGK ve işçilik alacaklarında asıl işverenin sorumluluğunu sınırlar." },
                    { title: "İş Kazası Riski", description: "İş güvenliği önlemleri ve sorumluluk paylaşımını netleştirerek cezai riskleri azaltır." },
                    { title: "Zamanında Teslim", description: "Gecikme cezaları ve fesih hakları ile işin zamanında bitirilmesini garanti altına alır." }
                ],
                legalBasis: [
                    "6098 Sayılı Türk Borçlar Kanunu (Eser Sözleşmesi Hükümleri)",
                    "4857 Sayılı İş Kanunu (Alt İşverenlik Yönetmeliği)",
                    "5510 Sayılı Sosyal Sigortalar ve Genel Sağlık Sigortası Kanunu"
                ],
                scope: [
                    "İşin Konusu, Yeri ve Süresi",
                    "Malzeme ve Ekipman Temini Sorumlulukları",
                    "SGK ve İşçilik Giderleri",
                    "Ödeme Planı ve Hakediş Şartları",
                    "İş Sağlığı ve Güvenliği Önlemleri",
                    "Fesih Hakkı ve Cezai Şartlar",
                    "Gizlilik ve Rekabet Yasağı"
                ],
                faq: [
                    {
                        q: "SGK primlerinden kim sorumludur?",
                        a: "Kanunen asıl işveren ve alt işveren (taşeron) müteselsil sorumludur. Bu sözleşme ile rücu hakları ve iç ilişkideki sorumluluklar netleştirilebilir."
                    },
                    {
                        q: "Sözleşme noter onaylı olmak zorunda mı?",
                        a: "Hayır, adi yazılı şekilde yapılması geçerlidir. Ancak ispat kolaylığı açısından noter onayı tercih edilebilir."
                    }
                ]
            }
        },
        create: {
            title: "Taşeronluk Sözleşmesi",
            slug: "taseronluk-sozlesmesi",
            description: "Alt işveren ile asıl işveren arasındaki ilişkiyi düzenleyen kapsamlı sözleşme.",
            price: 579.00,
            category: "Şirket Genel",
            image: "/images/contract-subcontractor.png", // Placeholder image path
            templateSchema: JSON.stringify(subcontractorSchema),
            details: {
                intro: "Bir şirketin üstlendiği işin belirli bölümlerini, gerekli makine, ekipman ve iş gücü ile birlikte taşerona yaptırmasına ilişkin profesyonel alt yüklenici sözleşmesi.",
                whatIsIt: {
                    title: "Bu Sözleşme Ne İşe Yarar?",
                    content: "İşin konusu, tarafların yükümlülükleri, ekipman temini, işçilik giderleri, ödeme şekilleri, işin süresi, fesih şartları ve yasal sorumluluklar bu sözleşmede net bir şekilde düzenlenir. Taraflar arası uyuşmazlıkları minimize eder."
                },
                whoUses: {
                    title: "Kimler Kullanır?",
                    content: "İşveren şirketler (yüklenici firmalar), taşeron firmalar, şantiye şefleri, proje yöneticileri ve inşaat/üretim sektöründeki paydaşlar."
                },
                suitability: [
                    { question: "İşi başkasına (taşerona) yaptıracak mısınız?", answer: true },
                    { question: "Taraflar arasında ast-üst (alt işveren-asıl işveren) ilişkisi olacak mı?", answer: true },
                    { question: "İşin süresi ve bedeli belli mi?", answer: true }
                ],
                risks: [
                    { title: "Müteselsil Sorumluluk", description: "SGK ve işçilik alacaklarında asıl işverenin sorumluluğunu sınırlar." },
                    { title: "İş Kazası Riski", description: "İş güvenliği önlemleri ve sorumluluk paylaşımını netleştirerek cezai riskleri azaltır." },
                    { title: "Zamanında Teslim", description: "Gecikme cezaları ve fesih hakları ile işin zamanında bitirilmesini garanti altına alır." }
                ],
                legalBasis: [
                    "6098 Sayılı Türk Borçlar Kanunu (Eser Sözleşmesi Hükümleri)",
                    "4857 Sayılı İş Kanunu (Alt İşverenlik Yönetmeliği)",
                    "5510 Sayılı Sosyal Sigortalar ve Genel Sağlık Sigortası Kanunu"
                ],
                scope: [
                    "İşin Konusu, Yeri ve Süresi",
                    "Malzeme ve Ekipman Temini Sorumlulukları",
                    "SGK ve İşçilik Giderleri",
                    "Ödeme Planı ve Hakediş Şartları",
                    "İş Sağlığı ve Güvenliği Önlemleri",
                    "Fesih Hakkı ve Cezai Şartlar",
                    "Gizlilik ve Rekabet Yasağı"
                ],
                faq: [
                    {
                        q: "SGK primlerinden kim sorumludur?",
                        a: "Kanunen asıl işveren ve alt işveren (taşeron) müteselsil sorumludur. Bu sözleşme ile rücu hakları ve iç ilişkideki sorumluluklar netleştirilebilir."
                    },
                    {
                        q: "Sözleşme noter onaylı olmak zorunda mı?",
                        a: "Hayır, adi yazılı şekilde yapılması geçerlidir. Ancak ispat kolaylığı açısından noter onayı tercih edilebilir."
                    }
                ]
            }
        }
    })

    // Upsert Legislation
    const tbk = await prisma.legislation.upsert({
        where: { slug: '6098-sayili-turk-borclar-kanunu' },
        update: {},
        create: {
            title: "6098 Sayılı Türk Borçlar Kanunu",
            type: "Kanun",
            referenceNo: "6098",
            slug: "6098-sayili-turk-borclar-kanunu",
            publishDate: new Date('2011-01-11'),
            summary: "Borç ilişkilerini düzenleyen temel kanundur. Sözleşmelerin kurulması, geçerliliği, hükümleri ve sona ermesi gibi konuları kapsar.",
            content: "MADDE 1- Sözleşme, tarafların iradelerini karşılıklı ve birbirine uygun olarak açıklamalarıyla kurulur.\nİrade açıklaması, açık veya örtülü olabilir.\n\nMADDE 2- Taraflar sözleşmenin esaslı noktalarında uyuşmuşlarsa, ikinci derecedeki noktalar üzerinde durulmamış olsa bile, sözleşme kurulmuş sayılır."
        }
    })

    const isKanunu = await prisma.legislation.upsert({
        where: { slug: '4857-sayili-is-kanunu' },
        update: {},
        create: {
            title: "4857 Sayılı İş Kanunu",
            type: "Kanun",
            referenceNo: "4857",
            slug: "4857-sayili-is-kanunu",
            publishDate: new Date('2003-05-22'),
            summary: "İşverenler ile bir iş sözleşmesine dayanarak çalıştırılan işçilerin çalışma şartlarını ve çalışma ortamına ilişkin hak ve sorumluluklarını düzenler.",
            content: "MADDE 2- Bir iş sözleşmesine dayanarak çalışan gerçek kişiye işçi, işçi çalıştıran gerçek veya tüzel kişiye yahut tüzel kişiliği olmayan kurum ve kuruluşlara işveren, işçi ile işveren arasında kurulan ilişkiye iş ilişkisi denir."
        }
    })


    // Link Legislations to Contracts
    await prisma.product.update({
        where: { id: subcontractorProduct.id },
        data: {
            legislations: {
                connect: [
                    { id: tbk.id },
                    { id: isKanunu.id }
                ]
            }
        }
    })

    console.log({ user, rentalProduct, vehicleProduct, subcontractorProduct })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
