
"use client";

import { useState, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Save, Trash, Upload, FileText, Wand2 } from "lucide-react";
import RichTextEditor from "./RichTextEditor";
import * as mammoth from "mammoth";
import { CATEGORIES } from "@/lib/constants";
// Toast import removed

interface ContractFormProps {
    initialData?: any;
    isNew?: boolean;
}

// Helper to sanitize Turkish text to ID
const toCamelCase = (str: string) => {
    return str
        .toLocaleLowerCase('tr-TR')
        .replace(/ğ/g, 'g')
        .replace(/ü/g, 'u')
        .replace(/ş/g, 's')
        .replace(/ı/g, 'i')
        .replace(/ö/g, 'o')
        .replace(/ç/g, 'c')
        .replace(/[^a-zA-Z0-9]/g, ' ')
        .split(' ')
        .filter(word => word.length > 0)
        .map((word, index) => index == 0 ? word : word.charAt(0).toUpperCase() + word.slice(1))
        .join('');
};

export default function ContractForm({ initialData, isNew = false }: ContractFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [importing, setImporting] = useState(false);
    const [formData, setFormData] = useState({
        title: initialData?.title || "",
        description: initialData?.description || "",
        price: initialData?.price || 0,
        slug: initialData?.slug || "",
        category: initialData?.category || "Genel",
        templateSchema: initialData?.templateSchema || "[]",
        htmlContent: initialData?.htmlContent || "",
    });

    const editorRef = useRef<any>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const schemaVariables = useMemo(() => {
        try {
            const schema = JSON.parse(formData.templateSchema);
            if (Array.isArray(schema)) {
                return schema.map((q: any) => ({ id: q.id, label: q.label || q.id }));
            }
            return [];
        } catch (e) {
            return [];
        }
    }, [formData.templateSchema]);

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleEditorChange = (content: string) => {
        setFormData(prev => ({ ...prev, htmlContent: content }));
    };

    const insertVariable = (id: string) => {
        const tag = `{{${id}}}`;
        if (editorRef.current) {
            editorRef.current.insertContent(`<strong>${tag}</strong>`);
        }
    };

    const processSmartVariables = (html: string, currentSchema: any[]) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const newSchema = [...currentSchema];
        const addedIds = new Set(newSchema.map(q => q.id));
        let matchFound = false;

        const addVariable = (label: string) => {
            // Clean label: remove colons, extra spaces
            const cleanLabel = label.replace(/[:\.\-_]/g, '').trim();
            if (cleanLabel.length < 2 || cleanLabel.length > 50) return null;

            const id = toCamelCase(cleanLabel);
            if (!id) return null;
            if (addedIds.has(id)) return id; // Return existing ID if already present

            // Create new variable definition
            newSchema.push({
                id: id,
                type: "text", // Default to text
                label: cleanLabel,
                required: true,
                placeholder: `Örn: ${cleanLabel}`
            });
            addedIds.add(id);
            matchFound = true;
            return id;
        };

        // Strategy 1: Table Row Detection (Label | Value)
        // Common in contracts: <tr><td>Adı Soyadı</td><td>_______</td></tr>
        const rows = doc.querySelectorAll('tr');
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            // Check pairs of cells (0-1, 2-3 etc)
            for (let i = 0; i < cells.length - 1; i += 2) {
                const labelCell = cells[i];
                const valueCell = cells[i + 1];

                const labelText = labelCell.textContent?.trim() || "";
                const valueText = valueCell.textContent?.trim() || "";

                // Heuristic: Label shouldn't be empty, Value should be empty or just underscores/dots
                // Also check if valueText is empty OR purely symbols like _ . -
                if (labelText && (!valueText || /^[_.\-\s]+$/.test(valueText))) {
                    // This looks like a field!
                    const varId = addVariable(labelText);
                    if (varId) {
                        valueCell.innerHTML = `<strong>{{${varId}}}</strong>`;
                    }
                }
            }
        });

        // Strategy 2: Inline Pattern Detection (Label : ________)
        // We traverse text nodes to find patterns
        const walk = (node: Node) => {
            if (node.nodeType === Node.TEXT_NODE) {
                const text = node.nodeValue || "";

                // 1. Detect [Bracketed Text] - Explicit override
                let newText = text;
                // [Label] -> {{label}}
                newText = newText.replace(/\[([a-zA-Z0-9ğüşıöçĞÜŞİÖÇ\s]{2,30})\]/g, (match, capturedText) => {
                    const varId = addVariable(capturedText);
                    return varId ? `◖◖${varId}◗◗` : match; // Use temp placeholders to avoid re-processing
                });

                // 2. Detect "Label : ______" or "Label:......."
                // Captures: 1=Label, 2=Separator, 3=Placeholder
                const regex = /([a-zA-ZğüşıöçĞÜŞİÖÇ\s]{2,30})\s?([:|])\s?([_.\-]{3,})/g;
                if (regex.test(newText)) {
                    newText = newText.replace(regex, (match, label, sep, placeholder) => {
                        const varId = addVariable(label);
                        return varId ? `${label}${sep} ◖◖${varId}◗◗` : match;
                    });
                }

                if (newText !== text) {
                    const span = doc.createElement('span');
                    // Replace temp placeholders with actual HTML tags
                    span.innerHTML = newText.replace(/◖◖(.*?)◗◗/g, '<strong>{{$1}}</strong>');
                    node.parentNode?.replaceChild(span, node);
                }

            } else {
                node.childNodes.forEach(walk);
            }
        };

        // Walk the document body
        // Note: nodelist is live, so we convert to array to avoid issues with modification
        Array.from(doc.body.childNodes).forEach(walk);

        // Serialize back
        return { html: doc.body.innerHTML, schema: newSchema, matchFound };
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setImporting(true);
        try {
            const arrayBuffer = await file.arrayBuffer();
            const result = await mammoth.convertToHtml({ arrayBuffer: arrayBuffer });

            // Get current schema
            let currentSchema = [];
            try {
                currentSchema = JSON.parse(formData.templateSchema);
                if (!Array.isArray(currentSchema)) currentSchema = [];
            } catch { currentSchema = []; }

            // Process smart variables
            const processed = processSmartVariables(result.value, currentSchema);

            if (editorRef.current) {
                editorRef.current.insertContent(processed.html);
            } else {
                setFormData(prev => ({ ...prev, htmlContent: prev.htmlContent + processed.html }));
            }

            // Update schema if new variables found
            if (processed.matchFound) {
                setFormData(prev => ({ ...prev, templateSchema: JSON.stringify(processed.schema, null, 2) }));
                alert(`Word başarıyla yüklendi! ${processed.schema.length - currentSchema.length} yeni değişken ve tablo alanı tespit edildi.`);
            } else {
                alert("Word başarıyla yüklendi!");
            }

        } catch (error) {
            console.error(error);
            alert("Word yüklenirken hata oluştu.");
        } finally {
            setImporting(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);

        try {
            const url = isNew ? "/api/contracts" : `/api/contracts/${initialData.id}`;
            const method = isNew ? "POST" : "PUT";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.error || `Sözleşme kaydedilemedi: ${res.statusText}`);
            }

            alert("Sözleşme başarıyla kaydedildi!");
            router.push("/admin");
            router.refresh();
        } catch (error: any) {
            console.error(error);
            alert(error.message || "Bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Bu sözleşmeyi silmek istediğinize emin misiniz?")) return;
        setLoading(true);
        try {
            await fetch(`/api/contracts/${initialData.id}`, { method: "DELETE" });
            alert("Başarıyla silindi");
            router.push("/admin");
            router.refresh();
        } catch (e) {
            alert("Silme işlemi başarısız oldu");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">{isNew ? "Yeni Sözleşme" : "Sözleşme Düzenle"}</h1>
                <div className="flex gap-2">
                    {!isNew && (
                        <Button type="button" variant="destructive" onClick={handleDelete} disabled={loading}>
                            <Trash className="mr-2 h-4 w-4" /> Sil
                        </Button>
                    )}
                    <Button type="submit" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        <Save className="mr-2 h-4 w-4" /> Kaydet
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="editor" className="w-full">
                <TabsList>
                    <TabsTrigger value="editor">Web Editörü</TabsTrigger>
                    <TabsTrigger value="schema">Form Şeması (Sorular)</TabsTrigger>
                    <TabsTrigger value="general">Ayarlar</TabsTrigger>
                </TabsList>

                <TabsContent value="editor">
                    <Card className="grid grid-cols-1 md:grid-cols-4 gap-0">
                        <div className="md:col-span-3 border-r min-h-[500px]">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle>Sözleşme Taslağı</CardTitle>
                                    <CardDescription>
                                        Mevcut bir Word dosyasını yükleyin.
                                        <br />
                                        <span className="text-xs text-blue-600 font-medium">
                                            İpuçları:<br />
                                            1. [Köşeli Parantez] alanları (Örn: [Ad Soyad])<br />
                                            2. Tablolardaki boş hücreler (Örn: | Adı: | ____ |)<br />
                                            otomatik olarak değişkene dönüşür.
                                        </span>
                                    </CardDescription>
                                </div>
                                <div>
                                    <input
                                        type="file"
                                        accept=".docx"
                                        className="hidden"
                                        ref={fileInputRef}
                                        onChange={handleFileUpload}
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        disabled={importing}
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        {importing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                                        Akıllı İçe Aktar
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <RichTextEditor
                                    value={formData.htmlContent}
                                    onChange={handleEditorChange}
                                    placeholder="Sözleşme metnini buraya yazın veya Word'den aktarın..."
                                    forwardedRef={editorRef}
                                />
                            </CardContent>
                        </div>
                        <div className="md:col-span-1 bg-slate-50 dark:bg-slate-900/50 p-4 max-h-[600px] overflow-y-auto">
                            <h3 className="font-semibold mb-2 text-sm text-slate-700">Değişken Ekle</h3>
                            <p className="text-xs text-slate-500 mb-4">Editöre eklemek için değişkene tıklayın</p>
                            <div className="space-y-2">
                                {schemaVariables.length === 0 && <p className="text-xs text-slate-400 italic">Şemada tanımlı değişken yok.</p>}
                                {schemaVariables.map((v) => (
                                    <div
                                        key={v.id}
                                        onClick={() => insertVariable(v.id)}
                                        className="flex items-center gap-2 p-2 bg-white dark:bg-slate-800 border rounded cursor-pointer hover:border-blue-500 hover:shadow-sm transition-all text-sm group"
                                    >
                                        <span className="font-mono text-blue-600 dark:text-blue-400 font-bold bg-blue-50 px-1 rounded">{`{{${v.id}}}`}</span>
                                        <span className="truncate text-slate-600 dark:text-slate-300 text-xs">{v.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>
                </TabsContent>

                <TabsContent value="schema">
                    <Card>
                        <CardHeader>
                            <CardTitle>Form Sihirbazı Şeması</CardTitle>
                            <CardDescription>Soruları ve mantığı JSON formatında tanımlayın.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                className="font-mono min-h-[400px]"
                                name="templateSchema"
                                value={formData.templateSchema}
                                onChange={handleChange}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="general">
                    <Card>
                        <CardHeader>
                            <CardTitle>Sözleşme Detayları</CardTitle>
                            <CardDescription>Sözleşme ürünü hakkında temel bilgiler.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Başlık</Label>
                                    <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="slug">Slug (URL)</Label>
                                    <Input id="slug" name="slug" value={formData.slug} onChange={handleChange} required />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Açıklama</Label>
                                <Textarea id="description" name="description" value={formData.description} onChange={handleChange} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="price">Fiyat (TL)</Label>
                                    <Input type="number" id="price" name="price" value={formData.price} onChange={handleChange} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="category">Kategori</Label>
                                    <Select
                                        value={formData.category}
                                        onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Kategori seçin" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Genel">Genel</SelectItem>
                                            {CATEGORIES.map((cat) => (
                                                <SelectItem key={cat} value={cat}>
                                                    {cat}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </form>
    );
}
