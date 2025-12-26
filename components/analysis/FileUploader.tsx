
"use client";

import { useState, useRef } from "react";
import { UploadCloud, FileText, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface FileUploaderProps {
    onFileSelect: (file: File) => void;
}

export function FileUploader({ onFileSelect }: FileUploaderProps) {
    const [dragActive, setDragActive] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            validateAndSetFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            validateAndSetFile(e.target.files[0]);
        }
    };

    const validateAndSetFile = (file: File) => {
        // Simple validation for demo
        if (file.type === "application/pdf" || file.type.includes("word") || file.name.endsWith(".pdf") || file.name.endsWith(".docx")) {
            setSelectedFile(file);
        } else {
            alert("Lütfen sadece PDF veya Word dosyası yükleyin.");
        }
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
        if (inputRef.current) {
            inputRef.current.value = "";
        }
    };

    const handleAnalyzeClick = () => {
        if (selectedFile) {
            onFileSelect(selectedFile);
        }
    };

    return (
        <div className="w-full max-w-xl mx-auto">
            {!selectedFile ? (
                <div
                    className={cn(
                        "relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-2xl transition-all cursor-pointer bg-slate-50 dark:bg-slate-900/50",
                        dragActive
                            ? "border-[#ec7b1f] bg-orange-50 dark:bg-orange-900/10 scale-[1.02]"
                            : "border-slate-300 dark:border-slate-700 hover:border-slate-400"
                    )}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => inputRef.current?.click()}
                >
                    <input
                        ref={inputRef}
                        type="file"
                        className="hidden"
                        accept=".pdf,.doc,.docx"
                        onChange={handleChange}
                    />
                    <div className="flex flex-col items-center p-6 text-center">
                        <div className="p-4 rounded-full bg-orange-100 dark:bg-orange-900/20 mb-4">
                            <UploadCloud className="w-8 h-8 text-[#ec7b1f]" />
                        </div>
                        <p className="mb-2 text-lg font-semibold text-slate-700 dark:text-slate-200">
                            Sözleşmenizi buraya sürükleyin
                        </p>
                        <p className="text-sm text-slate-500">
                            veya dosya seçmek için tıklayın (PDF, Word)
                        </p>
                    </div>
                </div>
            ) : (
                <div className="w-full animate-in fade-in zoom-in duration-300">
                    <div className="flex items-center p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm mb-6">
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg mr-4">
                            <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                                {selectedFile.name}
                            </p>
                            <p className="text-xs text-slate-500">
                                {(selectedFile.size / 1024).toFixed(2)} KB
                            </p>
                        </div>
                        <button
                            onClick={handleRemoveFile}
                            className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <Button
                        onClick={handleAnalyzeClick}
                        size="lg"
                        className="w-full h-12 text-lg bg-[#ec7b1f] hover:bg-[#d65d0a] shadow-lg shadow-orange-500/20"
                    >
                        Risk Analizini Başlat 🚀
                    </Button>
                </div>
            )}
        </div>
    );
}
