"use client";

import React from "react";
import { CopyIcon, DownloadIcon, MaximizeIcon } from "./Icons";

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
            <CopyIcon />
          </button>
          <button className="icon-btn" title="Download HTML" aria-label="Download HTML" onClick={onDownloadPreviewHTML}>
            <DownloadIcon />
          </button>
          <button className="icon-btn" title="Fullscreen" aria-label="Fullscreen" onClick={() => onToggleMax("preview")}>
            <MaximizeIcon />
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