"use client";

import { useEffect, useState } from "react";

import {
  getBusinessSnapshot,
  type BusinessSnapshot,
} from "@/engine/business";

export function useBusinessSnapshot() {
  const [snapshot, setSnapshot] = useState<BusinessSnapshot | undefined>();

  useEffect(() => {
    function refresh() {
      setSnapshot(getBusinessSnapshot());
    }

    refresh();

    window.addEventListener("storage", refresh);
    window.addEventListener("driverops:state-change", refresh);

    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("driverops:state-change", refresh);
    };
  }, []);

  return snapshot;
}

export function emitDriverOpsStateChange() {
  window.dispatchEvent(new Event("driverops:state-change"));
}
