export function formatBytes(bytes: number) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"] as const;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}

export function isImage(file: File) {
  return file.type.startsWith("image/");
}

export function snippetFor(file: File, url: string) {
  const safeName = file.name.replace(/\]/g, ")");
  if (isImage(file)) return `![${safeName}](${url})`;
  return `[${safeName}](${url})`;
}
