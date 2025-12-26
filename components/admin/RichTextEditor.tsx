
"use client";

import { useRef, useId } from 'react';
import { Editor } from '@tinymce/tinymce-react';

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    forwardedRef?: any;
}

export default function RichTextEditor({ value, onChange, placeholder, forwardedRef }: RichTextEditorProps) {
    const editorRef = useRef<any>(null);
    // Generate a stable unique ID for hydration compatibility
    const editorId = useId();

    const handleInit = (_evt: any, editor: any) => {
        editorRef.current = editor;
        if (forwardedRef) {
            forwardedRef.current = {
                insertContent: (content: string) => editor.insertContent(content)
            };
        }
    };

    return (
        <div className="bg-white min-h-[500px]">
            <Editor
                id={editorId}
                licenseKey='gpl' // Correct prop usage
                // Self-hosted configuration
                tinymceScriptSrc="/tinymce/tinymce.min.js"
                onInit={handleInit}
                value={value}
                onEditorChange={(newValue) => onChange(newValue)}
                init={{
                    height: 500,
                    menubar: true,
                    language: 'tr', // Turkish language
                    plugins: [
                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                        'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                    ],
                    toolbar: 'undo redo | blocks | ' +
                        'bold italic forecolor | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'table | removeformat | help',
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                    paste_data_images: true,
                    table_default_attributes: {
                        border: '1'
                    },
                    table_default_styles: {
                        'border-collapse': 'collapse',
                        'width': '100%'
                    },
                    table_responsive_width: true,
                    // Important for self-hosting to find skins/icons
                    skin: 'oxide',
                    content_css: 'default',
                    promotion: false,
                    // license_key removed from here
                }}
            />
        </div>
    );
}
