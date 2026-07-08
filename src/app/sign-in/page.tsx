"use client";

import Link from "next/link";
import { ShieldCheck, UserPlus } from "lucide-react";
import GoogleAuthButton from "../../components/auth/GoogleAuthButton";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row pt-24">
      {/* ── Left Panel: Brand Context ── */}
      <div className="bg-[#aea3cf]/95 md:w-1/2 flex flex-col justify-center px-6 py-10 md:p-16 lg:p-24 relative overflow-hidden">
        {/* Subtle decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#e8ddd4]/60 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-[#d4c5b5]/40 to-transparent rounded-full blur-2xl" />

        <div className="max-w-lg mx-auto relative z-10 w-full">
          <p className="font-sans font-bold text-xs uppercase tracking-[0.25em] text-slate-800 mb-6 md:mb-8">
            NEOKART LUXURY COMMERCE
          </p>

          <h1 className="font-serif font-normal text-4xl md:text-5xl lg:text-6xl text-[#0a0a0a] leading-tight mb-6">
            Welcome back to your premium beauty experience.
          </h1>

          <p className="font-sans text-slate-600 text-base leading-relaxed mb-12 max-w-sm">
            Sign in to access your curated collection, track orders, and enjoy a seamless luxury shopping journey.
          </p>

          <div className="flex items-center gap-3 text-slate-700">
            <ShieldCheck size={20} className="text-slate-900" />
            <span className="font-sans font-medium text-sm">Secure Authentication</span>
          </div>
        </div>
      </div>

      {/* ── Right Panel: Google-only Sign In ── */}
      <div className="bg-black md:w-1/2 flex flex-col justify-center px-6 py-10 md:p-16 lg:p-24">
        <div className="max-w-lg mx-auto w-full">
          <h2 className="font-sans font-bold text-4xl md:text-5xl text-white mb-3">
            Sign In
          </h2>
          <p className="font-sans text-slate-400 text-base mb-10">
            Continue with your Google account.
          </p>

          {/* Google SSO */}
          <div className="mb-10">
            <GoogleAuthButton mode="signin" />
          </div>

          {/* Footer */}
          <div className="text-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-1.5 font-sans text-sm text-slate-300 hover:text-white transition-colors"
            >
              New to Neokart? <span className="font-bold text-slate-100">Create Account</span> <UserPlus size={16} className="text-slate-100" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
