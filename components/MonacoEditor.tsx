"use client";

import React, { useRef, useEffect, useState } from "react";
import { Editor } from "@monaco-editor/react";

interface MonacoEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function MonacoEditor({
  value,
  onChange,
  className = ""
}: MonacoEditorProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const editorRef = useRef<any>(null);
  const [theme, setTheme] = useState('vs-dark');
  const [isClient, setIsClient] = useState(false);

  // Track the last value we emitted to avoid loops
  const lastEmittedValue = useRef<string | null>(null);

  // Check if we're on the client side
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsClient(true);
  }, []);

  // Detect theme from HTML class
  useEffect(() => {
    if (!isClient) return;

    const updateTheme = () => {
      const isDark = document.documentElement.classList.contains('dark') ||
        !document.documentElement.classList.contains('light');
      setTheme(isDark ? 'vs-dark' : 'vs');
    };

    updateTheme();

    // Watch for theme changes
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, [isClient]);

  // Sync value from props to editor, BUT only if it's different (external change)
  useEffect(() => {
    if (editorRef.current) {
      const model = editorRef.current.getModel();
      const currentValue = model.getValue();

      // If the prop value is different from what we sought to have (and different from current)
      // This handles "Reset", "Clear", or "Load Template" actions
      // CRITICAL FIX: Ignore updates if editor has focus, assuming they are stale "echoes" of our own typing.
      // We only want to accept updates if the user triggered an action outside the editor (which removes focus).
      if (value !== currentValue && value !== lastEmittedValue.current && !editorRef.current.hasTextFocus()) {
        editorRef.current.setValue(value);
      }
    }
  }, [value]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;

    // Configure editor options
    editor.updateOptions({
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      wordWrap: 'on',
      lineNumbers: 'off',
      glyphMargin: false,
      folding: false,
      lineDecorationsWidth: 0,
      lineNumbersMinChars: 0,
      renderLineHighlight: 'none',
      selectOnLineNumbers: false,
      roundedSelection: false,
      readOnly: false,
      cursorStyle: 'line',
      automaticLayout: true,
      fontSize: 14,
      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
      lineHeight: 24,
      padding: { top: 16, bottom: 16 },
      scrollbar: {
        vertical: 'auto',
        horizontal: 'auto',
        useShadows: false,
        verticalHasArrows: false,
        horizontalHasArrows: false,
      },
    });

    // Language is already set via defaultLanguage prop
  };

  const handleEditorChange = (newValue: string | undefined) => {
    if (newValue !== undefined) {
      lastEmittedValue.current = newValue;
      onChange(newValue);
    }
  };


  // Show loading state during SSR
  if (!isClient) {
    return (
      <div className={`monaco-editor-container ${className}`}>
        <div className="monaco-loading">
          <div className="loading-text">Loading editor...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`monaco-editor-container ${className}`}>
      <Editor
        height="100%"
        width="100%"
        defaultLanguage="markdown"
        defaultValue={value}
        // Remove value prop to make it uncontrolled/semi-controlled
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        theme={theme}
        options={{
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          lineNumbers: 'off',
          glyphMargin: false,
          folding: false,
          lineDecorationsWidth: 0,
          lineNumbersMinChars: 0,
          renderLineHighlight: 'none',
          selectOnLineNumbers: false,
          roundedSelection: false,
          readOnly: false,
          cursorStyle: 'line',
          automaticLayout: true,
          fontSize: 14,
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
          lineHeight: 24,
          padding: { top: 16, bottom: 16 },
          scrollbar: {
            vertical: 'auto',
            horizontal: 'auto',
            useShadows: false,
            verticalHasArrows: false,
            horizontalHasArrows: false,
          },
        }}
      />
    </div>
  );
}
