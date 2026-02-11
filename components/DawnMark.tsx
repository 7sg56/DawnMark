"use client";

import React, { useEffect, useRef, useState } from "react";
import DOMPurify from "dompurify";
import { marked } from "marked";
import renderMathInElement from "./katex-auto-render";
import UploadPanel from "./UploadPanel";
import EditorPanel from "./EditorPanel";
import PreviewPanel from "./PreviewPanel";




interface BlobEntry {
  id: string;
  file: File;
  url: string;
  snippet: string;
}


export default function DawnMark() {
  const [text, setText] = useState<string>("");
  const [files, setFiles] = useState<BlobEntry[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);
  const [toast, setToast] = useState<string>("");

  // Configure global marked instance once (GFM, breaks, no syntax highlighting)
  const markedConfiguredRef = useRef(false);
  if (!markedConfiguredRef.current) {
    marked.use({ gfm: true, breaks: false });
    markedConfiguredRef.current = true;
  }


  // Render markdown -> preview with KaTeX auto-render
  useEffect(() => {
    if (!previewRef.current) return;
    const html = marked.parse(text) as string;
    const safe = DOMPurify.sanitize(html, {
      USE_PROFILES: { html: true },
      ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto|tel|ftp|data|blob):|[^a-z]|[a-z+.-]+(?:[^a-z+.-]|$))/i,
      ALLOWED_TAGS: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'strong', 'em', 'u', 's', 'del', 'ins', 'mark', 'small', 'sub', 'sup', 'code', 'pre', 'blockquote', 'ul', 'ol', 'li', 'dl', 'dt', 'dd', 'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'a', 'img', 'br', 'hr', 'span', 'div'],
      ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'id', 'style', 'target', 'rel', 'data-*'],
      ALLOW_DATA_ATTR: true
    });
    previewRef.current.innerHTML = safe;
    
    // Render math with KaTeX auto-render
    try {
      renderMathInElement(previewRef.current, {
        delimiters: [
          {left: '$$', right: '$$', display: true},
          {left: '$', right: '$', display: false},
          {left: '\\(', right: '\\)', display: false},
          {left: '\\[', right: '\\]', display: true}
        ],
        throwOnError: false
      });
    } catch (error) {
      console.error('KaTeX rendering error:', error);
    }
  }, [text]);

  // Load template on mount
  useEffect(() => {
    fetch('/template.md')
      .then(response => response.text())
      .then(content => setText(content))
      .catch(() => setText('# Welcome to DawnMark\n\nStart writing your markdown here...'));
  }, []);



  // Track created object URLs and revoke on unmount only
  const urlsRef = useRef<string[]>([]);

  useEffect(() => {
    return () => {
      urlsRef.current.forEach((u) => URL.revokeObjectURL(u));
    };
  }, []);

  function openFileDialog() {
    fileInputRef.current?.click();
  }

  const [maxPanel, setMaxPanel] = useState<null | "uploads" | "editor" | "preview">(null);
  function toggleMax(panel: "uploads" | "editor" | "preview") {
    setMaxPanel((p) => (p === panel ? null : panel));
  }

  async function copySnippet(snippet: string) {
    try {
      await navigator.clipboard.writeText(snippet);
      showToast("Copied Markdown to clipboard");
    } catch {
      showToast("Copy failed");
    }
  }

  function copyAllSnippets() {
    if (files.length === 0) return;
    const bundle = files.map((f) => f.snippet).join("\n");
    navigator.clipboard.writeText(bundle).then(() => showToast("Copied all snippets"));
  }

  function download(filename: string, content: string, type = "text/plain") {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function downloadSnippets() {
    const content = files.map((f) => f.snippet).join("\n");
    download("attachments.md", content, "text/markdown");
  }

  function copyMarkdown() {
    navigator.clipboard.writeText(text).then(() => showToast("Copied Markdown"));
  }

  function downloadMarkdown() {
    download("document.md", text, "text/markdown");
  }

  function clearEditor() {
    setText("");
  }

  function resetToWelcome() {
    fetch('/template.md')
      .then(response => response.text())
      .then(content => {
        setText(content);
        showToast("Reset to welcome content");
      })
      .catch(() => {
        setText('# Welcome to DawnMark\n\nStart writing your markdown here...');
        showToast("Reset to fallback content");
      });
  }

  function copyPreviewHTML() {
    if (!previewRef.current) return;
    const html = previewRef.current.innerHTML;
    navigator.clipboard.writeText(html).then(() => showToast("Copied HTML"));
  }

  function downloadPreviewHTML() {
    if (!previewRef.current) return;
    const html = `<!doctype html><meta charset=\"utf-8\"><title>DawnMark Preview</title><link rel=\"stylesheet\" href=\"https://unpkg.com/github-markdown-css@5/github-markdown-dark.css\"><article class=\"markdown-body\">${previewRef.current.innerHTML}</article>`;
    download("preview.html", html, "text/html");
  }

  function showToast(msg: string) {
    setToast(msg);
    const id = setTimeout(() => setToast(""), 1200);
    return () => clearTimeout(id);
  }

  return (
    <>
      <section className="left">
        <UploadPanel
          files={files}
          onFilesChange={setFiles}
          onCopySnippet={copySnippet}
          onCopyAllSnippets={copyAllSnippets}
          onDownloadSnippets={downloadSnippets}
          maxPanel={maxPanel}
        />
        
        <EditorPanel
          text={text}
          onTextChange={setText}
          onOpenFileDialog={openFileDialog}
          onCopyMarkdown={copyMarkdown}
          onDownloadMarkdown={downloadMarkdown}
          onClearEditor={clearEditor}
          onResetToWelcome={resetToWelcome}
          maxPanel={maxPanel}
          onToggleMax={toggleMax}
        />
      </section>

      <section className="right">
        <PreviewPanel
          previewRef={previewRef}
          onCopyPreviewHTML={copyPreviewHTML}
          onDownloadPreviewHTML={downloadPreviewHTML}
          maxPanel={maxPanel}
          onToggleMax={toggleMax}
        />
      </section>
      
      <div className={`toast ${toast ? "show" : ""}`} role="status" aria-live="polite" aria-atomic="true">
        {toast}
      </div>
    </>
  );
}
