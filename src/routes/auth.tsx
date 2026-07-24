import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { LogIn } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "@/hooks/use-auth";
import logo from "@/assets/acg-logo.jpg.asset.json";

const searchSchema = z.object({ redirect: z.string().optional() });

export const Route = createFileRoute("/auth")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Sign in — Ariana Coach Group" },
      { name: "description", content: "Sign in to manage Ariana Coach Group content." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { redirect } = useSearch({ from: "/auth" });
  const navigate = useNavigate();
  const { session, loading } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && session) {
      navigate({ to: redirect || "/admin" });
    }
  }, [session, loading, redirect, navigate]);

  async function signInGoogle() {
    setBusy(true);
    setError(null);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + "/auth",
    });
    if (result.error) {
      setError(result.error.message ?? "Sign in failed");
      setBusy(false);
      return;
    }
    if (result.redirected) return;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-hero-gradient px-4 text-white">
      <div className="w-full max-w-md rounded-2xl bg-card p-8 text-foreground shadow-elegant">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo.url} alt="ACG" className="h-10 w-10 rounded-md object-contain" />
          <div className="text-sm font-bold">Ariana Coach Group</div>
        </Link>
        <h1 className="mt-6 text-2xl font-bold">Sign in to admin</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Only authorized administrators can manage site content.
        </p>
        {error && (
          <div className="mt-4 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}
        <button
          onClick={signInGoogle}
          disabled={busy}
          className="mt-6 inline-flex w-full items-center justify-center gap-3 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60"
        >
          <LogIn className="h-4 w-4" /> {busy ? "Redirecting…" : "Continue with Google"}
        </button>
        <div className="mt-6 text-center text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground">← Back to site</Link>
        </div>
      </div>
    </div>
  );
}