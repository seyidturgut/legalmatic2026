'use client';

import { useEffect, useState } from 'react';
import { Save, Key, Mail, CheckCircle, XCircle, Loader } from 'lucide-react';

export default function BrevoSettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [testing, setTesting] = useState(false);
    const [testResult, setTestResult] = useState<{
        success: boolean;
        message: string;
    } | null>(null);

    const [settings, setSettings] = useState({
        brevo_api_key: '',
        brevo_webhook_secret: '',
        brevo_sender_name: 'Legalmatic',
        brevo_sender_email: 'info@legalmatic.net',
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const response = await fetch('/api/settings?category=brevo');
            if (response.ok) {
                const data = await response.json();
                setSettings((prev) => ({ ...prev, ...data }));
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const response = await fetch('/api/settings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    settings,
                    category: 'brevo',
                }),
            });

            if (response.ok) {
                alert('Ayarlar başarıyla kaydedildi!');
            } else {
                alert('Ayarlar kaydedilemedi');
            }
        } catch (error) {
            console.error('Error saving settings:', error);
            alert('Bir hata oluştu');
        } finally {
            setSaving(false);
        }
    };

    const testConnection = async () => {
        if (!settings.brevo_api_key) {
            setTestResult({
                success: false,
                message: 'Lütfen önce API Key girin',
            });
            return;
        }

        setTesting(true);
        setTestResult(null);

        try {
            // Test API key by trying to fetch account info
            const response = await fetch('https://api.brevo.com/v3/account', {
                headers: {
                    'api-key': settings.brevo_api_key,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setTestResult({
                    success: true,
                    message: `Bağlantı başarılı! Email: ${data.email}`,
                });
            } else {
                setTestResult({
                    success: false,
                    message: 'API Key geçersiz veya hatalı',
                });
            }
        } catch (error) {
            setTestResult({
                success: false,
                message: 'Bağlantı hatası',
            });
        } finally {
            setTesting(false);
        }
    };

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
                <h1 className="text-3xl font-bold text-gray-900">Brevo Ayarları</h1>
                <p className="text-gray-600 mt-2">
                    E-posta kampanyaları için Brevo API ayarlarını yapılandırın
                </p>
            </div>

            <div className="max-w-3xl space-y-6">
                {/* API Key */}
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Key className="w-5 h-5 text-blue-600" />
                        <h2 className="text-lg font-semibold">API Anahtarı</h2>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Brevo API Key *
                            </label>
                            <input
                                type="password"
                                value={settings.brevo_api_key}
                                onChange={(e) =>
                                    setSettings({ ...settings, brevo_api_key: e.target.value })
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="xkeysib-..."
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Brevo hesabınızdan API key alabilirsiniz:{' '}
                                <a
                                    href="https://app.brevo.com/settings/keys/api"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                >
                                    Brevo API Keys
                                </a>
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Webhook Secret
                            </label>
                            <input
                                type="password"
                                value={settings.brevo_webhook_secret}
                                onChange={(e) =>
                                    setSettings({
                                        ...settings,
                                        brevo_webhook_secret: e.target.value,
                                    })
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Webhook secret key"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Webhook güvenliği için kullanılır (opsiyonel)
                            </p>
                        </div>

                        <button
                            onClick={testConnection}
                            disabled={testing || !settings.brevo_api_key}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
                        >
                            {testing ? (
                                <>
                                    <Loader className="w-4 h-4 animate-spin" />
                                    Test ediliyor...
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="w-4 h-4" />
                                    Bağlantıyı Test Et
                                </>
                            )}
                        </button>

                        {testResult && (
                            <div
                                className={`p-4 rounded-lg flex items-center gap-2 ${testResult.success
                                        ? 'bg-green-50 text-green-800'
                                        : 'bg-red-50 text-red-800'
                                    }`}
                            >
                                {testResult.success ? (
                                    <CheckCircle className="w-5 h-5" />
                                ) : (
                                    <XCircle className="w-5 h-5" />
                                )}
                                <span>{testResult.message}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sender Info */}
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Mail className="w-5 h-5 text-blue-600" />
                        <h2 className="text-lg font-semibold">Gönderici Bilgileri</h2>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Gönderici Adı
                            </label>
                            <input
                                type="text"
                                value={settings.brevo_sender_name}
                                onChange={(e) =>
                                    setSettings({ ...settings, brevo_sender_name: e.target.value })
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Legalmatic"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Gönderici E-posta
                            </label>
                            <input
                                type="email"
                                value={settings.brevo_sender_email}
                                onChange={(e) =>
                                    setSettings({
                                        ...settings,
                                        brevo_sender_email: e.target.value,
                                    })
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="info@legalmatic.net"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Bu e-posta adresinin Brevo'da doğrulanmış olması gerekir
                            </p>
                        </div>
                    </div>
                </div>

                {/* Info Box */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-2">
                        📘 Brevo Hakkında
                    </h3>
                    <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Ücretsiz plan: 300 email/gün</li>
                        <li>• Sınırsız contact yönetimi</li>
                        <li>• Detaylı analytics ve raporlama</li>
                        <li>
                            • Webhook desteği ile gerçek zamanlı event tracking
                        </li>
                    </ul>
                </div>

                {/* Save Button */}
                <div className="flex gap-4">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                    >
                        {saving ? (
                            <>
                                <Loader className="w-5 h-5 animate-spin" />
                                Kaydediliyor...
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5" />
                                Ayarları Kaydet
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
