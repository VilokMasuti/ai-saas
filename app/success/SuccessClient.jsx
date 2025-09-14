"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

export default function SuccessClient() {
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
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">
      <div className="max-w-xl w-full text-center border border-white/10 rounded-2xl p-10 shadow-lg backdrop-blur-md bg-white/5 animate-fade-in">
        <h1 className="text-4xl font-semibold mb-4 tracking-tight">🎉 You&#39;re In!</h1>
        {session ? (
          <>
            <p className="text-white/80 text-lg mb-6">
              Welcome <span className="font-medium">{session.customer_email}</span>, your subscription is now active.
            </p>
            <p className="text-sm text-white/60">Redirecting to dashboard...</p>
          </>
        ) : (
          <p className="text-white/60">Verifying your subscription...</p>
        )}
      </div>
    </div>
  );
}
