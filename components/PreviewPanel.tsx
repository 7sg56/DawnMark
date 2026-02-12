"use client";

import React from "react";

interface PreviewPanelProps {
  previewRef: React.RefObject<HTMLDivElement | null>;
  onCopyPreviewHTML: () => void;
  onDownloadPreviewHTML: () => void;
  maxPanel: string | null;
  onToggleMax: (panel: "uploads" | "editor" | "preview") => void;
}

const PreviewPanel = React.memo(({
  previewRef,
  onCopyPreviewHTML,
  onDownloadPreviewHTML,
  maxPanel,
  onToggleMax
}: PreviewPanelProps) => {
  return (
    <div className={`panel grow ${maxPanel === "preview" ? "panel-max" : ""}`}>
      <div className="panel-header">
        <div className="panel-title">Preview</div>
        <div className="panel-actions">
          <button className="icon-btn" title="Copy HTML" aria-label="Copy HTML" onClick={onCopyPreviewHTML}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          </button>
          <button className="icon-btn" title="Download HTML" aria-label="Download HTML" onClick={onDownloadPreviewHTML}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          </button>
          <button className="icon-btn" title="Fullscreen" aria-label="Fullscreen" onClick={() => onToggleMax("preview")}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6"/><path d="M9 21H3v-6"/><path d="M21 3l-7 7"/><path d="M3 21l7-7"/></svg>
          </button>
        </div>
      </div>
      <div className="panel-body">
        <div ref={previewRef} className="preview markdown-body" aria-live="polite" aria-label="Rendered preview" />
      </div>
    </div>
  );
});

export default PreviewPanel;