"use client";

import { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, ShieldCheck, UserPlus, ArrowRight } from "lucide-react";
import { useToast } from "../../context/ToastContext";
import GoogleAuthButton from "../../components/auth/GoogleAuthButton";

const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

type SignInValues = z.infer<typeof signInSchema>;

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    mode: "onBlur",
  });

  const router = useRouter();
  const { showToast } = useToast();
  const [apiError, setApiError] = useState<string | null>(null);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL.replace('/api', '')
    : 'http://localhost:5000';

  const onSubmit = async (data: SignInValues) => {
    try {
      setApiError(null);
      const res = await axios.post(`${baseUrl}/api/v1/auth/customer-login`, {
        email: data.email,
        password: data.password,
      });

      // Success! Save user and redirect to home page
      if (res.data.data) {
        localStorage.setItem('heedy_user', JSON.stringify(res.data.data));
      }
      showToast("Signed in successfully!", "success");
      router.push("/");
    } catch (err: any) {
      console.error("Sign in error:", err);
      setApiError(err.response?.data?.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row pt-24">
      {/* ── Left Panel: Brand Context ── */}
      <div className="bg-[#F5F0EB] md:w-1/2 flex flex-col justify-center px-6 py-10 md:p-16 lg:p-24 relative overflow-hidden">
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

      {/* ── Right Panel: Sign In Form ── */}
      <div className="bg-white md:w-1/2 flex flex-col justify-center px-6 py-10 md:p-16 lg:p-24">
        <div className="max-w-lg mx-auto w-full">
          <h2 className="font-sans font-bold text-4xl md:text-5xl text-slate-900 mb-3">
            Sign In
          </h2>
          <p className="font-sans text-slate-500 text-base mb-10">
            Enter your credentials to continue.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
            {apiError && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100">
                {apiError}
              </div>
            )}

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block font-sans font-bold text-xs uppercase tracking-wider text-slate-800 mb-2.5"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@luxury.com"
                {...register("email")}
                className={`w-full bg-slate-50 border rounded-xl px-5 py-4 text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors ${errors.email ? "border-red-500 ring-1 ring-red-500" : "border-slate-100"
                  }`}
                aria-invalid={errors.email ? "true" : "false"}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              {errors.email && (
                <p id="email-error" className="mt-2 text-sm text-red-500" role="alert">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block font-sans font-bold text-xs uppercase tracking-wider text-slate-800 mb-2.5"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password")}
                  className={`w-full bg-slate-50 border rounded-xl px-5 py-4 text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors pr-14 ${errors.password ? "border-red-500 ring-1 ring-red-500" : "border-slate-100"
                    }`}
                  aria-invalid={errors.password ? "true" : "false"}
                  aria-describedby={errors.password ? "password-error" : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none focus:text-slate-800"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p id="password-error" className="mt-2 text-sm text-red-500" role="alert">
                  {errors.password.message}
                </p>
              )}

              {/* <div className="mt-3 text-right">
                <Link href="#" className="font-sans text-sm text-slate-500 hover:text-slate-800 transition-colors">
                  Forgot Password?
                </Link>
              </div> */}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#0a0a0a] text-white font-bold text-base rounded-xl py-4 sm:py-5 flex items-center justify-center gap-2 group hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70"
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
              <ArrowRight size={20} className="transition-transform group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:transform-none" />
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 font-sans text-xs uppercase tracking-widest text-slate-400 font-bold">
                OR CONTINUE WITH
              </span>
            </div>
          </div>

          {/* Google SSO */}
          <div className="mb-10">
            <GoogleAuthButton mode="signin" />
          </div>

          {/* Footer */}
          <div className="text-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-1.5 font-sans text-sm text-slate-500 hover:text-slate-900 transition-colors"
            >
              New to Neokart? <span className="font-bold text-slate-800">Create Account</span> <UserPlus size={16} className="text-slate-800" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
