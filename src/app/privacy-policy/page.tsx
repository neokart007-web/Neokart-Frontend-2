"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function PrivacyPolicyPage() {
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <title>Privacy Policy – HEEDY</title>
      <meta
        name="description"
        content="Read the Privacy Policy of HEEDY. Learn how we collect, use, and protect your data."
      />

      <main id="top" className="min-h-screen bg-slate-50">
        {/* ── Hero ─────────────────────────────────────────────────── */}
        <section
          className="relative w-full pt-32 md:pt-40 pb-36 md:pb-48"
          style={{
            background:
              "linear-gradient(135deg, #0F172A 0%, #1E3A8A 50%, #1E40AF 100%)",
          }}
        >
          <div className="max-w-4xl mx-auto px-6 text-center">
            {/* Mobile Back to Home */}
            <div
              className="md:hidden flex justify-center mb-8"
              style={{
                opacity: heroVisible ? 1 : 0,
                transform: heroVisible ? "translateY(0)" : "translateY(1rem)",
                transition: "opacity 0.5s ease 50ms, transform 0.5s ease 50ms",
              }}
            >
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-white/90 hover:text-white transition-colors text-sm font-semibold bg-white/10 hover:bg-white/20 px-5 py-2.5 rounded-full border border-white/20 backdrop-blur-sm shadow-sm"
              >
                <ChevronLeft size={16} />
                Back to Home
              </Link>
            </div>

            {/* Headline */}
            <h1
              className="font-sans font-bold text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-6"
              style={{
                opacity: heroVisible ? 1 : 0,
                transform: heroVisible ? "translateY(0)" : "translateY(1rem)",
                transition:
                  "opacity 0.6s ease 200ms, transform 0.6s ease 200ms",
              }}
            >
              Privacy Policy
            </h1>

            {/* Subheadline */}
            <p
              className="text-slate-400 text-base md:text-lg leading-relaxed max-w-2xl mx-auto"
              style={{
                opacity: heroVisible ? 1 : 0,
                transform: heroVisible ? "translateY(0)" : "translateY(1rem)",
                transition:
                  "opacity 0.6s ease 300ms, transform 0.6s ease 300ms",
              }}
            >
              At HEEDY, we value your privacy. This policy explains how we collect and use your data.
            </p>
          </div>
        </section>

        {/* ── Content ──────────────────────────────────────────────── */}
        <section
          className="relative z-10 px-6 md:px-12 lg:px-20 max-w-4xl mx-auto -mt-20 md:-mt-24 mb-20"
        >
          <div className="bg-white rounded-3xl shadow-sm p-8 md:p-12 lg:p-16 border border-slate-100">
            <p className="text-slate-500 mb-8 font-medium">Last Updated: May 2, 2026</p>

            <div className="space-y-8 text-slate-700 leading-relaxed font-sans">
              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Information We Collect</h2>
                <p className="mb-4">We may collect:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Name</li>
                  <li>Phone number</li>
                  <li>Email address</li>
                  <li>Shipping address</li>
                  <li>Payment details (secured via payment gateway)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">2. How We Use Your Information</h2>
                <p className="mb-4">We use your data to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Process orders</li>
                  <li>Provide customer support</li>
                  <li>Send updates/offers (optional)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Data Protection</h2>
                <p>
                  We implement secure measures to protect your personal data. Payment details are processed through trusted gateways.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Sharing of Information</h2>
                <p className="mb-4">We do NOT sell your data. We may share it with:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Delivery partners</li>
                  <li>Payment providers</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Cookies</h2>
                <p>
                  We use cookies to improve user experience and website performance.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Your Rights</h2>
                <p className="mb-4">You can:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Request access to your data</li>
                  <li>Ask for correction or deletion</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Updates to Policy</h2>
                <p>
                  We may update this policy anytime. Changes will be posted on this page.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Contact Us</h2>
                <p className="mb-2">Email: <a href="mailto:infoheedy@gmail.com" className="text-blue-600 hover:text-blue-800 transition-colors">infoheedy@gmail.com</a></p>
                <p>Phone: <a href="tel:+919074881551" className="text-blue-600 hover:text-blue-800 transition-colors">9074881551</a></p>
              </section>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
