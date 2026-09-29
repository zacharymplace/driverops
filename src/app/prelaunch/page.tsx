"use client";

import dynamic from "next/dynamic";

// This page reads browser storage while rendering, so the server HTML (empty storage) never matches the client once data exists.
// Render it on the client only, as the dashboard does.
const PrelaunchClient = dynamic(() => import("./PrelaunchClient"), { ssr: false });

export default function PrelaunchPage() {
  return <PrelaunchClient />;
}
