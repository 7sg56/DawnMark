"use client";

import { useIsMobile } from "../hooks/useIsMobile";
import Header from "./Header";

interface LayoutContentProps {
  children: React.ReactNode;
}

export default function LayoutContent({ children }: LayoutContentProps) {
  const { isMobile, isLoading } = useIsMobile();

  return (
    <>
      {!isMobile && !isLoading && <Header />}
      {children}
    </>
  );
}