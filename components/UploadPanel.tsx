"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import { BlobEntry } from "./types";
import { formatBytes, isImage } from "./file-utils";

interface UploadPanelProps {
  files: BlobEntry[];
  onUploadFiles: (files: FileList | null) => void;
  onOpenFileDialog: () => void;
  onCopySnippet: (snippet: string) => void;
  onCopyAllSnippets: () => void;
  onDownloadSnippets: () => void;
  maxPanel: string | null;
}

export default function UploadPanel({
  files,
  onUploadFiles,
  onOpenFileDialog,
  onCopySnippet,
  onCopyAllSnippets,
  onDownloadSnippets,
  maxPanel
}: UploadPanelProps) {
  const dropzoneRef = useRef<HTMLDivElement | null>(null);
  const onUploadFilesRef = useRef(onUploadFiles);

  useEffect(() => {
    onUploadFilesRef.current = onUploadFiles;
  });

  // Dropzone interactions
  useEffect(() => {
    const dz = dropzoneRef.current;
    if (!dz) return;
    const onDrop = (e: DragEvent) => {
      e.preventDefault();
      dz.classList.remove("dragover");
      onUploadFilesRef.current(e.dataTransfer?.files ?? null);
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

  return (
    <div className={`panel uploads ${maxPanel === "uploads" ? "panel-max" : ""}`}>
      <div className="panel-header">
        <div className="panel-title">Uploads</div>
        <div className="panel-actions">
          <button className="icon-btn" title="Upload files" aria-label="Upload files" onClick={onOpenFileDialog}>
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
          onClick={(e) => { const target = e.target as HTMLElement; if (target.closest(".file-item")) return; onOpenFileDialog(); }}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onOpenFileDialog(); }}
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
        <p className="hint">Tip: Click a file to copy its Markdown snippet, then paste it into the editor.</p>
      </div>
    </div>
  );
});

export default UploadPanel;