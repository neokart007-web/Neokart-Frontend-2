"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Minus, Plus, ShoppingBag, Trash2, ArrowRight } from "lucide-react";

import { useCart } from "../../context/CartContext";

// ─── Page Component ───────────────────────────────────────────────────────────

export default function CartPage() {
  const { cartItems, updateQuantity, removeItem } = useCart();

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const total = subtotal;

  return (
    <div className="min-h-screen bg-black pt-24 pb-16">
      {/* ── Breadcrumb ── */}
      <nav
        className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-4 flex items-center gap-2 text-xs font-sans text-slate-400"
        aria-label="Breadcrumb"
      >
        <Link href="/" className="hover:text-white transition-colors">Home</Link>
        <ChevronRight size={12} />
        <span className="text-slate-300 font-semibold">Shopping Cart</span>
      </nav>

      {/* ── Main Layout ── */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 pt-8">
        <h1 className="font-serif font-normal text-4xl md:text-5xl text-white mb-10">
          Your Cart
        </h1>

        {cartItems.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center border border-slate-100 rounded-3xl bg-[#aea3cf]/95">
            <div className="w-24 h-24 bg-black rounded-full flex items-center justify-center mb-6 shadow-sm border border-slate-100">
              <ShoppingBag size={40} className="text-slate-300" />
            </div>
            <h2 className="font-sans font-bold text-2xl text-slate-900 mb-2">
              Your cart is empty
            </h2>
            <p className="text-slate-500 mb-8 max-w-md font-sans">
              Looks like you haven&apos;t added anything to your cart yet. Browse our products and find something you love.
            </p>
            <Link
              href="/products"
              className="bg-slate-900 text-white font-bold text-sm uppercase tracking-widest px-8 py-4 rounded-full hover:bg-slate-800 transition-colors inline-flex items-center gap-2"
            >
              Continue Shopping <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
            
            {/* ── Cart Items List (Left Column) ── */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row gap-6 p-8 sm:p-6 border border-slate-100 rounded-2xl bg-[#aea3cf]/95 relative group transition-shadow hover:shadow-md"
                >
                  {/* Remove Button (Desktop absolute, Mobile relative) */}
                  <button
                    onClick={() => removeItem(item.id, item.size)}
                    aria-label="Remove item"
                    className="absolute top-2 right-4 sm:top-6 sm:right-6 text-red-600 hover:text-red-700 transition-colors focus:outline-none"
                  >
                    <Trash2 size={20} />
                  </button>

                  {/* Image */}
                  <div className="relative w-full sm:w-32 aspect-square rounded-xl overflow-hidden bg-slate-50 flex-shrink-0 border border-slate-100">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="(max-width: 640px) 100vw, 128px"
                      className="object-cover"
                    />
                  </div>

                  {/* Item Details */}
                  <div className="flex flex-col flex-1 justify-between">
                    <div>
                      <h3 className="font-sans font-bold text-lg text-slate-900 pr-8 leading-tight mb-2">
                        {item.name}
                      </h3>
                      {item.size && (
                        <p className="font-sans text-sm text-slate-500 mb-4 uppercase tracking-wider">
                          Size: <span className="font-semibold text-slate-700">{item.size}</span>
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-auto">
                      {/* Price */}
                      <p className="font-sans font-bold text-xl text-slate-900">
                        {item.currency}{item.price}
                      </p>

                      {/* Quantity Selector */}
                      <div className="inline-flex items-center border-2 border-slate-200 rounded-xl overflow-hidden bg-[#aea3cf]/95">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1, item.size)}
                          aria-label="Decrease quantity"
                          disabled={item.quantity <= 1}
                          className="w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-40"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-10 text-center font-bold text-sm text-slate-900 select-none">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1, item.size)}
                          aria-label="Increase quantity"
                          className="w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-40"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Order Summary (Right Column) ── */}
            <div className="lg:col-span-4 bg-[#aea3cf]/95 p-6 sm:p-8 rounded-3xl border border-slate-100 sticky top-24">
              <h2 className="font-sans font-bold text-xl text-slate-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center text-slate-600 font-sans">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">₹{subtotal}</span>
                </div>
                <div className="flex justify-between items-center text-slate-600 font-sans">
                  <span>Shipping</span>
                  <span className="font-semibold text-slate-900">
                    <span className="text-green-600 uppercase text-xs font-bold tracking-wider">Free</span>
                  </span>
                </div>
              </div>

              <div className="h-px bg-slate-200 mb-6" />

              <div className="flex justify-between items-end mb-8">
                <span className="font-sans font-bold text-lg text-slate-900">Total</span>
                <span className="font-sans font-bold text-3xl text-slate-900">₹{total}</span>
              </div>

              <Link href="/checkout" className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white font-bold text-sm uppercase tracking-widest py-4 rounded-full hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                Proceed to Checkout
              </Link>
              
              <p className="text-center text-xs text-slate-400 mt-4">
                Secure checkout. 100% genuine products.
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
