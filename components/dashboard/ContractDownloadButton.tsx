"use client";

import { Button } from "@/components/ui/button";
import { Loader2, Download } from "lucide-react";
import { useState } from "react";

interface ContractDownloadButtonProps {
    slug: string;
    answers: any;
    title: string;
}

export function ContractDownloadButton({ slug, answers, title }: ContractDownloadButtonProps) {
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownload = async () => {
        setIsDownloading(true);
        try {
            const response = await fetch('/api/generate-document', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    slug,
                    data: typeof answers === 'string' ? JSON.parse(answers) : answers,
                }),
            });

            if (!response.ok) {
                const err = await response.json();
                alert(`Hata: ${err.error || 'Belge oluşturulamadı'}`);
                return;
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${slug}_sozlesme.docx`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

        } catch (error) {
            console.error('Download failed', error);
            alert('İndirme sırasında bir hata oluştu.');
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <Button
            size="sm"
            variant="ghost"
            onClick={handleDownload}
            disabled={isDownloading}
        >
            {isDownloading ? (
                <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
            ) : (
                <span className="text-slate-600 hover:text-slate-900 font-medium">İndir</span>
            )}
        </Button>
    );
}
