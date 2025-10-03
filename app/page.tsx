"use client";

import { useIsMobile } from "../hooks/useIsMobile";
import DawnMark from "../components/DawnMark";
import MobileComingSoon from "../components/MobileComingSoon";

export default function Home() {
  const { isMobile, isLoading } = useIsMobile();

  // Show loading state briefly to prevent hydration mismatch
  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  // Mobile view
  if (isMobile) {
    return <MobileComingSoon />;
  }

  // Desktop view
  return (
    <main className="dm-container">
      <DawnMark />
    </main>
  );
}
