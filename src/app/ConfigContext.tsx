"use client";

import { createContext, useContext } from "react";

export const ConfigContext = createContext<any>(null);

export function useConfig() {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error("useConfig must be used within a ConfigProvider");
  }
  return context;
}
