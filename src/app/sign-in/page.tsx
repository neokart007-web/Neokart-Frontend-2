"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, ShieldCheck, UserPlus, ArrowRight, ChevronDown } from "lucide-react";

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
  });

  const onSubmit = async (data: SignInValues) => {
    // Mock authentication delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Sign in data:", data);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row pt-24">
      {/* ── Left Panel: Brand Context ── */}
      <div className="bg-[#F5F0EB] md:w-1/2 flex flex-col justify-center px-8 py-16 md:p-16 lg:p-24 relative overflow-hidden">
        {/* Subtle decorative elements can go here if needed */}
        
        <div className="max-w-lg mx-auto relative z-10 w-full">
          <p className="font-sans font-bold text-xs uppercase tracking-[0.25em] text-slate-800 mb-6 md:mb-8">
            HEEDY LUXURY COMMERCE
          </p>
          
          <h1 className="font-serif font-normal text-4xl md:text-5xl lg:text-6xl text-[#0A192F] leading-tight mb-6">
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
      <div className="bg-white md:w-1/2 flex flex-col justify-center px-8 py-16 md:p-16 lg:p-24">
        <div className="max-w-lg mx-auto w-full">
          <h2 className="font-sans font-bold text-4xl md:text-5xl text-slate-900 mb-3">
            Sign In
          </h2>
          <p className="font-sans text-slate-500 text-base mb-10">
            Enter your credentials to continue.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
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
                className={`w-full bg-slate-50 border rounded-xl px-5 py-4 text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors ${
                  errors.email ? "border-red-500 ring-1 ring-red-500" : "border-slate-100"
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
                  className={`w-full bg-slate-50 border rounded-xl px-5 py-4 text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors pr-14 ${
                    errors.password ? "border-red-500 ring-1 ring-red-500" : "border-slate-100"
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
              
              <div className="mt-3 text-right">
                <Link href="#" className="font-sans text-sm text-slate-500 hover:text-slate-800 transition-colors">
                  Forgot Password?
                </Link>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#0A192F] text-white font-bold text-base rounded-xl py-4 sm:py-5 flex items-center justify-center gap-2 group hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70"
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
          <div className="flex justify-center mb-10">
            <button 
              type="button"
              className="flex items-center gap-3 border border-slate-200 rounded-full py-3 px-6 hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Sign in with Google as Marshook"
            >
              <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden relative flex items-center justify-center">
                <span className="text-xs font-bold text-slate-500">M</span>
              </div>
              <div className="flex flex-col text-left">
                <span className="font-sans font-medium text-sm text-slate-900 leading-tight">Sign in as Marshook</span>
                <span className="font-sans text-xs text-slate-500 leading-tight">marshookali6@gmail.com</span>
              </div>
              <ChevronDown size={16} className="text-slate-400 ml-2" />
              
              {/* Simple Google SVG Icon */}
              <svg width="20" height="20" viewBox="0 0 24 24" className="ml-2">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            </button>
          </div>

          {/* Footer */}
          <div className="text-center">
            <Link 
              href="/register" 
              className="inline-flex items-center justify-center gap-1.5 font-sans text-sm text-slate-500 hover:text-slate-900 transition-colors"
            >
              New to Heedy? <span className="font-bold text-slate-800">Create Account</span> <UserPlus size={16} className="text-slate-800" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
