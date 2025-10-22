"use client";

import React, { useRef, useEffect, useState } from "react";
import { Editor } from "@monaco-editor/react";
import dynamic from "next/dynamic";

interface MonacoEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  onScroll?: (e: React.UIEvent<HTMLTextAreaElement>) => void;
}

export default function MonacoEditor({
  value,
  onChange,
  placeholder,
  className = "",
  onScroll
}: MonacoEditorProps) {
  const editorRef = useRef<any>(null);
  const [theme, setTheme] = useState('vs-dark');
  const [isClient, setIsClient] = useState(false);

  // Check if we're on the client side
  useEffect(() => {
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
      renderLineHighlight: 'none',
      selectOnLineNumbers: true,
      roundedSelection: false,
      readOnly: false,
      cursorStyle: 'line',
      automaticLayout: true,
      fontSize: 14,
      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
      lineHeight: 24,
      padding: { top: 16, bottom: 16, left: 16, right: 16 },
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

  const handleEditorScroll = () => {
    if (onScroll && editorRef.current) {
      // Create a synthetic event for scroll
      const syntheticEvent = {
        currentTarget: {
          scrollTop: editorRef.current.getScrollTop(),
          scrollLeft: editorRef.current.getScrollLeft(),
        }
      } as React.UIEvent<HTMLTextAreaElement>;
      
      onScroll(syntheticEvent);
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
          lineNumbersMinChars: 3,
          renderLineHighlight: 'none',
          selectOnLineNumbers: true,
          roundedSelection: false,
          readOnly: false,
          cursorStyle: 'line',
          automaticLayout: true,
          fontSize: 14,
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
          lineHeight: 24,
          padding: { top: 16, bottom: 16, left: 12, right: 16 },
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
