"use client";

import React, { useEffect, useState } from "react";
import { Editor } from "@monaco-editor/react";
import { MonacoEditorProps } from "./types";

export default function MonacoEditorClient({
  value,
  onChange,
}: MonacoEditorProps) {
  const [theme, setTheme] = useState('vs-dark');

  // Detect theme from HTML class
  useEffect(() => {
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
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEditorDidMount = (editor: any) => {
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

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      onChange(value);
    }
  };

  return (
    <Editor
      height="100%"
      width="100%"
      defaultLanguage="markdown"
      value={value}
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
  );
}
