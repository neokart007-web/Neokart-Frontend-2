"use client";

import { useState, useRef, KeyboardEvent, useEffect, Suspense } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck, ArrowRight } from "lucide-react";
import Link from "next/link";

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendSuccess, setResendSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!email) {
      router.push("/register");
    }
  }, [email, router]);

  const handleChange = (index: number, value: string) => {
    // Allow only numbers
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if current one is filled
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      // Move to previous input on backspace if current is empty
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6).split("");
    const newOtp = [...otp];
    
    pastedData.forEach((char, index) => {
      if (/^\d+$/.test(char) && index < 6) {
        newOtp[index] = char;
      }
    });
    
    setOtp(newOtp);
    
    // Focus last filled input
    const lastFilledIndex = newOtp.findLastIndex(val => val !== "");
    const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
    inputRefs.current[focusIndex]?.focus();
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join("");
    
    if (otpValue.length !== 6) {
      setApiError("Please enter a valid 6-digit OTP.");
      return;
    }

    try {
      setIsSubmitting(true);
      setApiError(null);
      setResendSuccess(null);
      
      const baseUrl = process.env.NEXT_PUBLIC_API_URL 
        ? process.env.NEXT_PUBLIC_API_URL.replace('/api', '')
        : 'http://localhost:5000';
        
      const res = await axios.post(`${baseUrl}/api/v1/auth/verify-otp`, { email, otp: otpValue });

      // Success! Save user and redirect to home page
      if (res.data.data) {
        localStorage.setItem('heedy_user', JSON.stringify(res.data.data));
      }
      router.push("/");
    } catch (err: any) {
      console.error("Verification error:", err);
      setApiError(err.response?.data?.message || "Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    try {
      setApiError(null);
      setResendSuccess(null);
      
      const baseUrl = process.env.NEXT_PUBLIC_API_URL 
        ? process.env.NEXT_PUBLIC_API_URL.replace('/api', '')
        : 'http://localhost:5000';
        
      await axios.post(`${baseUrl}/api/v1/auth/resend-otp`, { email });

      setResendSuccess("A new verification code has been sent to your email.");
      setOtp(Array(6).fill(""));
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      console.error("Resend OTP error:", err);
      setApiError(err.response?.data?.message || "Something went wrong while resending OTP.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row pt-24">
      {/* ── Left Panel: Brand Context ── */}
      <div className="bg-[#F5F0EB] lg:w-5/12 flex flex-col justify-center px-8 pt-28 pb-16 lg:p-16 xl:p-24 relative overflow-hidden">
        <div className="max-w-md mx-auto relative z-10 w-full">
          <p className="font-sans font-bold text-xs uppercase tracking-[0.25em] text-slate-800 mb-6 lg:mb-8">
            HEEDY MEMBERSHIP
          </p>
          
          <h1 className="font-serif font-normal text-4xl lg:text-5xl xl:text-6xl text-[#0A192F] leading-tight mb-6">
            Join the world of refined beauty.
          </h1>
          
          <p className="font-sans text-slate-600 text-base leading-relaxed mb-12 max-w-sm">
            Create an account to unlock exclusive benefits, personalized recommendations, and a faster checkout experience.
          </p>
          
          <div className="flex items-center gap-3 text-slate-700">
            <ShieldCheck size={20} className="text-slate-900" />
            <span className="font-sans font-medium text-sm">Secure Verification</span>
          </div>
        </div>
      </div>

      {/* ── Right Panel: OTP Form ── */}
      <div className="bg-white lg:w-7/12 flex flex-col justify-center px-8 py-16 lg:p-16 xl:p-24 overflow-y-auto">
        <div className="max-w-xl mx-auto w-full">
          <h2 className="font-sans font-bold text-4xl md:text-5xl text-[#0A192F] mb-3">
            Verify Email
          </h2>
          <p className="font-sans text-slate-500 text-base mb-10">
            We've sent a 6-digit code to <span className="font-medium text-slate-800">{email}</span>
          </p>

          <form onSubmit={onSubmit} className="space-y-8">
            {apiError && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100">
                {apiError}
              </div>
            )}

            {resendSuccess && (
              <div className="bg-green-50 text-green-700 p-4 rounded-xl text-sm font-medium border border-green-100">
                {resendSuccess}
              </div>
            )}
            
            {/* OTP Input Fields */}
            <div>
              <label className="block font-sans font-bold text-xs uppercase tracking-wider text-slate-800 mb-4">
                ENTER OTP CODE
              </label>
              
              <div className="flex items-center justify-between gap-2 sm:gap-4 border border-slate-300 rounded-2xl p-4 sm:p-6 bg-white shadow-sm" onPaste={handlePaste}>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => { inputRefs.current[index] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-10 h-12 sm:w-12 sm:h-14 sm:text-2xl text-xl text-center font-bold text-slate-900 bg-transparent border-none focus:outline-none focus:ring-0 placeholder:text-slate-300"
                    placeholder="0"
                  />
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || otp.join("").length !== 6}
              className="w-full bg-[#0A192F] text-white font-bold text-base rounded-xl py-4 sm:py-5 flex items-center justify-center gap-2 group hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Verifying..." : "Verify & Continue"} 
            </button>
          </form>

          {/* Resend & Back */}
          <div className="mt-10 text-center space-y-4">
            <button 
              onClick={handleResend}
              type="button"
              className="font-sans font-bold text-sm text-slate-900 hover:text-blue-600 transition-colors"
            >
              Resend Verification Code
            </button>
            <div className="block">
              <Link 
                href="/register" 
                className="font-sans text-sm text-slate-500 hover:text-slate-900 transition-colors underline underline-offset-4 decoration-slate-300 hover:decoration-slate-900"
              >
                Back to Registration
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-slate-900"></div>
      </div>
    }>
      <VerifyOtpContent />
    </Suspense>
  );
}
