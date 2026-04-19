"use client";

import { useEffect } from "react";

const ContentBlocker = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    document.body.classList.add("hydrated");
    
    // Keep static splash visible during CSS animation (300ms fade + 400ms delay = 700ms)
    const removeTimer = setTimeout(() => {
      const staticSplash = document.getElementById("splash-static");
      if (staticSplash) {
        staticSplash.remove();
      }
    }, 700);

    return () => clearTimeout(removeTimer);
  }, []);

  return <>{children}</>;
};

export default ContentBlocker;