"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <main className="flex-grow flex flex-col items-center justify-center bg-white px-6 py-32 md:py-48">
      <div className="max-w-2xl w-full text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <p className="font-sans font-semibold text-xs tracking-[0.3em] uppercase text-blue-800 mb-4">
            404 ERROR
          </p>
          <h1 className="font-serif font-normal text-5xl md:text-7xl text-slate-900 leading-tight mb-6">
            Page Not Found
          </h1>
          <p className="font-sans font-normal text-lg md:text-xl text-slate-500 leading-relaxed max-w-lg mx-auto">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="pt-8"
        >
          <Link
            href="/"
            className="inline-block px-8 py-3.5 rounded-full bg-slate-900 text-white font-sans font-semibold text-xs tracking-[0.2em] uppercase transition-all duration-300 hover:bg-slate-800 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 shadow-lg shadow-black/10"
          >
            Return to Home
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
