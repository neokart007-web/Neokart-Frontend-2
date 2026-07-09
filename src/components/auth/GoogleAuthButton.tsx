"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useToast } from "../../context/ToastContext";
import { useCart } from "../../context/CartContext";

interface GoogleAuthButtonProps {
  mode?: "signin" | "register";
}

// Check if Google OAuth is configured
function isGoogleConfigured() {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  return clientId && clientId !== "YOUR_GOOGLE_CLIENT_ID_HERE";
}

function GoogleAuthButtonConfigured({ mode = "signin" }: GoogleAuthButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { showToast } = useToast();
  const { syncCartAfterLogin } = useCart();

  // Dynamically import useGoogleLogin only when configured
  const { useGoogleLogin } = require("@react-oauth/google");

  const baseUrl = process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL.replace("/api", "")
    : "http://localhost:5000";

  const googleLogin = useGoogleLogin({
    flow: "implicit",
    onSuccess: async (tokenResponse: any) => {
      try {
        setLoading(true);
        setError(null);

        // Get user info from Google using access token
        const userInfo = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } }
        );

        const { sub: googleId, email, name, picture } = userInfo.data;

        // Send to our backend. `mode` tells it whether this is a sign in or a sign up
        // so it can reject signing in when not registered, or signing up when already registered.
        const res = await axios.post(`${baseUrl}/api/v1/auth/google`, {
          credential: tokenResponse.access_token,
          googleId,
          email,
          name,
          picture,
          mode,
        });

        if (res.data.data) {
          localStorage.setItem("heedy_user", JSON.stringify(res.data.data));
          // Merge any guest cart into the account cart and restore saved items.
          await syncCartAfterLogin();

          showToast(
            mode === "signin"
              ? "Signed in with Google successfully!"
              : "Account created with Google successfully!",
            "success"
          );
          router.push("/");
        }
      } catch (err: any) {
        console.error("Google auth error:", err);
        setError(
          err.response?.data?.message || "Google sign-in failed. Please try again."
        );
      } finally {
        setLoading(false);
      }
    },
    onError: (error: any) => {
      console.error("Google login error:", error);
      setError("Google sign-in was cancelled or failed. Please try again.");
    },
  });

  return (
    <GoogleButtonUI
      loading={loading}
      error={error}
      mode={mode}
      disabled={false}
      onClick={() => googleLogin()}
    />
  );
}

function GoogleButtonUI({
  loading,
  error,
  mode,
  disabled,
  onClick,
}: {
  loading: boolean;
  error: string | null;
  mode: "signin" | "register";
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <div className="w-full">
      {error && (
        <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-xl text-sm font-medium border border-red-100 text-center">
          {error}
        </div>
      )}

      <button
        type="button"
        onClick={onClick}
        disabled={loading || disabled}
        className="group relative w-full flex items-center justify-center gap-3 bg-black border-2 border-slate-200 rounded-xl py-4 px-6
          hover:border-slate-300 hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-100/50
          active:scale-[0.98] 
          transition-all duration-300 ease-out
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:hover:scale-100"
      >
        {/* Google Logo */}
        {loading ? (
          <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
        ) : (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            className="flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
          >
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
        )}

        <span className="font-sans font-semibold text-sm text-slate-200 tracking-wide group-hover:text-white transition-colors duration-300">
          {loading
            ? "Connecting..."
            : disabled
            ? "Google Sign-In (Not configured)"
            : mode === "signin"
            ? "Continue with Google"
            : "Sign up with Google"}
        </span>

        {/* Subtle shine effect on hover */}
        {!disabled && (
          <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
            <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          </div>
        )}
      </button>
    </div>
  );
}

export default function GoogleAuthButton({ mode = "signin" }: GoogleAuthButtonProps) {
  if (!isGoogleConfigured()) {
    return (
      <GoogleButtonUI
        loading={false}
        error={null}
        mode={mode}
        disabled={true}
        onClick={() => {}}
      />
    );
  }

  return <GoogleAuthButtonConfigured mode={mode} />;
}
