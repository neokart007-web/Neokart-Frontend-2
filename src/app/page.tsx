"use client";

import HeroSection from "../components/landingPage/HeroSection";
import CategorySection from "../components/landingPage/CategorySection";
import ProductSection from "../components/landingPage/ProductSection";
import ValueSection from "../components/landingPage/ValueSection";
import FeaturesSection from "../components/landingPage/FeaturesSection";
import TestimonialsSection from "../components/landingPage/TestimonialsSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <HeroSection />
      <CategorySection />
      <ProductSection />
      <ValueSection />
      <FeaturesSection />
      <TestimonialsSection />
    </main>
  );
}