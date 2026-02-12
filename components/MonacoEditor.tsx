"use client";

import React from "react";
import dynamic from "next/dynamic";
import { MonacoEditorProps } from "./types";

const MonacoEditorClient = dynamic(() => import("./MonacoEditorClient"), {
  ssr: false,
  loading: () => (
    <div className="monaco-loading">
      <div className="loading-text">Loading editor...</div>
    </div>
  ),
});

export default function MonacoEditor({
  value,
  onChange,
  className = ""
}: MonacoEditorProps) {
  return (
    <div className={`monaco-editor-container ${className}`}>
      <MonacoEditorClient
        value={value}
        onChange={onChange}
        className={className}
      />
    </div>
  );
}
