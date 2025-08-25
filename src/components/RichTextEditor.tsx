import React, { forwardRef, useCallback } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './RichTextEditor.css';
import { cn } from '@/lib/utils';
import { SecurityUtils } from '@/lib/security';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'indent': '-1'}, { 'indent': '+1' }],
    ['link'],
    ['clean']
  ],
};

const formats = [
  'header', 'bold', 'italic', 'underline', 'strike',
  'blockquote', 'code-block', 'list', 'bullet',
  'indent', 'link'
];

const RichTextEditor = forwardRef<ReactQuill, RichTextEditorProps>(
  ({ value, onChange, placeholder, className, disabled = false }, ref) => {
    const handleChange = useCallback((content: string) => {
      // Sanitize content before passing to parent
      const sanitizedContent = SecurityUtils.sanitizeHtml(content);
      onChange(sanitizedContent);
    }, [onChange]);

    return (
      <div className={cn("rich-text-editor", className)}>
        <ReactQuill
          ref={ref}
          theme="snow"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          modules={modules}
          formats={formats}
          readOnly={disabled}
          className={cn(
            "bg-background",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        />
      </div>
    );
  }
);

RichTextEditor.displayName = "RichTextEditor";

export default RichTextEditor;