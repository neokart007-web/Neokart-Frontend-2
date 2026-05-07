import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-24 pb-16 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto p-8 bg-white rounded-[2rem] shadow-sm border border-slate-100 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={48} className="text-green-500" strokeWidth={2.5} />
        </div>
        <h1 className="font-serif font-normal text-4xl md:text-5xl text-slate-900 mb-4 tracking-tight">Order Placed!</h1>
        <p className="text-slate-500 mb-10 leading-relaxed font-sans text-base">
          Thank you for your purchase. We've received your order and are getting it ready for shipment. You can track your order status in your profile.
        </p>
        <div className="flex flex-col gap-3">
          <Link 
            href="/profile"
            className="w-full bg-[#111] text-white font-bold text-sm tracking-widest uppercase py-4 rounded-xl hover:bg-black transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
          >
            View My Orders
          </Link>
          <Link 
            href="/products"
            className="w-full bg-white text-slate-900 font-bold text-sm tracking-widest uppercase py-4 rounded-xl border-2 border-slate-200 hover:border-slate-900 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
