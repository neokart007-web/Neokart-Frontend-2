import Link from 'next/link';
import { XCircle } from 'lucide-react';

export default function OrderFailurePage() {
  return (
    <div className="min-h-screen bg-black pt-24 pb-16 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto p-8 bg-[#aea3cf]/95 rounded-[2rem] shadow-sm border border-slate-100 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle size={48} className="text-red-500" strokeWidth={2.5} />
        </div>
        <h1 className="font-serif font-normal text-4xl md:text-5xl text-slate-900 mb-4 tracking-tight">Payment Failed</h1>
        <p className="text-slate-700 mb-10 leading-relaxed font-sans text-base">
          Unfortunately, your payment could not be processed. Don't worry, your items are still in your cart. Please try again or use a different payment method.
        </p>
        <div className="flex flex-col gap-3">
          <Link
            href="/checkout"
            className="w-full bg-[#111] text-white font-bold text-sm tracking-widest uppercase py-4 rounded-xl hover:bg-black transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
          >
            Try Again
          </Link>
          <Link
            href="/products"
            className="w-full bg-transparent text-slate-900 font-bold text-sm tracking-widest uppercase py-4 rounded-xl border-2 border-slate-900/40 hover:border-slate-900 hover:bg-slate-900/5 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
