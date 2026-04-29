'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Eye, Edit, Trash, Mail, Sparkles } from 'lucide-react';

interface Template {
    id: string;
    name: string;
    description?: string;
    category: string;
    htmlContent: string;
    createdAt: string;
    _count: {
        campaigns: number;
    };
}

export default function TemplatesPage() {
    const router = useRouter();
    const [templates, setTemplates] = useState<Template[]>([]);
    const [loading, setLoading] = useState(true);
    const [categoryFilter, setCategoryFilter] = useState('');
    const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);

    useEffect(() => {
        fetchTemplates();
    }, [categoryFilter]);

    const fetchTemplates = async () => {
        try {
            const params = new URLSearchParams();
            if (categoryFilter) params.append('category', categoryFilter);

            const response = await fetch(`/api/templates?${params}`);
            const data = await response.json();
            setTemplates(data.templates || []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching templates:', error);
            setLoading(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`"${name}" şablonunu silmek istediğinize emin misiniz?`)) return;

        try {
            const response = await fetch(`/api/templates/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                fetchTemplates();
            } else {
                alert('Şablon silinemedi');
            }
        } catch (error) {
            console.error('Error deleting template:', error);
            alert('Bir hata oluştu');
        }
    };

    return (
        <div className="p-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">E-posta Şablonları</h1>
                        <p className="text-gray-600 mt-2">
                            Hazır şablonları kullanın veya kendiniz oluşturun
                        </p>
                    </div>
                    <button
                        onClick={() => router.push('/admin/templates/create')}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Yeni Şablon
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
                <div className="flex gap-4">
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">Tüm Şablonlar</option>
                        <option value="preset">Hazır Şablonlar</option>
                        <option value="custom">Özel Şablonlar</option>
                    </select>
                </div>
            </div>

            {/* Templates Grid */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            ) : templates.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-12 text-center">
                    <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-2">Henüz şablon bulunmuyor.</p>
                    <button
                        onClick={() => router.push('/admin/templates/create')}
                        className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                    >
                        İlk şablonunuzu oluşturun
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {templates.map((template) => (
                        <div
                            key={template.id}
                            className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden"
                        >
                            {/* Preview */}
                            <div
                                className="h-48 bg-gray-100 relative cursor-pointer group"
                                onClick={() => setPreviewTemplate(template)}
                            >
                                <div
                                    className="absolute inset-0 overflow-hidden"
                                    dangerouslySetInnerHTML={{ __html: template.htmlContent }}
                                    style={{
                                        transform: 'scale(0.25)',
                                        transformOrigin: 'top left',
                                        width: '400%',
                                        height: '400%',
                                        pointerEvents: 'none',
                                    }}
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center">
                                    <Eye className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            </div>

                            {/* Info */}
                            <div className="p-4">
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900 mb-1">
                                            {template.name}
                                        </h3>
                                        {template.description && (
                                            <p className="text-sm text-gray-600 line-clamp-2">
                                                {template.description}
                                            </p>
                                        )}
                                    </div>
                                    {template.category === 'preset' && (
                                        <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full flex items-center gap-1">
                                            <Sparkles className="w-3 h-3" />
                                            Hazır
                                        </span>
                                    )}
                                </div>

                                <div className="text-xs text-gray-500 mb-4">
                                    {template._count.campaigns} kampanyada kullanıldı
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => router.push(`/admin/templates/${template.id}`)}
                                        className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors inline-flex items-center justify-center gap-2 text-sm"
                                    >
                                        <Edit className="w-4 h-4" />
                                        Düzenle
                                    </button>
                                    {template.category !== 'preset' && (
                                        <button
                                            onClick={() => handleDelete(template.id, template.name)}
                                            className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                        >
                                            <Trash className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Preview Modal */}
            {previewTemplate && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                    onClick={() => setPreviewTemplate(null)}
                >
                    <div
                        className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                            <h2 className="text-xl font-bold">{previewTemplate.name}</h2>
                            <button
                                onClick={() => setPreviewTemplate(null)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="p-6">
                            <div
                                dangerouslySetInnerHTML={{ __html: previewTemplate.htmlContent }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
