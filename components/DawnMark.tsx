"use client";

import React, { useEffect, useRef, useState } from "react";
import DOMPurify from "dompurify";
import { marked } from "marked";
import { markedHighlight } from "marked-highlight";
import hljs from "highlight.js";
import katex from "katex";
import renderMathInElement from "katex/dist/contrib/auto-render";

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"] as const;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}

function isImage(file: File) {
  return file.type.startsWith("image/");
}

function snippetFor(file: File, url: string) {
  const safeName = file.name.replace(/\]/g, ")");
  if (isImage(file)) return `![${safeName}](${url})`;
  return `[${safeName}](${url})`;
}

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
  const dropzoneRef = useRef<HTMLDivElement | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);
  const gutterRef = useRef<HTMLDivElement | null>(null);
  const uploadPanelRef = useRef<HTMLDivElement | null>(null);
  const editorPanelRef = useRef<HTMLDivElement | null>(null);
  const previewPanelRef = useRef<HTMLDivElement | null>(null);
  const [toast, setToast] = useState<string>("");

  // Configure global marked instance once (GFM, breaks, highlight.js)
  const markedConfiguredRef = useRef(false);
  if (!markedConfiguredRef.current) {
    marked.use(
      markedHighlight({
        langPrefix: "hljs language-",
        highlight(code, lang) {
          const language = hljs.getLanguage(lang) ? lang : "plaintext";
          return hljs.highlight(code, { language }).value;
        },
      })
    );
    marked.use({ gfm: true, breaks: false, headerIds: true, mangle: false });
    markedConfiguredRef.current = true;
  }


  // Render markdown -> preview with KaTeX auto-render
  useEffect(() => {
    if (!previewRef.current) return;
    const html = marked.parse(text) as string;
    const safe = DOMPurify.sanitize(html, {
      USE_PROFILES: { html: true },
      ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto|tel|ftp|data|blob):|[^a-z]|[a-z+.-]+(?:[^a-z+.-]|$))/i,
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


  // File selection handler
  function handleFiles(list: FileList | null) {
    if (!list || list.length === 0) return;
    const next: BlobEntry[] = [];
    for (let i = 0; i < list.length; i++) {
      const file = list[i]!;
      const url = URL.createObjectURL(file);
      next.push({
        id: `${file.name}-${file.size}-${file.lastModified}-${Math.random().toString(36).slice(2)}`,
        file,
        url,
        snippet: snippetFor(file, url),
      });
      urlsRef.current.push(url);
    }
    setFiles((prev) => [...next, ...prev]);
  }

  // Dropzone interactions
  useEffect(() => {
    const dz = dropzoneRef.current;
    if (!dz) return;
    const onDrop = (e: DragEvent) => {
      e.preventDefault();
      dz.classList.remove("dragover");
      handleFiles(e.dataTransfer?.files ?? null);
    };
    const onDragOver = (e: DragEvent) => {
      e.preventDefault();
      dz.classList.add("dragover");
    };
    const onDragLeave = (e: DragEvent) => {
      e.preventDefault();
      dz.classList.remove("dragover");
    };
    dz.addEventListener("drop", onDrop);
    dz.addEventListener("dragover", onDragOver);
    dz.addEventListener("dragleave", onDragLeave);
    return () => {
      dz.removeEventListener("drop", onDrop);
      dz.removeEventListener("dragover", onDragOver);
      dz.removeEventListener("dragleave", onDragLeave);
    };
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
        <div className={`panel uploads ${maxPanel === "uploads" ? "panel-max" : ""}`} ref={uploadPanelRef}>
          <div className="panel-header">
            <div className="panel-title">Uploads</div>
            <div className="panel-actions">
              <button className="icon-btn" title="Upload files" aria-label="Upload files" onClick={openFileDialog}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 5 17 10"/><line x1="12" y1="5" x2="12" y2="21"/></svg>
              </button>
              <button className="icon-btn" title="Copy all snippets" aria-label="Copy all snippets" onClick={copyAllSnippets}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              </button>
              <button className="icon-btn" title="Download snippets" aria-label="Download snippets" onClick={downloadSnippets}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              </button>
            </div>
          </div>
          <div className="panel-body">
            <div
              id="dropzone"
              ref={dropzoneRef}
              className="dropzone"
              tabIndex={0}
              role="button"
              aria-label="Drop files here or press Enter to browse"
              onClick={(e) => { const target = e.target as HTMLElement; if (target.closest(".file-item")) return; openFileDialog(); }}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") openFileDialog(); }}
              onDragOver={(e) => { e.preventDefault(); }}
              onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer?.files ?? null); }}
            >
              {files.length === 0 ? (
                <p>Drop files here or click to browse</p>
              ) : (
                <ul className="file-list" aria-live="polite">
                {files.map((f) => (
                  <li
                    key={f.id}
                    className="file-item"
                    title="Click to copy Markdown"
                    onClick={() => copySnippet(f.snippet)}
                  >
                    <div className="file-thumb" aria-hidden="true">
                      {isImage(f.file) ? (
                        <img src={f.url} alt="" />
                      ) : (
                        <div className="file-glyph">📄</div>
                      )}
                    </div>
                    <div className="file-label">
                      <span className="file-name">{f.file.name}</span>
                      <span className="file-meta">{formatBytes(f.file.size)}</span>
                    </div>
                  </li>
                ))}
                </ul>
              )}
            </div>
          <input
            ref={fileInputRef}
            id="file-input"
            type="file"
            multiple
            hidden
            onChange={(e) => { handleFiles(e.currentTarget.files); e.currentTarget.value = ""; }}
          />
            <p className="hint">Tip: Click a file to copy its Markdown snippet, then paste it into the editor.</p>
          </div>
        </div>

        <div className={`panel grow ${maxPanel === "editor" ? "panel-max" : ""}`} ref={editorPanelRef}>
          <div className="panel-header">
            <div className="panel-title">Editor</div>
            <div className="panel-actions">
              <button className="icon-btn" title="Upload files" aria-label="Upload files" onClick={openFileDialog}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 5 17 10"/><line x1="12" y1="5" x2="12" y2="21"/></svg>
              </button>
              <button className="icon-btn" title="Copy Markdown" aria-label="Copy Markdown" onClick={copyMarkdown}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              </button>
              <button className="icon-btn" title="Download Markdown" aria-label="Download Markdown" onClick={downloadMarkdown}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              </button>
              <button className="icon-btn" title="Clear editor" aria-label="Clear editor" onClick={clearEditor}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
              </button>
              <button className="icon-btn" title="Reset to welcome content" aria-label="Reset to welcome content" onClick={resetToWelcome}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>
              </button>
              <button className="icon-btn" title="Fullscreen" aria-label="Fullscreen" onClick={() => toggleMax("editor")}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6"/><path d="M9 21H3v-6"/><path d="M21 3l-7 7"/><path d="M3 21l7-7"/></svg>
              </button>
            </div>
          </div>
          <div className="panel-body editor-body">
            <div className="editor-wrap" role="group" aria-label="Markdown editor with line numbers">
              <div className="editor-gutter" aria-hidden="true" ref={gutterRef}>
                {Array.from({ length: Math.max(1, text.split("\n").length) }, (_, i) => (
                  <div key={i} className="gutter-line">{i + 1}</div>
                ))}
              </div>
              <textarea
                id="editor"
                placeholder="Start typing to replace the welcome content..."
                value={text}
                onChange={(e) => setText(e.currentTarget.value)}
                onScroll={(e) => { if (gutterRef.current) gutterRef.current.scrollTop = e.currentTarget.scrollTop; }}
                aria-label="Markdown editor"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="right">
        <div className={`panel grow ${maxPanel === "preview" ? "panel-max" : ""}`} ref={previewPanelRef}>
          <div className="panel-header">
            <div className="panel-title">Preview</div>
            <div className="panel-actions">
              <button className="icon-btn" title="Copy HTML" aria-label="Copy HTML" onClick={copyPreviewHTML}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              </button>
              <button className="icon-btn" title="Download HTML" aria-label="Download HTML" onClick={downloadPreviewHTML}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              </button>
              <button className="icon-btn" title="Fullscreen" aria-label="Fullscreen" onClick={() => toggleMax("preview")}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6"/><path d="M9 21H3v-6"/><path d="M21 3l-7 7"/><path d="M3 21l7-7"/></svg>
              </button>
            </div>
          </div>
          <div className="panel-body">
            <div ref={previewRef} className="preview markdown-body" aria-live="polite" aria-label="Rendered preview" />
          </div>
        </div>
      </section>
      <div className={`toast ${toast ? "show" : ""}`} role="status" aria-live="polite" aria-atomic="true">
        {toast}
      </div>
    </>
  );
}
