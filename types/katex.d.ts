declare module "katex/dist/contrib/auto-render" {
  /**
   * Auto-render TeX expressions in HTML element
   * @param elem HTML element to auto-render
   * @param options Render options
   */
  export default function renderMathInElement(
    elem: HTMLElement,
    options?: {
      delimiters?: Array<{
        left: string;
        right: string;
        display: boolean;
      }>;
      ignoredTags?: string[];
      ignoredClasses?: string[];
      errorCallback?: (msg: string, err: Error) => void;
      throwOnError?: boolean;
      [key: string]: any;
    }
  ): void;
}
