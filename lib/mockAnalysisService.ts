
export interface RiskAnalysisResult {
    score: number;
    summary: string;
    risks: {
        id: string;
        severity: 'high' | 'medium' | 'low';
        clause: string;
        issue: string;
        suggestion: string;
    }[];
}

export const mockAnalyzeContract = async (file: File): Promise<RiskAnalysisResult> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 3500));

    return {
        score: 65,
        summary: "Sözleşme genel hatlarıyla standart görünse de, kiracı aleyhine bazı dengesiz cezai şartlar ve fesih maddeleri tespit edildi.",
        risks: [
            {
                id: "r1",
                severity: "high",
                clause: "Kiracı, kira bedelini bir gün geciktirse dahi, kiralayan sözleşmeyi tek taraflı feshedebilir ve kalan tüm yıllık kira bedelini talep edebilir.",
                issue: "Bu madde 'Muacceliyet Kaydı' içerir ve Yargıtay kararlarına göre konut kiralarında geçersiz sayılma riski taşır. Ayrıca bir günlük gecikme için fesih hakkı çok ağırdır.",
                suggestion: "Gecikme halinde en az 30 günlük ihtar süresi tanınmalı ve muacceliyet kaydı (kalan kiraların istenmesi) maddesi çıkarılmalıdır."
            },
            {
                id: "r2",
                severity: "medium",
                clause: "Kiralanan taşınmazda meydana gelecek her türlü tadilat ve onarım masrafı, sebebi ne olursa olsun kiracıya aittir.",
                issue: "Olağan kullanım yıpranmaları ve demirbaş (kombi, tesisat vb.) arızaları ev sahibinin sorumluluğundadır. Bu madde yasalara aykırılık teşkil edebilir.",
                suggestion: "Madde 'Kullanımdan kaynaklı olağan bakım giderleri kiracıya, demirbaş onarımları ve ana yapısal tadilatlar kiralayana aittir' şeklinde düzenlenmelidir."
            },
            {
                id: "r3",
                severity: "low",
                clause: "Depozito bedeli, sözleşme sonunda döviz kuruna endekslenmeden, TL bazında aynen iade edilir.",
                issue: "Enflasyon ortamında depozitonun değer kaybetmesi kiracı aleyhinedir.",
                suggestion: "Depozitonun vadeli bir hesapta tutulması veya döviz/altın üzerinden belirlenmesi önerilir."
            }
        ]
    };
};
