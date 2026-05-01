"use client";

import { useState, useEffect } from "react";
import { ArrowUp, MessageCircle } from "lucide-react";

export default function FloatingActions() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 flex flex-col gap-2 md:gap-3">
      {/* Scroll to Top */}
      <button
        onClick={scrollToTop}
        className={`w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 hover:scale-110 transition-all duration-300 flex items-center justify-center ${
          showScrollTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        } motion-reduce:transition-none motion-reduce:transform-none`}
        aria-label="Scroll to top"
      >
        <ArrowUp size={20} />
      </button>

      {/* WhatsApp */}
      <a
        href="#"
        className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-green-500 text-white shadow-lg hover:bg-green-600 hover:scale-110 transition-all duration-200 flex items-center justify-center motion-reduce:transition-none motion-reduce:transform-none"
        aria-label="Contact us on WhatsApp"
      >
        <MessageCircle size={20} />
      </a>


    </div>
  );
}
