"use client";

import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import GoogleAuthButton from "../../components/auth/GoogleAuthButton";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row pt-24">
      {/* ── Left Panel: Brand Context ── */}
      <div className="bg-[#aea3cf]/95 lg:w-5/12 flex flex-col justify-center px-6 py-10 lg:p-16 xl:p-24 relative overflow-hidden">
        <div className="max-w-md mx-auto relative z-10 w-full">
          <p className="font-sans font-bold text-xs uppercase tracking-[0.25em] text-slate-800 mb-6 lg:mb-8">
            NEOKART TECH CLUB
          </p>

          <h1 className="font-serif font-normal text-4xl lg:text-5xl xl:text-6xl text-[#0a0a0a] leading-tight mb-6">
            Enter the world of futuristic innovation.
          </h1>

          <p className="font-sans text-slate-600 text-base leading-relaxed mb-12 max-w-sm">
            Create an account to unlock member rewards, early access to new gadget releases, and a faster checkout experience.
          </p>

          <div className="flex items-center gap-3 text-slate-700">
            <ShieldCheck size={20} className="text-slate-900" />
            <span className="font-sans font-medium text-sm">Secure Account Access</span>
          </div>
        </div>
      </div>

      {/* ── Right Panel: Google-only Registration ── */}
      <div className="bg-black lg:w-7/12 flex flex-col justify-center px-6 py-10 lg:p-16 xl:p-24 overflow-y-auto">
        <div className="max-w-lg mx-auto w-full">
          <h2 className="font-sans font-bold text-4xl md:text-5xl text-white mb-3">
            Create Account
          </h2>
          <p className="font-sans text-slate-400 text-base mb-10">
            Sign up in seconds with your Google account.
          </p>

          {/* Google SSO */}
          <div className="mb-10">
            <GoogleAuthButton mode="register" />
          </div>

          {/* Footer */}
          <div className="text-center">
            <Link
              href="/sign-in"
              className="font-sans text-sm text-slate-300 hover:text-white transition-colors"
            >
              Already have an account? <span className="font-bold text-slate-100">Sign In</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
