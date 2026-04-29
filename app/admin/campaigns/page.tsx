'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Mail, Send, Calendar, TrendingUp, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

interface Campaign {
    id: string;
    name: string;
    subject: string;
    status: string;
    recipientCount: number;
    openRate?: number;
    clickRate?: number;
    sentAt?: string;
    scheduledAt?: string;
    createdAt: string;
    lists: Array<{
        list: {
            id: string;
            name: string;
            memberCount: number;
        };
    }>;
}

export default function CampaignsPage() {
    const router = useRouter();
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('');

    useEffect(() => {
        fetchCampaigns();
    }, [statusFilter]);

    const fetchCampaigns = async () => {
        try {
            const params = new URLSearchParams();
            if (statusFilter) params.append('status', statusFilter);

            const response = await fetch(`/api/campaigns?${params}`);
            const data = await response.json();
            setCampaigns(data.campaigns || []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching campaigns:', error);
            setLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        const colors: Record<string, string> = {
            DRAFT: 'bg-gray-100 text-gray-800',
            SCHEDULED: 'bg-blue-100 text-blue-800',
            SENT: 'bg-green-100 text-green-800',
            CANCELLED: 'bg-red-100 text-red-800',
        };

        const labels: Record<string, string> = {
            DRAFT: 'Taslak',
            SCHEDULED: 'Zamanlanmış',
            SENT: 'Gönderildi',
            CANCELLED: 'İptal Edildi',
        };

        return (
            <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-800'
                    }`}
            >
                {labels[status] || status}
            </span>
        );
    };

    return (
        <div className="p-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            E-posta Kampanyaları
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Brevo ile e-posta kampanyalarınızı yönetin
                        </p>
                    </div>
                    <button
                        onClick={() => router.push('/admin/campaigns/create')}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Yeni Kampanya
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">
                                Toplam Kampanya
                            </p>
                            <p className="text-3xl font-bold mt-2">{campaigns.length}</p>
                        </div>
                        <Mail className="w-8 h-8 text-blue-500" />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Gönderildi</p>
                            <p className="text-3xl font-bold mt-2">
                                {campaigns.filter((c) => c.status === 'SENT').length}
                            </p>
                        </div>
                        <Send className="w-8 h-8 text-green-500" />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Zamanlanmış</p>
                            <p className="text-3xl font-bold mt-2">
                                {campaigns.filter((c) => c.status === 'SCHEDULED').length}
                            </p>
                        </div>
                        <Calendar className="w-8 h-8 text-blue-500" />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Taslak</p>
                            <p className="text-3xl font-bold mt-2">
                                {campaigns.filter((c) => c.status === 'DRAFT').length}
                            </p>
                        </div>
                        <TrendingUp className="w-8 h-8 text-gray-500" />
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
                <div className="flex gap-4">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">Tüm Durumlar</option>
                        <option value="DRAFT">Taslak</option>
                        <option value="SCHEDULED">Zamanlanmış</option>
                        <option value="SENT">Gönderildi</option>
                        <option value="CANCELLED">İptal Edildi</option>
                    </select>
                </div>
            </div>

            {/* Campaign List */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            ) : campaigns.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-12 text-center">
                    <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-2">Henüz kampanya bulunmuyor.</p>
                    <button
                        onClick={() => router.push('/admin/campaigns/create')}
                        className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                    >
                        İlk kampanyanızı oluşturun
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {campaigns.map((campaign) => (
                        <div
                            key={campaign.id}
                            className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 cursor-pointer"
                            onClick={() => router.push(`/admin/campaigns/${campaign.id}`)}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            {campaign.name}
                                        </h3>
                                        {getStatusBadge(campaign.status)}
                                    </div>
                                    <p className="text-gray-600 mb-4">{campaign.subject}</p>

                                    <div className="flex items-center gap-6 text-sm text-gray-500">
                                        <div className="flex items-center gap-1">
                                            <Mail className="w-4 h-4" />
                                            {campaign.recipientCount} alıcı
                                        </div>

                                        {campaign.lists.length > 0 && (
                                            <div>
                                                Listeler: {campaign.lists.map((l) => l.list.name).join(', ')}
                                            </div>
                                        )}

                                        {campaign.sentAt && (
                                            <div className="flex items-center gap-1">
                                                <Send className="w-4 h-4" />
                                                {format(new Date(campaign.sentAt), 'dd MMM yyyy', {
                                                    locale: tr,
                                                })}
                                            </div>
                                        )}

                                        {campaign.scheduledAt && !campaign.sentAt && (
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />
                                                {format(new Date(campaign.scheduledAt), 'dd MMM yyyy HH:mm', {
                                                    locale: tr,
                                                })}
                                            </div>
                                        )}
                                    </div>

                                    {campaign.status === 'SENT' && (
                                        <div className="flex gap-6 mt-4 pt-4 border-t">
                                            <div>
                                                <p className="text-xs text-gray-500">Açılma Oranı</p>
                                                <p className="text-lg font-semibold text-blue-600">
                                                    {campaign.openRate?.toFixed(1) || 0}%
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Tıklama Oranı</p>
                                                <p className="text-lg font-semibold text-green-600">
                                                    {campaign.clickRate?.toFixed(1) || 0}%
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        router.push(`/admin/campaigns/${campaign.id}`);
                                    }}
                                    className="ml-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <Eye className="w-5 h-5 text-gray-600" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
