import { Suspense } from "react";
import { DiscoveryClient } from "./DiscoveryClient";
import { Loader2 } from "lucide-react";

export default function DiscoveryPage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 flex flex-col items-center justify-center gap-3 text-slate-500">
          <Loader2 className="w-6 h-6 animate-spin text-[#0C66E4]" />
          <p className="text-xs font-mono">Loading Product Discovery Workspace...</p>
        </div>
      }
    >
      <DiscoveryClient />
    </Suspense>
  );
}
