"use client";

import { type PropsWithChildren, useRef } from "react";
import type { StoreInterface, StoreType } from "./store";
import { initializeStore, Provider } from "./store";

export interface PreloadedStoreInterface extends StoreInterface {}

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<StoreType>();

  if (!storeRef.current) {
    storeRef.current = initializeStore();
  }

  return <Provider value={storeRef.current}>{children}</Provider>;
}
