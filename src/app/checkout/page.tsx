"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, CreditCard, ShieldCheck, MapPin, X } from "lucide-react";
import { useCart } from "../../context/CartContext";

export default function CheckoutPage() {
  const { cartItems } = useCart();
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [addresses, setAddresses] = useState([
    {
      id: "1",
      name: "wewe",
      line1: "fsds, fsdf",
      line2: "gsd"
    }
  ]);
  const [selectedAddressId, setSelectedAddressId] = useState("1");
  const [newAddressForm, setNewAddressForm] = useState({
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "India",
  });

  const handleSaveAddress = () => {
    if (!newAddressForm.city) return;
    
    const newAddr = {
      id: Date.now().toString(),
      name: newAddressForm.city.toLowerCase(),
      line1: `${newAddressForm.street ? newAddressForm.street + ", " : ""}${newAddressForm.state.toLowerCase()}`,
      line2: newAddressForm.zip,
    };
    
    setAddresses([...addresses, newAddr]);
    setSelectedAddressId(newAddr.id);
    setIsAddressModalOpen(false);
    setNewAddressForm({ street: "", city: "", state: "", zip: "", country: "India" });
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 0 ? (subtotal > 499 ? 0 : 50) : 0;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 pt-8">
        
        {/* Main Title */}
        <h1 className="font-sans font-bold text-3xl md:text-4xl text-slate-900 mb-12">
          Secure Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          
          {/* ── Left Column (Steps) ── */}
          <div className="lg:col-span-8 flex flex-col gap-12">
            
            {/* Step 1: SHIPPING DESTINATION */}
            <div className="flex flex-col gap-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-[#0A192F] text-white flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                  1
                </div>
                <h2 className="font-sans font-black text-4xl lg:text-5xl text-[#0A192F] uppercase tracking-tight text-left w-full leading-[1.1]">
                  Shipping<br />Destination
                </h2>
              </div>
              
              <div className="flex flex-col sm:flex-row flex-wrap gap-6 ml-0 sm:ml-12 mt-4">
                {addresses.map((addr) => {
                  const isSelected = selectedAddressId === addr.id;
                  return (
                    <button
                      key={addr.id}
                      onClick={() => setSelectedAddressId(addr.id)}
                      className={`relative border rounded-2xl sm:rounded-[2rem] p-6 sm:p-8 w-full max-w-sm bg-white text-left transition-colors ${
                        isSelected ? "border-slate-300" : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute -top-3 right-8 w-6 h-6 bg-[#0A192F] text-white rounded-full flex items-center justify-center border-4 border-white box-content">
                          <Check size={12} strokeWidth={4} />
                        </div>
                      )}
                      <div className="flex items-start gap-3">
                        <MapPin size={20} className="text-slate-500 flex-shrink-0 mt-1" />
                        <div>
                          <p className="font-sans font-bold text-slate-900 mb-2">{addr.name}</p>
                          <p className="font-sans text-slate-500 leading-relaxed text-sm">
                            {addr.line1}<br />
                            {addr.line2}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}

                {/* New Address Button */}
                <button 
                  onClick={() => setIsAddressModalOpen(true)}
                  className="border border-slate-200 rounded-2xl sm:rounded-[2rem] p-6 sm:p-8 w-full sm:w-40 flex flex-col items-center justify-center gap-2 bg-white hover:bg-slate-50 transition-colors text-slate-900 font-bold text-sm"
                >
                  <span className="text-xl font-normal">+</span>
                  <span className="text-center">New<br />Address</span>
                </button>
              </div>
            </div>

            <div className="h-px bg-slate-200 w-full ml-0 sm:ml-12" />

            {/* Step 2: PROMOTION CODE */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-[#0A192F] text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                  2
                </div>
                <h2 className="font-sans font-bold text-xl text-[#0A192F] uppercase tracking-wider">
                  Promotion Code
                </h2>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 ml-0 sm:ml-12">
                <input
                  type="text"
                  placeholder="Enter gift card or discount code"
                  className="flex-1 border border-slate-200 rounded-xl px-5 py-4 text-base focus:outline-none focus:ring-2 focus:ring-[#0A192F] bg-white placeholder:text-slate-400"
                />
                <button className="bg-[#111] text-white font-bold text-sm px-10 py-4 rounded-xl hover:bg-black transition-colors shrink-0">
                  Apply
                </button>
              </div>
            </div>

            <div className="h-px bg-slate-200 w-full ml-0 sm:ml-12" />

            {/* Step 3: PAYMENT METHOD */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-[#0A192F] text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                  3
                </div>
                <h2 className="font-sans font-bold text-xl text-[#0A192F] uppercase tracking-wider">
                  Payment Method
                </h2>
              </div>
              
              <div className="ml-0 sm:ml-12">
                <button className="w-full sm:max-w-md flex items-center gap-4 border border-slate-900 rounded-xl px-6 py-5 bg-white hover:bg-slate-50 transition-colors text-left">
                  <CreditCard size={24} className="text-slate-700 shrink-0" />
                  <span className="font-sans font-bold text-slate-900 text-base">
                    Secure Online Payment
                  </span>
                </button>
              </div>
            </div>

          </div>

          {/* ── Right Column (Order Bag) ── */}
          <div className="lg:col-span-4 bg-white p-8 rounded-3xl shadow-sm border border-slate-100 sticky top-32">
            <h2 className="font-sans font-bold text-xl text-slate-900 mb-8">Order Bag</h2>
            
            {/* Cart Items List */}
            <div className="flex flex-col gap-6 mb-8 max-h-[400px] overflow-y-auto pr-2">
              {cartItems.length === 0 ? (
                <p className="text-slate-500 font-sans text-sm">Your order bag is empty.</p>
              ) : (
                cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative w-16 h-20 bg-slate-50 rounded-lg overflow-hidden flex-shrink-0 border border-slate-100">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                      <div className="absolute top-0 right-0 bg-[#0A192F] text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-bl-lg">
                        {item.quantity}
                      </div>
                    </div>
                    <div className="flex flex-col flex-1">
                      <h3 className="font-sans font-bold text-sm text-slate-900 leading-snug line-clamp-2 pr-4">
                        {item.name}
                      </h3>
                      {item.size && (
                        <p className="font-sans text-xs text-slate-500 mt-1">
                          {item.size}
                        </p>
                      )}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-sans font-bold text-sm text-slate-900">
                        {item.currency}{item.price * item.quantity}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center text-slate-500 font-sans text-sm">
                <span>Subtotal</span>
                <span className="text-slate-900">₹{subtotal}</span>
              </div>
              <div className="flex justify-between items-center text-slate-500 font-sans text-sm">
                <span>Shipping</span>
                <span>
                  {shipping === 0 && subtotal > 0 ? (
                    <span className="text-green-600 font-bold tracking-wide">Complimentary</span>
                  ) : (
                    <span className="text-slate-900">₹{shipping}</span>
                  )}
                </span>
              </div>
            </div>

            <div className="h-px border-t border-dashed border-slate-200 mb-6" />

            <div className="flex justify-between items-end mb-8">
              <span className="font-sans font-bold text-lg text-slate-900">Total</span>
              <span className="font-sans font-black text-2xl text-slate-900">₹{total}</span>
            </div>

            <button className="w-full bg-[#111] text-white font-bold text-base py-4 sm:py-5 rounded-xl hover:bg-black transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 mb-4">
              Secure Checkout
            </button>
            
            <div className="flex items-center justify-center gap-2 text-slate-400">
              <ShieldCheck size={14} />
              <p className="font-sans text-[10px] uppercase tracking-widest">
                256-bit SSL Secured Connection
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* ── New Address Modal ── */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setIsAddressModalOpen(false)}
          />
          <div className="relative bg-white rounded-[2rem] w-full max-w-lg shadow-xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between p-6 sm:p-8 border-b border-slate-100">
              <h2 className="font-sans font-black text-2xl text-slate-900 tracking-tight">
                New Shipping Address
              </h2>
              <button 
                onClick={() => setIsAddressModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors focus:outline-none"
              >
                <X size={16} />
              </button>
            </div>
            
            {/* Form */}
            <div className="p-6 sm:p-8 flex flex-col gap-5">
              <div>
                <label className="block font-sans font-bold text-sm text-slate-700 mb-2">Street Address</label>
                <input 
                  type="text" 
                  value={newAddressForm.street}
                  onChange={(e) => setNewAddressForm({...newAddressForm, street: e.target.value})}
                  placeholder="e.g. 123 Luxury Lane"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-base text-slate-900 focus:outline-none focus:border-[#0A192F] placeholder:text-slate-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block font-sans font-bold text-sm text-slate-700 mb-2">City</label>
                  <input 
                    type="text" 
                    value={newAddressForm.city}
                    onChange={(e) => setNewAddressForm({...newAddressForm, city: e.target.value})}
                    placeholder="Mumbai"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-base text-slate-900 focus:outline-none focus:border-[#0A192F] placeholder:text-slate-400"
                  />
                </div>
                <div>
                  <label className="block font-sans font-bold text-sm text-slate-700 mb-2">State</label>
                  <input 
                    type="text" 
                    value={newAddressForm.state}
                    onChange={(e) => setNewAddressForm({...newAddressForm, state: e.target.value})}
                    placeholder="Maharashtra"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-base text-slate-900 focus:outline-none focus:border-[#0A192F] placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block font-sans font-bold text-sm text-slate-700 mb-2">ZIP Code</label>
                  <input 
                    type="text" 
                    value={newAddressForm.zip}
                    onChange={(e) => setNewAddressForm({...newAddressForm, zip: e.target.value})}
                    placeholder="123456"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-base text-slate-900 focus:outline-none focus:border-[#0A192F] placeholder:text-slate-400"
                  />
                </div>
                <div>
                  <label className="block font-sans font-bold text-sm text-slate-700 mb-2">Country</label>
                  <input 
                    type="text" 
                    value={newAddressForm.country}
                    onChange={(e) => setNewAddressForm({...newAddressForm, country: e.target.value})}
                    placeholder="India"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-base text-slate-900 focus:outline-none focus:border-[#0A192F] placeholder:text-slate-400"
                  />
                </div>
              </div>

              <button 
                onClick={handleSaveAddress}
                className="w-full bg-[#111] text-white font-bold text-base py-4 rounded-xl mt-4 hover:bg-black transition-colors focus:outline-none"
              >
                Save & Deliver Here
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
