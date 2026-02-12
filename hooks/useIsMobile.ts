"use client";

import { useState, useEffect } from "react";

export function useIsMobile(breakpoint: number = 768) {
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
      setIsLoading(false);
    };

    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkIsMobile, 100);
    };

    // Check on mount
    checkIsMobile();

    // Add event listener for resize
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeoutId);
    };
  }, [breakpoint]);

  return { isMobile, isLoading };
}
