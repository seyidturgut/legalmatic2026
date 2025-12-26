"use client";

import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface DeleteContractButtonProps {
    id: string;
    title: string;
}

export function DeleteContractButton({ id, title }: DeleteContractButtonProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        if (!confirm(`"${title}" sözleşmesini silmek istediğinize emin misiniz? Bu işlem geri alınamaz ve ilgili tüm siparişleri silecektir.`)) {
            return;
        }

        setIsDeleting(true);
        try {
            const res = await fetch(`/api/products/${id}`, {
                method: 'DELETE'
            });

            if (!res.ok) throw new Error('Delete failed');

            router.refresh();
        } catch (error) {
            alert('Silme işlemi başarısız oldu.');
            console.error(error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <Button
            variant="ghost"
            size="sm"
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
            onClick={handleDelete}
            disabled={isDeleting}
        >
            {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <Trash2 className="h-4 w-4" />
            )}
        </Button>
    );
}
