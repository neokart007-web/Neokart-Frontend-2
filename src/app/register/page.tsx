"use client";

import { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, ShieldCheck, ArrowRight } from "lucide-react";
import GoogleAuthButton from "../../components/auth/GoogleAuthButton";

// ─── Form Validation Schema ───
const registerSchema = z
  .object({
    fullName: z.string().min(2, "Name must be at least 2 characters."),
    email: z.string().email("Please enter a valid email address."),
    phone: z.string().optional(),
    password: z.string().min(6, "Password must be at least 6 characters."),
    confirmPassword: z.string().min(6, "Please confirm your password."),
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
    country: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type RegisterValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
  });

  const router = useRouter();
  const [apiError, setApiError] = useState<string | null>(null);

  const onSubmit = async (data: RegisterValues) => {
    try {
      setApiError(null);
      const baseUrl = process.env.NEXT_PUBLIC_API_URL 
        ? process.env.NEXT_PUBLIC_API_URL.replace('/api', '')
        : 'http://localhost:5000';
      
      await axios.post(`${baseUrl}/api/v1/auth/register`, {
        name: data.fullName,
        email: data.email,
        password: data.password,
        phone: data.phone,
        addresses: [{
          street: data.street,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
          country: data.country
        }]
      });

      // Success! Redirect to OTP verification page
      router.push(`/verify-otp?email=${encodeURIComponent(data.email)}`);
    } catch (err: any) {
      console.error("Registration error:", err);
      setApiError(err.response?.data?.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row pt-24">
      {/* ── Left Panel: Brand Context ── */}
      <div className="bg-[#F5F0EB] lg:w-5/12 flex flex-col justify-center px-6 py-10 lg:p-16 xl:p-24 relative overflow-hidden">
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
            <span className="font-sans font-medium text-sm">Premium Account Access</span>
          </div>
        </div>
      </div>

      {/* ── Right Panel: Registration Form ── */}
      <div className="bg-white lg:w-7/12 flex flex-col justify-center px-6 py-10 lg:p-16 xl:p-24 overflow-y-auto">
        <div className="max-w-2xl mx-auto w-full">
          <h2 className="font-sans font-bold text-4xl md:text-5xl text-slate-900 mb-3">
            Create Account
          </h2>
          <p className="font-sans text-slate-500 text-base mb-10">
            Join us today for a premium experience.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
            {apiError && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100">
                {apiError}
              </div>
            )}
            
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block font-sans font-bold text-xs uppercase tracking-wider text-slate-800 mb-2.5">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                placeholder="John Doe"
                {...register("fullName")}
                className={`w-full bg-slate-50 border rounded-xl px-5 py-4 text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors ${
                  errors.fullName ? "border-red-500 ring-1 ring-red-500" : "border-slate-100"
                }`}
                aria-invalid={errors.fullName ? "true" : "false"}
              />
              {errors.fullName && <p className="mt-2 text-sm text-red-500">{errors.fullName.message}</p>}
            </div>

            {/* Email & Phone Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
              <div>
                <label htmlFor="email" className="block font-sans font-bold text-xs uppercase tracking-wider text-slate-800 mb-2.5">
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
                />
                {errors.email && <p className="mt-2 text-sm text-red-500">{errors.email.message}</p>}
              </div>

              <div>
                <label htmlFor="phone" className="block font-sans font-bold text-xs uppercase tracking-wider text-slate-800 mb-2.5">
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  placeholder="1234567890"
                  {...register("phone")}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-4 text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                />
              </div>
            </div>

            {/* Password & Confirm Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
              <div>
                <label htmlFor="password" className="block font-sans font-bold text-xs uppercase tracking-wider text-slate-800 mb-2.5">
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
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && <p className="mt-2 text-sm text-red-500">{errors.password.message}</p>}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block font-sans font-bold text-xs uppercase tracking-wider text-slate-800 mb-2.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("confirmPassword")}
                    className={`w-full bg-slate-50 border rounded-xl px-5 py-4 text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors pr-14 ${
                      errors.confirmPassword ? "border-red-500 ring-1 ring-red-500" : "border-slate-100"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="mt-2 text-sm text-red-500">{errors.confirmPassword.message}</p>}
              </div>
            </div>

            {/* Address Divider */}
            <div className="relative pt-6 pb-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-4 font-sans text-xs uppercase tracking-widest text-slate-400 font-bold">
                  ADDRESS (OPTIONAL)
                </span>
              </div>
            </div>

            {/* Street & City Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
              <div>
                <label htmlFor="street" className="block font-sans font-bold text-xs uppercase tracking-wider text-slate-800 mb-2.5">
                  Street
                </label>
                <input
                  id="street"
                  type="text"
                  placeholder="123 Luxury Ave"
                  {...register("street")}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-4 text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                />
              </div>
              <div>
                <label htmlFor="city" className="block font-sans font-bold text-xs uppercase tracking-wider text-slate-800 mb-2.5">
                  City
                </label>
                <input
                  id="city"
                  type="text"
                  placeholder="Metropolis"
                  {...register("city")}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-4 text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                />
              </div>
            </div>

            {/* State, Zip, Country Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
              <div>
                <label htmlFor="state" className="block font-sans font-bold text-xs uppercase tracking-wider text-slate-800 mb-2.5">
                  State
                </label>
                <input
                  id="state"
                  type="text"
                  placeholder="NY"
                  {...register("state")}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-4 text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                />
              </div>
              <div>
                <label htmlFor="zipCode" className="block font-sans font-bold text-xs uppercase tracking-wider text-slate-800 mb-2.5">
                  Zip Code
                </label>
                <input
                  id="zipCode"
                  type="text"
                  placeholder="10001"
                  {...register("zipCode")}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-4 text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                />
              </div>
              <div>
                <label htmlFor="country" className="block font-sans font-bold text-xs uppercase tracking-wider text-slate-800 mb-2.5">
                  Country
                </label>
                <input
                  id="country"
                  type="text"
                  placeholder="United States"
                  {...register("country")}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-4 text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#0A192F] text-white font-bold text-base rounded-xl py-4 sm:py-5 mt-6 flex items-center justify-center gap-2 group hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70"
            >
              {isSubmitting ? "Creating Account..." : "Create Account"} 
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
            <GoogleAuthButton mode="register" />
          </div>

          {/* Footer */}
          <div className="text-center">
            <Link 
              href="/sign-in" 
              className="font-sans text-sm text-slate-500 hover:text-slate-900 transition-colors"
            >
              Already have an account? <span className="font-bold text-slate-800">Sign In</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
