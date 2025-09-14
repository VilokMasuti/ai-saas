"use client";

import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [session, setSession] = useState(null);

  useEffect(() => {
    if (!sessionId) return;

    axios
      .get(`/api/stripe/session?session_id=${sessionId}`)
      .then((res) => setSession(res.data))
      .catch((err) => console.error("Failed to fetch session:", err));
  }, [sessionId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = "/dashboard";
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-[#0a0a0a] to-[#1a1a1a] text-white flex flex-col items-center justify-center px-6">
      <div className="max-w-xl w-full text-center border border-white/10 rounded-2xl p-10 shadow-lg backdrop-blur-md bg-white/5 animate-fade-in">
        <h1 className="text-4xl font-semibold mb-4 tracking-tight">🎉 You&#39;re In!</h1>
        <p className="text-white/80 text-lg mb-6">
          Welcome <span className="font-medium">{session?.customer_email}</span>, your subscription is now active.
        </p>

        <div className="relative w-full h-2 bg-white/10 rounded-full overflow-hidden mb-4">
          <div className="absolute top-0 left-0 h-full bg-white transition-all duration-[5000ms] w-full animate-progress" />
        </div>

        <p className="text-sm text-white/60">Redirecting to dashboard...</p>
      </div>
    </main>
  );
}
