'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Send, Calendar, Mail } from 'lucide-react';

export default function CreateCampaignPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        subject: '',
        previewText: '',
        htmlContent: '',
        scheduledAt: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('/api/campaigns', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const campaign = await response.json();
                router.push(`/admin/campaigns/${campaign.id}`);
            } else {
                const error = await response.json();
                alert(error.error || 'Kampanya oluşturulamadı');
            }
        } catch (error) {
            console.error('Error creating campaign:', error);
            alert('Bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8">
            {/* Header */}
            <div className="mb-8">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Geri
                </button>
                <h1 className="text-3xl font-bold text-gray-900">Yeni Kampanya Oluştur</h1>
                <p className="text-gray-600 mt-2">
                    E-posta kampanyanızı oluşturun ve müşterilerinize gönderin
                </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="max-w-3xl">
                <div className="bg-white rounded-lg shadow p-6 space-y-6">
                    {/* Campaign Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Kampanya Adı *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) =>
                                setFormData({ ...formData, name: e.target.value })
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Örn: Yaz İndirimi 2024"
                        />
                    </div>

                    {/* Subject */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            E-posta Konusu *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.subject}
                            onChange={(e) =>
                                setFormData({ ...formData, subject: e.target.value })
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Örn: %50'ye Varan İndirimler!"
                        />
                    </div>

                    {/* Preview Text */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Önizleme Metni
                        </label>
                        <input
                            type="text"
                            value={formData.previewText}
                            onChange={(e) =>
                                setFormData({ ...formData, previewText: e.target.value })
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="E-posta istemcilerinde görünecek kısa açıklama"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Bu metin, e-posta istemcilerinde konu satırının yanında görünür
                        </p>
                    </div>

                    {/* HTML Content */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            E-posta İçeriği (HTML) *
                        </label>
                        <textarea
                            required
                            value={formData.htmlContent}
                            onChange={(e) =>
                                setFormData({ ...formData, htmlContent: e.target.value })
                            }
                            rows={12}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                            placeholder="<html>&#10;  <body>&#10;    <h1>Merhaba!</h1>&#10;    <p>Kampanya içeriğiniz...</p>&#10;  </body>&#10;</html>"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            HTML formatında e-posta içeriğinizi yazın
                        </p>
                    </div>

                    {/* Scheduled At */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Calendar className="w-4 h-4 inline mr-1" />
                            Zamanlama (Opsiyonel)
                        </label>
                        <input
                            type="datetime-local"
                            value={formData.scheduledAt}
                            onChange={(e) =>
                                setFormData({ ...formData, scheduledAt: e.target.value })
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Boş bırakırsanız kampanya taslak olarak kaydedilir
                        </p>
                    </div>

                    {/* Info Box */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex gap-3">
                            <Mail className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-blue-800">
                                <p className="font-medium mb-1">Brevo Entegrasyonu</p>
                                <p>
                                    Kampanya oluşturulduktan sonra Brevo'da otomatik olarak
                                    oluşturulacaktır. Alıcı listelerini kampanya detay sayfasından
                                    ekleyebilirsiniz.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4 pt-4 border-t">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            İptal
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    Oluşturuluyor...
                                </>
                            ) : (
                                <>
                                    <Send className="w-4 h-4" />
                                    Kampanya Oluştur
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>

            {/* Tips */}
            <div className="mt-8 max-w-3xl">
                <h3 className="font-semibold text-gray-900 mb-4">💡 İpuçları</h3>
                <div className="bg-gray-50 rounded-lg p-6 space-y-3 text-sm text-gray-700">
                    <p>
                        <strong>• Konu satırı:</strong> Kısa ve dikkat çekici olmalı (50
                        karakter ideal)
                    </p>
                    <p>
                        <strong>• Önizleme metni:</strong> Konuyu tamamlayan ek bilgi verin
                    </p>
                    <p>
                        <strong>• HTML içerik:</strong> Responsive tasarım kullanın, mobil
                        uyumlu olsun
                    </p>
                    <p>
                        <strong>• Test edin:</strong> Göndermeden önce kendinize test
                        e-postası gönderin
                    </p>
                </div>
            </div>
        </div>
    );
}
