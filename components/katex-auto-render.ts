// @ts-expect-error - KaTeX auto-render doesn't have proper TypeScript types
import renderMathInElementRaw from "katex/dist/contrib/auto-render";

export interface KatexDelimiter {
  left: string;
  right: string;
  display: boolean;
}

export interface KatexOptions {
  delimiters?: KatexDelimiter[];
  throwOnError?: boolean;
  errorCallback?: (msg: string, err: Error) => void;
  ignoredTags?: string[];
  [key: string]: any;
}

const renderMathInElement = renderMathInElementRaw as (
  element: HTMLElement,
  options?: KatexOptions
) => void;

export default renderMathInElement;
