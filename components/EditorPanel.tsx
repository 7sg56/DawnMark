"use client";

import React from "react";
import MonacoEditor from "./MonacoEditor";
import { CopyIcon, DownloadIcon, MaximizeIcon, UploadIcon, TrashIcon, ResetIcon } from "./Icons";

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

  return (
    <div className={`panel grow ${maxPanel === "editor" ? "panel-max" : ""}`}>
      <div className="panel-header">
        <div className="panel-title">Editor</div>
        <div className="panel-actions">
          <button className="icon-btn" title="Upload files" aria-label="Upload files" onClick={onOpenFileDialog}>
            <UploadIcon />
          </button>
          <button className="icon-btn" title="Copy Markdown" aria-label="Copy Markdown" onClick={onCopyMarkdown}>
            <CopyIcon />
          </button>
          <button className="icon-btn" title="Download Markdown" aria-label="Download Markdown" onClick={onDownloadMarkdown}>
            <DownloadIcon />
          </button>
          <button className="icon-btn" title="Clear editor" aria-label="Clear editor" onClick={onClearEditor}>
            <TrashIcon />
          </button>
          <button className="icon-btn" title="Reset to welcome content" aria-label="Reset to welcome content" onClick={onResetToWelcome}>
            <ResetIcon />
          </button>
          <button className="icon-btn" title="Fullscreen" aria-label="Fullscreen" onClick={() => onToggleMax("editor")}>
            <MaximizeIcon />
          </button>
        </div>
      </div>
      <div className="panel-body editor-body">
        <MonacoEditor
          value={text}
          onChange={onTextChange}
          className="monaco-editor-wrapper"
        />
      </div>
    </div>
  );
}