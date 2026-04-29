'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Save, ArrowLeft, Eye, Settings, Sparkles } from 'lucide-react';

const EmailEditor = dynamic(() => import('react-email-editor'), { ssr: false });

export default function CreateTemplatePage() {
    const router = useRouter();
    const emailEditorRef = useRef<any>(null);
    const [loading, setLoading] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [previewHtml, setPreviewHtml] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: 'custom',
    });

    const [utmParams, setUtmParams] = useState({
        source: 'email',
        medium: 'campaign',
        campaign: '',
        content: '',
    });

    const handlePreview = () => {
        const unlayer = emailEditorRef.current?.editor;
        if (unlayer) {
            unlayer.exportHtml((data: any) => {
                const { html } = data;
                setPreviewHtml(html);
                setShowPreview(true);
            });
        }
    };

    const handleSave = async () => {
        if (!formData.name) {
            alert('Lütfen şablon adı girin');
            return;
        }

        const unlayer = emailEditorRef.current?.editor;
        if (!unlayer) {
            alert('Editör henüz hazır değil');
            return;
        }

        setLoading(true);
        unlayer.exportHtml(async (data: any) => {
            try {
                const { design, html } = data;

                const response = await fetch('/api/templates', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: formData.name,
                        subject: formData.name,
                        category: formData.category,
                        htmlContent: html,
                        jsonDesign: JSON.stringify(design),
                    }),
                });

                if (response.ok) {
                    alert('Şablon başarıyla kaydedildi!');
                    router.push('/admin/templates');
                } else {
                    const error = await response.json();
                    alert(error.error || 'Şablon kaydedilemedi');
                }
            } catch (error) {
                console.error('Error saving template:', error);
                alert('Bir hata oluştu');
            } finally {
                setLoading(false);
            }
        });
    };

    const generateUTMUrl = (baseUrl: string) => {
        const params = new URLSearchParams();
        if (utmParams.source) params.append('utm_source', utmParams.source);
        if (utmParams.medium) params.append('utm_medium', utmParams.medium);
        if (utmParams.campaign) params.append('utm_campaign', utmParams.campaign);
        if (utmParams.content) params.append('utm_content', utmParams.content);

        return `${baseUrl}?${params.toString()}`;
    };

    return (
        <div className="h-screen flex flex-col">
            {/* Header */}
            <div className="bg-white border-b px-6 py-4 flex items-center justify-between z-10 shadow-sm">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <div className="h-8 w-px bg-gray-200"></div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">Yeni E-posta Şablonu</h1>
                        <p className="text-sm text-gray-600">Unlayer drag & drop email builder</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handlePreview}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors inline-flex items-center gap-2"
                    >
                        <Eye className="w-4 h-4" />
                        Önizle
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Kaydediliyor...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                Kaydet
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Settings Sidebar & Editor */}
            <div className="flex flex-1 overflow-hidden">
                <div className="w-64 bg-gray-50 border-r p-4 overflow-y-auto">
                    <div className="flex items-center gap-2 mb-6">
                        <Settings className="w-5 h-5 text-gray-700" />
                        <h3 className="font-semibold text-gray-900">Şablon Bilgileri</h3>
                    </div>

                    <div className="space-y-3">
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-2">
                                Şablon Adı *
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({ ...formData, name: e.target.value })
                                }
                                className="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Örn: Hoş Geldin E-postası"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-2">
                                Açıklama
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData({ ...formData, description: e.target.value })
                                }
                                className="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Şablon hakkında kısa açıklama"
                                rows={3}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-2">
                                Kategori
                            </label>
                            <select
                                value={formData.category}
                                onChange={(e) =>
                                    setFormData({ ...formData, category: e.target.value })
                                }
                                className="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="custom">Özel</option>
                                <option value="NEWSLETTER">Newsletter</option>
                                <option value="PROMOTIONAL">Promosyon</option>
                                <option value="TRANSACTIONAL">İşlemsel</option>
                            </select>
                        </div>
                    </div>

                    <div className="mt-8 pt-8 border-t">
                        <div className="flex items-center gap-2 mb-4">
                            <Sparkles className="w-4 h-4 text-purple-600" />
                            <h3 className="font-semibold text-gray-900">UTM Parametreleri</h3>
                        </div>
                        <p className="text-xs text-gray-600 mb-4">
                            Button linklerine eklenecek tracking parametreleri
                        </p>

                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Source
                                </label>
                                <input
                                    type="text"
                                    value={utmParams.source}
                                    onChange={(e) =>
                                        setUtmParams({ ...utmParams, source: e.target.value })
                                    }
                                    className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="email"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Medium
                                </label>
                                <input
                                    type="text"
                                    value={utmParams.medium}
                                    onChange={(e) =>
                                        setUtmParams({ ...utmParams, medium: e.target.value })
                                    }
                                    className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="campaign"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Campaign
                                </label>
                                <input
                                    type="text"
                                    value={utmParams.campaign}
                                    onChange={(e) =>
                                        setUtmParams({ ...utmParams, campaign: e.target.value })
                                    }
                                    className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="yaz_indirimi"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Content
                                </label>
                                <input
                                    type="text"
                                    value={utmParams.content}
                                    onChange={(e) =>
                                        setUtmParams({ ...utmParams, content: e.target.value })
                                    }
                                    className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="button_cta"
                                />
                            </div>

                            {utmParams.campaign && (
                                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                                    <p className="text-xs font-medium text-blue-900 mb-1">
                                        Örnek URL:
                                    </p>
                                    <p className="text-xs text-blue-700 break-all font-mono">
                                        {generateUTMUrl('https://legalmatic.net')}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Unlayer Email Editor */}
                <div className="flex-1 relative">
                    <EmailEditor
                        ref={emailEditorRef}
                        onReady={() => console.log('Editor ready')}
                        options={{
                            displayMode: 'email',
                            locale: 'tr-TR',
                        }}
                    />
                </div>
            </div>

            {/* Preview Modal */}
            {showPreview && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                    onClick={() => setShowPreview(false)}
                >
                    <div
                        className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                            <h2 className="text-xl font-bold">Önizleme</h2>
                            <button
                                onClick={() => setShowPreview(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="p-4">
                            <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
