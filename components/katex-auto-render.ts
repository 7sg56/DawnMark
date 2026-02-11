
// KaTeX auto-render lacks proper TypeScript definitions for the dist file.
// We import it here with @ts-expect-error and re-export a typed version.
// @ts-expect-error - dist file is untyped
import renderMathInElementOriginal from "katex/dist/contrib/auto-render";

interface RenderMathInElementOptions {
  delimiters?: Array<{
    left: string;
    right: string;
    display: boolean;
  }>;
  ignoredTags?: string[];
  ignoredClasses?: string[];
  errorCallback?: (msg: string, err: Error) => void;
  throwOnError?: boolean;
  [key: string]: unknown;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const renderMathInElement: (elem: HTMLElement, options?: RenderMathInElementOptions) => void = renderMathInElementOriginal as any;

export default renderMathInElement;
