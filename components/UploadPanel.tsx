"use client";

import React, { useRef, useEffect, useCallback } from "react";
import Image from "next/image";

interface BlobEntry {
  id: string;
  file: File;
  url: string;
  snippet: string;
}

interface UploadPanelProps {
  files: BlobEntry[];
  onFilesChange: (files: BlobEntry[]) => void;
  onCopySnippet: (snippet: string) => void;
  onCopyAllSnippets: () => void;
  onDownloadSnippets: () => void;
  maxPanel: string | null;
}

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

const UploadPanel = React.memo(({
  files,
  onFilesChange,
  onCopySnippet,
  onCopyAllSnippets,
  onDownloadSnippets,
  maxPanel
}: UploadPanelProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const dropzoneRef = useRef<HTMLDivElement | null>(null);
  const urlsRef = useRef<string[]>([]);

  const handleFiles = useCallback((list: FileList | null) => {
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
    onFilesChange([...next, ...files]);
  }, [files, onFilesChange]);

  function openFileDialog() {
    fileInputRef.current?.click();
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
  }, [handleFiles]);

  // Cleanup URLs on unmount
  useEffect(() => {
    const urls = urlsRef.current;
    return () => {
      urls.forEach((u) => URL.revokeObjectURL(u));
    };
  }, []);

  return (
    <div className={`panel uploads ${maxPanel === "uploads" ? "panel-max" : ""}`}>
      <div className="panel-header">
        <div className="panel-title">Uploads</div>
        <div className="panel-actions">
          <button className="icon-btn" title="Upload files" aria-label="Upload files" onClick={openFileDialog}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 5 17 10"/><line x1="12" y1="5" x2="12" y2="21"/></svg>
          </button>
          <button className="icon-btn" title="Copy all snippets" aria-label="Copy all snippets" onClick={onCopyAllSnippets}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          </button>
          <button className="icon-btn" title="Download snippets" aria-label="Download snippets" onClick={onDownloadSnippets}>
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
                onClick={() => onCopySnippet(f.snippet)}
              >
                <div className="file-thumb" aria-hidden="true">
                  {isImage(f.file) ? (
                    <Image src={f.url} alt="" fill unoptimized className="object-cover" />
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
  );
});

export default UploadPanel;