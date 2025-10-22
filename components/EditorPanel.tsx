"use client";

import React, { useRef } from "react";
import MonacoEditor from "./MonacoEditor";

interface EditorPanelProps {
  text: string;
  onTextChange: (text: string) => void;
  onOpenFileDialog: () => void;
  onCopyMarkdown: () => void;
  onDownloadMarkdown: () => void;
  onClearEditor: () => void;
  onResetToWelcome: () => void;
  maxPanel: string | null;
  onToggleMax: (panel: "uploads" | "editor" | "preview") => void;
}

export default function EditorPanel({
  text,
  onTextChange,
  onOpenFileDialog,
  onCopyMarkdown,
  onDownloadMarkdown,
  onClearEditor,
  onResetToWelcome,
  maxPanel,
  onToggleMax
}: EditorPanelProps) {
  const gutterRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className={`panel grow ${maxPanel === "editor" ? "panel-max" : ""}`}>
      <div className="panel-header">
        <div className="panel-title">Editor</div>
        <div className="panel-actions">
          <button className="icon-btn" title="Upload files" aria-label="Upload files" onClick={onOpenFileDialog}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 5 17 10"/><line x1="12" y1="5" x2="12" y2="21"/></svg>
          </button>
          <button className="icon-btn" title="Copy Markdown" aria-label="Copy Markdown" onClick={onCopyMarkdown}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          </button>
          <button className="icon-btn" title="Download Markdown" aria-label="Download Markdown" onClick={onDownloadMarkdown}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          </button>
          <button className="icon-btn" title="Clear editor" aria-label="Clear editor" onClick={onClearEditor}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
          </button>
          <button className="icon-btn" title="Reset to welcome content" aria-label="Reset to welcome content" onClick={onResetToWelcome}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>
          </button>
          <button className="icon-btn" title="Fullscreen" aria-label="Fullscreen" onClick={() => onToggleMax("editor")}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6"/><path d="M9 21H3v-6"/><path d="M21 3l-7 7"/><path d="M3 21l7-7"/></svg>
          </button>
        </div>
      </div>
      <div className="panel-body editor-body">
        <MonacoEditor
          value={text}
          onChange={onTextChange}
          placeholder="Start typing to replace the welcome content..."
          className="monaco-editor-wrapper"
        />
      </div>
    </div>
  );
}