'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Search,
    Plus,
    Mail,
    Phone,
    Building2,
    Filter,
    Download,
} from 'lucide-react';

interface Customer {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    company?: string;
    segment?: string;
    status: string;
    createdAt: string;
    _count: {
        leads: number;
        tasks: number;
        notes: number;
    };
}

export default function CustomersPage() {
    const router = useRouter();
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [segmentFilter, setSegmentFilter] = useState('');
    const [showNewCustomerModal, setShowNewCustomerModal] = useState(false);

    useEffect(() => {
        fetchCustomers();
    }, [search, segmentFilter]);

    const fetchCustomers = async () => {
        try {
            const params = new URLSearchParams();
            if (search) params.append('search', search);
            if (segmentFilter) params.append('segment', segmentFilter);

            const response = await fetch(`/api/crm/customers?${params}`);
            const data = await response.json();
            setCustomers(data.customers || []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching customers:', error);
            setLoading(false);
        }
    };

    const getSegmentBadge = (segment?: string) => {
        const colors: Record<string, string> = {
            VIP: 'bg-purple-100 text-purple-800',
            Regular: 'bg-blue-100 text-blue-800',
            Potential: 'bg-green-100 text-green-800',
        };

        if (!segment) return null;

        return (
            <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${colors[segment] || 'bg-gray-100 text-gray-800'
                    }`}
            >
                {segment}
            </span>
        );
    };

    const getStatusBadge = (status: string) => {
        const colors: Record<string, string> = {
            ACTIVE: 'bg-green-100 text-green-800',
            INACTIVE: 'bg-gray-100 text-gray-800',
            BLOCKED: 'bg-red-100 text-red-800',
        };

        return (
            <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-800'
                    }`}
            >
                {status}
            </span>
        );
    };

    return (
        <div className="p-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Müşteriler</h1>
                        <p className="text-gray-600 mt-2">
                            Tüm müşterilerinizi görüntüleyin ve yönetin
                        </p>
                    </div>
                    <button
                        onClick={() => setShowNewCustomerModal(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Yeni Müşteri
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Müşteri ara..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <select
                        value={segmentFilter}
                        onChange={(e) => setSegmentFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">Tüm Segmentler</option>
                        <option value="VIP">VIP</option>
                        <option value="Regular">Regular</option>
                        <option value="Potential">Potential</option>
                    </select>

                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors inline-flex items-center justify-center gap-2">
                        <Download className="w-4 h-4" />
                        Export
                    </button>
                </div>
            </div>

            {/* Customer List */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            ) : customers.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-12 text-center">
                    <p className="text-gray-500">Henüz müşteri bulunmuyor.</p>
                    <button
                        onClick={() => setShowNewCustomerModal(true)}
                        className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                    >
                        İlk müşterinizi ekleyin
                    </button>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Müşteri
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    İletişim
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Segment
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Durum
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Aktivite
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    İşlemler
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {customers.map((customer) => (
                                <tr
                                    key={customer.id}
                                    className="hover:bg-gray-50 cursor-pointer"
                                    onClick={() =>
                                        router.push(`/admin/crm/customers/${customer.id}`)
                                    }
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <div className="font-medium text-gray-900">
                                                {customer.firstName} {customer.lastName}
                                            </div>
                                            {customer.company && (
                                                <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                                    <Building2 className="w-3 h-3" />
                                                    {customer.company}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm">
                                            <div className="flex items-center gap-1 text-gray-900">
                                                <Mail className="w-3 h-3" />
                                                {customer.email}
                                            </div>
                                            {customer.phone && (
                                                <div className="flex items-center gap-1 text-gray-500 mt-1">
                                                    <Phone className="w-3 h-3" />
                                                    {customer.phone}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {getSegmentBadge(customer.segment)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {getStatusBadge(customer.status)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div className="flex gap-3">
                                            <span>{customer._count.leads} Lead</span>
                                            <span>{customer._count.tasks} Görev</span>
                                            <span>{customer._count.notes} Not</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                router.push(`/admin/crm/customers/${customer.id}`);
                                            }}
                                            className="text-blue-600 hover:text-blue-900 font-medium"
                                        >
                                            Detay
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* New Customer Modal - Placeholder */}
            {showNewCustomerModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <h2 className="text-xl font-bold mb-4">Yeni Müşteri Ekle</h2>
                        <p className="text-gray-600 mb-4">
                            Müşteri ekleme formu yakında eklenecek...
                        </p>
                        <button
                            onClick={() => setShowNewCustomerModal(false)}
                            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
                        >
                            Kapat
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
