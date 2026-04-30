"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { User, Package, MapPin, LogOut, X } from "lucide-react";

interface UserProfile {
  name: string;
  email: string;
  _id: string;
  token?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "orders" | "addresses">("overview");
  const [addresses, setAddresses] = useState<any[]>([]);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [newAddressForm, setNewAddressForm] = useState({
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "India",
  });

  useEffect(() => {
    // Load user from localStorage
    const savedUser = localStorage.getItem("heedy_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      // Not logged in, redirect to sign-in
      router.push("/sign-in");
    }
    setLoading(false);
  }, [router]);

  useEffect(() => {
    if (activeTab === "addresses" && user?.token) {
      const fetchAddresses = async () => {
        try {
          const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
          const res = await axios.get(`${API_URL}/v1/users/addresses`, {
            headers: { 'Authorization': `Bearer ${user.token}` }
          });
          if (res.data.success && res.data.data) {
            setAddresses(res.data.data);
          }
        } catch (err) {
          console.error("Failed to fetch addresses", err);
        }
      };
      fetchAddresses();
    }
  }, [activeTab, user]);

  const handleSaveAddress = async () => {
    if (!newAddressForm.city) return;
    setIsSavingAddress(true);
    
    try {
      if (!user?.token) return;
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      
      const payload = {
        street: newAddressForm.street,
        city: newAddressForm.city,
        state: newAddressForm.state,
        zipCode: newAddressForm.zip,
        country: newAddressForm.country
      };

      const res = await axios.post(`${API_URL}/v1/users/addresses`, payload, {
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}` 
        }
      });
      
      if (res.data.success) {
        setAddresses(res.data.data);
        setIsAddressModalOpen(false);
        setNewAddressForm({ street: "", city: "", state: "", zip: "", country: "India" });
      } else {
        alert(res.data.message || "Failed to save address");
      }
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Error saving address");
    } finally {
      setIsSavingAddress(false);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("heedy_user");
    // Also might want to call backend logout to clear HTTP-only cookie if there's an endpoint
    // For now, clear local state and redirect
    router.push("/sign-in");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center pt-20">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  if (!user) return null; // Will redirect

  // Extract initials for the avatar
  const initials = user.name
    ? user.name.charAt(0).toUpperCase()
    : "U";

  return (
    <div className="min-h-screen bg-[#F8F9FB] pt-20 flex justify-center">
      <div className="max-w-[1200px] w-full flex flex-col md:flex-row bg-white min-h-[calc(100vh-5rem)]">
        
        {/* ── Sidebar ── */}
        <aside className="w-full md:w-72 border-r border-slate-100 flex flex-col shrink-0">
          {/* User Profile Info */}
          <div className="p-8 flex flex-col items-center border-b border-slate-100">
            <div className="w-24 h-24 rounded-[32px] bg-blue-600 text-white flex items-center justify-center text-4xl font-bold mb-4 shadow-lg shadow-blue-600/20">
              {initials}
            </div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">
              VIP
            </div>
            <h2 className="text-lg font-bold text-slate-900 text-center mb-1 line-clamp-1">
              {user.name}
            </h2>
            <p className="text-xs text-slate-500 text-center truncate w-full">
              {user.email}
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="p-6 flex flex-col gap-2 flex-grow">
            <button 
              onClick={() => setActiveTab("overview")}
              className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm transition-all ${
                activeTab === "overview" 
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/20" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <User size={18} />
              Overview
            </button>
            <button 
              onClick={() => setActiveTab("orders")}
              className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm transition-all ${
                activeTab === "orders" 
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/20" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Package size={18} />
              My Orders
            </button>
            <button 
              onClick={() => setActiveTab("addresses")}
              className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm transition-all ${
                activeTab === "addresses" 
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/20" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <MapPin size={18} />
              Addresses
            </button>
          </nav>

          {/* Sign Out Button */}
          <div className="p-6 border-t border-slate-100">
            <button 
              onClick={handleSignOut}
              className="flex items-center gap-4 px-6 py-4 w-full rounded-2xl text-red-500 font-bold text-sm hover:bg-red-50 transition-colors"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </aside>

        {/* ── Main Content ── */}
        <main className="flex-1 p-8 md:p-12 lg:p-16 bg-[#F8F9FB]">
          <div className="max-w-3xl">
            {activeTab === "overview" && (
              <>
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-12">
                  <h1 className="font-serif text-4xl md:text-5xl text-slate-900 leading-tight">
                    Account <br />
                    Overview
                  </h1>
                  <p className="text-base text-slate-500 max-w-sm md:text-right pt-2 leading-relaxed">
                    Welcome back, {user.name.split(' ')[0]}. Here&apos;s what&apos;s happening with your account.
                  </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                  <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                      TOTAL ORDERS
                    </p>
                    <p className="font-sans font-bold text-4xl text-slate-900">0</p>
                  </div>
                  <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                      HEEDY POINTS
                    </p>
                    <p className="font-sans font-bold text-4xl text-slate-900">1,450</p>
                  </div>
                </div>

                {/* Recent Activity */}
                <div>
                  <p className="text-sm font-medium text-slate-700 mb-6">Recent Activity</p>
                  <div className="text-sm text-slate-600">No recent orders found. Raw Response: []</div>
                </div>
              </>
            )}

            {activeTab === "orders" && (
              <div>
                <h1 className="font-serif text-4xl text-slate-900 leading-tight mb-8">My Orders</h1>
                <p className="text-slate-500">You have no orders yet.</p>
              </div>
            )}

            {activeTab === "addresses" && (
              <div className="flex flex-col">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                  <h1 className="font-serif text-4xl text-slate-900 leading-tight">
                    Shipping<br />Addresses
                  </h1>
                  <p className="text-slate-500 text-sm max-w-xs text-left md:text-right pt-2">
                    Manage your delivery locations for a faster checkout.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {addresses.map((addr, idx) => (
                    <div key={addr._id || idx} className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm relative">
                      {idx === 0 && (
                        <div className="absolute top-8 right-8 bg-blue-50 text-blue-600 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                          Primary
                        </div>
                      )}
                      <h3 className="font-bold text-lg text-slate-900 mb-4">Address {idx + 1}</h3>
                      <div className="text-slate-500 text-base leading-relaxed mb-6">
                        {addr.street && <p>{addr.street}</p>}
                        <p>{addr.city}{addr.state ? `, ${addr.state}` : ''} {addr.zipCode}</p>
                        <p>{addr.country}</p>
                      </div>
                      <div className="flex items-center gap-6">
                        <button className="text-blue-600 text-sm font-bold hover:underline">Edit Details</button>
                        <button className="text-red-500 text-sm font-bold hover:underline">Remove</button>
                      </div>
                    </div>
                  ))}

                  <button 
                    onClick={() => setIsAddressModalOpen(true)}
                    className="border-2 border-dashed border-slate-200 rounded-[2rem] p-8 w-full flex items-center justify-center text-slate-500 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition-all font-bold group"
                  >
                    + Add New Shipping Location
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* ── New Address Modal ── */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setIsAddressModalOpen(false)}
          />
          <div className="relative bg-white rounded-[2rem] w-full max-w-lg shadow-xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
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
            
            <div className="p-6 sm:p-8 flex flex-col gap-5">
              <div>
                <label className="block font-sans font-bold text-sm text-slate-700 mb-2">Street Address</label>
                <input 
                  type="text" 
                  value={newAddressForm.street}
                  onChange={(e) => setNewAddressForm({...newAddressForm, street: e.target.value})}
                  placeholder="e.g. 123 Luxury Lane"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-base text-slate-900 focus:outline-none focus:border-blue-500 placeholder:text-slate-400"
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
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-base text-slate-900 focus:outline-none focus:border-blue-500 placeholder:text-slate-400"
                  />
                </div>
                <div>
                  <label className="block font-sans font-bold text-sm text-slate-700 mb-2">State</label>
                  <input 
                    type="text" 
                    value={newAddressForm.state}
                    onChange={(e) => setNewAddressForm({...newAddressForm, state: e.target.value})}
                    placeholder="Maharashtra"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-base text-slate-900 focus:outline-none focus:border-blue-500 placeholder:text-slate-400"
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
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-base text-slate-900 focus:outline-none focus:border-blue-500 placeholder:text-slate-400"
                  />
                </div>
                <div>
                  <label className="block font-sans font-bold text-sm text-slate-700 mb-2">Country</label>
                  <input 
                    type="text" 
                    value={newAddressForm.country}
                    onChange={(e) => setNewAddressForm({...newAddressForm, country: e.target.value})}
                    placeholder="India"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-base text-slate-900 focus:outline-none focus:border-blue-500 placeholder:text-slate-400"
                  />
                </div>
              </div>

              <button 
                onClick={handleSaveAddress}
                disabled={isSavingAddress}
                className="w-full bg-blue-600 text-white font-bold text-base py-4 rounded-xl mt-4 hover:bg-blue-700 transition-colors focus:outline-none disabled:opacity-50"
              >
                {isSavingAddress ? "Saving..." : "Save Address"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
