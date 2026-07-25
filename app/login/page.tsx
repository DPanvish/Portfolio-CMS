"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { GitHub } from "lucide-react";

export default function Login() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/admin");
    }
  }, [status, router]);

  if (status === "loading") return <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-white">Loading...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-white px-4">
      <div className="max-w-md w-full bg-neutral-900 border border-neutral-800 p-8 rounded-2xl text-center shadow-2xl">
        <h1 className="text-3xl font-bold mb-2 tracking-tight">System Access</h1>
        <p className="text-neutral-400 text-sm mb-8">Authenticate to manage portfolio data.</p>
        
        <button
          onClick={() => signIn("github", { callbackUrl: "/admin" })}
          className="w-full flex items-center justify-center gap-3 bg-white text-black font-medium py-3 rounded-xl hover:bg-neutral-200 transition-colors"
        >
          <Github className="w-5 h-5" />
          Authorize via GitHub
        </button>
      </div>
    </div>
  );
}