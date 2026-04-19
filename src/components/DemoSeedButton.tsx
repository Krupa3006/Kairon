"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export default function DemoSeedButton() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSeed() {
    setError("");

    startTransition(async () => {
      const response = await fetch("/api/demo-seed", { method: "POST" });
      const payload = await response.json();

      if (!response.ok) {
        setError(payload.error ?? "Unable to seed demo jobs.");
        return;
      }

      router.refresh();
    });
  }

  return (
    <div className="flex flex-col items-start gap-3">
      <button className="btn btn-primary" onClick={handleSeed} disabled={isPending}>
        {isPending ? "Loading demo jobs..." : "Load demo pipeline"}
      </button>
      {error ? <p className="text-sm text-danger">{error}</p> : null}
    </div>
  );
}
