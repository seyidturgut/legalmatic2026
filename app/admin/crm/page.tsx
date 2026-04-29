'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Users,
    TrendingUp,
    CheckCircle2,
    Clock,
    Plus,
    ArrowRight,
} from 'lucide-react';

interface DashboardStats {
    totalCustomers: number;
    activeLeads: number;
    completedTasks: number;
    pendingTasks: number;
    newCustomersThisMonth: number;
}

interface RecentActivity {
    id: string;
    type: string;
    description: string;
    timestamp: Date;
}

export default function CRMDashboard() {
    const router = useRouter();
    const [stats, setStats] = useState<DashboardStats>({
        totalCustomers: 0,
        activeLeads: 0,
        completedTasks: 0,
        pendingTasks: 0,
        newCustomersThisMonth: 0,
    });
    const [recentActivities, setRecentActivities] = useState<RecentActivity[]>(
        []
    );
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            // Fetch stats from multiple endpoints
            const [customersRes, leadsRes, tasksRes] = await Promise.all([
                fetch('/api/crm/customers?limit=1000'),
                fetch('/api/crm/leads'),
                fetch('/api/crm/tasks'),
            ]);

            const customersData = await customersRes.json();
            const leadsData = await leadsRes.json();
            const tasksData = await tasksRes.json();

            // Calculate stats
            const now = new Date();
            const thisMonth = now.getMonth();
            const thisYear = now.getFullYear();

            const newThisMonth = customersData.customers?.filter((c: any) => {
                const createdDate = new Date(c.createdAt);
                return (
                    createdDate.getMonth() === thisMonth &&
                    createdDate.getFullYear() === thisYear
                );
            }).length || 0;

            const activeLeads =
                leadsData.leads?.filter(
                    (l: any) => l.status !== 'WON' && l.status !== 'LOST'
                ).length || 0;

            const completedTasks =
                tasksData.tasks?.filter((t: any) => t.status === 'DONE').length || 0;

            const pendingTasks =
                tasksData.tasks?.filter((t: any) => t.status !== 'DONE').length || 0;

            setStats({
                totalCustomers: customersData.customers?.length || 0,
                activeLeads,
                completedTasks,
                pendingTasks,
                newCustomersThisMonth: newThisMonth,
            });

            setLoading(false);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setLoading(false);
        }
    };

    const StatCard = ({
        title,
        value,
        icon: Icon,
        color,
        subtitle,
    }: {
        title: string;
        value: number;
        icon: any;
        color: string;
        subtitle?: string;
    }) => (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="text-3xl font-bold mt-2">{value}</p>
                    {subtitle && (
                        <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
                    )}
                </div>
                <div className={`p-3 rounded-full ${color}`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Yükleniyor...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">CRM Dashboard</h1>
                <p className="text-gray-600 mt-2">
                    Müşteri ilişkileri yönetimi genel bakış
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Toplam Müşteri"
                    value={stats.totalCustomers}
                    icon={Users}
                    color="bg-blue-500"
                    subtitle={`+${stats.newCustomersThisMonth} bu ay`}
                />
                <StatCard
                    title="Aktif Lead"
                    value={stats.activeLeads}
                    icon={TrendingUp}
                    color="bg-green-500"
                />
                <StatCard
                    title="Tamamlanan Görevler"
                    value={stats.completedTasks}
                    icon={CheckCircle2}
                    color="bg-purple-500"
                />
                <StatCard
                    title="Bekleyen Görevler"
                    value={stats.pendingTasks}
                    icon={Clock}
                    color="bg-orange-500"
                />
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <button
                    onClick={() => router.push('/admin/crm/customers')}
                    className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow text-left group"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold text-lg mb-2">Müşteriler</h3>
                            <p className="text-sm text-gray-600">
                                Müşteri listesini görüntüle ve yönet
                            </p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                </button>

                <button
                    onClick={() => router.push('/admin/crm/leads')}
                    className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow text-left group"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold text-lg mb-2">Lead Yönetimi</h3>
                            <p className="text-sm text-gray-600">
                                Satış fırsatlarını takip et
                            </p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                </button>

                <button
                    onClick={() => router.push('/admin/crm/tasks')}
                    className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow text-left group"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold text-lg mb-2">Görevler</h3>
                            <p className="text-sm text-gray-600">
                                Yapılacakları görüntüle ve planla
                            </p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                </button>
            </div>

            {/* Campaign Section */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg p-8 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold mb-2">E-posta Kampanyaları</h2>
                        <p className="text-blue-100 mb-4">
                            Brevo ile müşterilerinize profesyonel e-posta kampanyaları
                            gönderin
                        </p>
                        <button
                            onClick={() => router.push('/admin/campaigns')}
                            className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors inline-flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Yeni Kampanya Oluştur
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
