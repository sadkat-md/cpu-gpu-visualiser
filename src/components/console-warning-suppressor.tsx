"use client";

import { useEffect } from "react";

export function ConsoleWarningSuppressor() {
  useEffect(() => {
    const originalWarn = console.warn;
    console.warn = (...args) => {
      // Suppress the specific THREE.Clock warning coming from react-three-fiber
      if (
        typeof args[0] === "string" &&
        args[0].includes("THREE.Clock: This module has been deprecated")
      ) {
        return;
      }
      originalWarn(...args);
    };

    return () => {
      console.warn = originalWarn;
    };
  }, []);

  return null;
}
