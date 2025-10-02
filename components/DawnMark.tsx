"use client";

import React, { useEffect, useRef, useState } from "react";
import DOMPurify from "dompurify";
import { marked } from "marked";
import { markedHighlight } from "marked-highlight";
import hljs from "highlight.js";

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

  // Load saved content
  useEffect(() => {
    const saved = localStorage.getItem("dawnmark:text");
    if (saved) setText(saved);
  }, []);

  // Persist content (debounced)
  useEffect(() => {
    const id = setTimeout(() => {
      localStorage.setItem("dawnmark:text", text);
    }, 250);
    return () => clearTimeout(id);
  }, [text]);

  // Render markdown -> preview
  useEffect(() => {
    if (!previewRef.current) return;
    const html = marked.parse(text) as string;
    const safe = DOMPurify.sanitize(html, {
      USE_PROFILES: { html: true },
      ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto|tel|ftp|data|blob):|[^a-z]|[a-z+.-]+(?:[^a-z+.-]|$))/i,
    });
    previewRef.current.innerHTML = safe;
  }, [text]);

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

  // Revoke object URLs on unmount
  useEffect(() => {
    return () => {
      files.forEach((f) => URL.revokeObjectURL(f.url));
    };
  }, [files]);

  function openFileDialog() {
    fileInputRef.current?.click();
  }

  async function copySnippet(snippet: string) {
    try {
      await navigator.clipboard.writeText(snippet);
      showToast("Copied Markdown to clipboard");
    } catch {
      showToast("Copy failed");
    }
  }

  function showToast(msg: string) {
    setToast(msg);
    const id = setTimeout(() => setToast(""), 1200);
    return () => clearTimeout(id);
  }

  return (
    <>
      <section className="left">
        <div className="uploader" aria-label="File uploader">
          <div className="uploader-top">
            <button className="button" onClick={openFileDialog}>Upload files</button>
            <div
              id="dropzone"
              ref={dropzoneRef}
              className="dropzone"
              tabIndex={0}
              role="button"
              aria-label="Drop files here or press Enter to browse"
              onClick={openFileDialog}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") openFileDialog(); }}
            >
              <p>Drop files here or click to browse</p>
            </div>
            <input
              ref={fileInputRef}
              id="file-input"
              type="file"
              multiple
              hidden
              onChange={(e) => handleFiles(e.currentTarget.files)}
            />
          </div>
          <ul className="file-list" aria-live="polite">
            {files.map((f) => (
              <li
                key={f.id}
                className="file-item"
                title="Click to copy Markdown"
                onClick={() => copySnippet(f.snippet)}
              >
                <span className="file-name">{f.file.name}</span>
                <span className="file-meta">{formatBytes(f.file.size)}</span>
              </li>
            ))}
          </ul>
          <p className="hint">Tip: Click a file to copy its Markdown snippet, then paste it into the editor.</p>
        </div>
        <div className="editor-wrap">
          <textarea
            id="editor"
            placeholder={`Write Markdown here...\n\nExamples:\n\n# Hello DawnMark\n\nPaste attachments like:\n![Image alt text](blob:...)\n[Document.pdf](blob:...)`}
            value={text}
            onChange={(e) => setText(e.currentTarget.value)}
            aria-label="Markdown editor"
          />
        </div>
      </section>
      <section className="right">
        <div ref={previewRef} className="preview markdown-body" aria-live="polite" aria-label="Rendered preview" />
      </section>
      <div className={`toast ${toast ? "show" : ""}`} role="status" aria-live="polite" aria-atomic="true">
        {toast}
      </div>
    </>
  );
}
