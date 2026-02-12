export interface BlobEntry {
  id: string;
  file: File;
  url: string;
  snippet: string;
}

export interface MonacoEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}
