"use client";

import { Printer } from "lucide-react";

export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 border-2 border-black bg-white px-4 py-2 font-mono text-xs uppercase tracking-widest text-black"
    >
      <Printer size={15} strokeWidth={2.5} />
      Print / Save as PDF
    </button>
  );
}
