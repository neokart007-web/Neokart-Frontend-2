"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { User, Package, MapPin, LogOut, X } from "lucide-react";
import { useToast } from "../../context/ToastContext";
import { useCart } from "../../context/CartContext";

interface UserProfile {
  name: string;
  email: string;
  _id: string;
  token?: string;
  phone?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const { showToast } = useToast();
  const { clearLocalCart, syncCartAfterLogin } = useCart();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "orders" | "addresses">("overview");
  const [addresses, setAddresses] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [newAddressForm, setNewAddressForm] = useState({
    name: "",
    phone: "",
    street: "",
    apartment: "",
    landmark: "",
    postOffice: "",
    city: "",
    state: "",
    zip: "",
    country: "India",
  });
  const [addressErrors, setAddressErrors] = useState<Record<string, string>>({});

  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [editProfileForm, setEditProfileForm] = useState({
    name: "",
    phone: "",
  });

  useEffect(() => {
    const handleAuth = async () => {
      // Check for auto-login token in URL
      const urlParams = new URLSearchParams(window.location.search);
      const urlToken = urlParams.get('token');

      if (urlToken) {
        try {
          const baseUrl = process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL.replace(/\/api\/?$/, "") : 'http://localhost:5000';
          const API_URL = `${baseUrl}/api`;

          const res = await axios.get(`${API_URL}/v1/users/profile`, {
            headers: { 'Authorization': `Bearer ${urlToken}` }
          });

          if (res.data.success) {
            const userData = { ...res.data.data, token: urlToken };
            setUser(userData);
            localStorage.setItem("heedy_user", JSON.stringify(userData));

            // Merge any guest cart and restore the account's saved cart.
            await syncCartAfterLogin();

            // Clean up the URL to remove the token without reloading the page
            window.history.replaceState({}, document.title, window.location.pathname);
            setLoading(false);
            return;
          }
        } catch (err) {
          console.error("Auto-login failed:", err);
          // Fallback to regular auth below if auto-login fails
        }
      }

      // Load user from localStorage
      const savedUser = localStorage.getItem("heedy_user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        // Not logged in, redirect to sign-in
        router.push("/sign-in");
      }
      setLoading(false);
    };

    handleAuth();
  }, [router]);

  useEffect(() => {
    if (activeTab === "addresses" && user?.token) {
      const fetchAddresses = async () => {
        try {
          const baseUrl = process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL.replace(/\/api\/?$/, "") : 'http://localhost:5000';
          const API_URL = `${baseUrl}/api`;
          const res = await axios.get(`${API_URL}/v1/users/addresses`, {
            headers: { 'Authorization': `Bearer ${user.token}` }
          });
          if (res.data.success && res.data.data) {
            setAddresses(res.data.data);
          }
        } catch (err: any) {
          console.error("Failed to fetch addresses", err);
          if (err.response?.status === 401) {
            handleSignOut();
            showToast("Session expired. Please sign in again.", "error");
          }
        }
      };
      fetchAddresses();
    }

    if (user?.token && (activeTab === "orders" || activeTab === "overview")) {
      const fetchOrders = async () => {
        try {
          const baseUrl = process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL.replace(/\/api\/?$/, "") : 'http://localhost:5000';
          const API_URL = `${baseUrl}/api`;
          const res = await axios.get(`${API_URL}/v1/payments/myorders`, {
            headers: { 'Authorization': `Bearer ${user.token}` }
          });
          if (res.data.success) {
            setOrders(res.data.data);
          }
        } catch (err: any) {
          console.error("Failed to fetch orders", err);
          if (err.response?.status === 401) {
            handleSignOut();
            showToast("Session expired. Please sign in again.", "error");
          }
        }
      };
      fetchOrders();
    }
  }, [activeTab, user]);

  const validateAddressForm = () => {
    const errors: Record<string, string> = {};
    if (!newAddressForm.name.trim()) errors.name = "Full name is required.";
    else if (newAddressForm.name.trim().length < 2) errors.name = "Enter a valid name.";
    if (!newAddressForm.phone.trim()) errors.phone = "Phone number is required.";
    else if (!/^\d{10}$/.test(newAddressForm.phone.trim())) errors.phone = "Enter a valid 10-digit phone number.";
    if (!newAddressForm.postOffice.trim()) errors.postOffice = "Post office is required.";
    if (!newAddressForm.city.trim()) errors.city = "City is required.";
    if (!newAddressForm.state.trim()) errors.state = "State is required.";
    if (!newAddressForm.zip.trim()) errors.zip = "PIN code is required.";
    else if (!/^\d{5,6}$/.test(newAddressForm.zip.trim())) errors.zip = "Enter a valid 5-6 digit PIN code.";
    if (newAddressForm.street.trim() && newAddressForm.street.trim().length < 3) errors.street = "Street must be at least 3 characters.";
    setAddressErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveAddress = async () => {
    if (!validateAddressForm()) return;
    setIsSavingAddress(true);

    try {
      if (!user?.token) return;
      const baseUrl = process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL.replace(/\/api\/?$/, "") : 'http://localhost:5000';
      const API_URL = `${baseUrl}/api`;

      const payload = {
        name: newAddressForm.name,
        phone: newAddressForm.phone,
        street: newAddressForm.street,
        apartment: newAddressForm.apartment,
        landmark: newAddressForm.landmark,
        postOffice: newAddressForm.postOffice,
        city: newAddressForm.city,
        state: newAddressForm.state,
        zipCode: newAddressForm.zip,
        country: newAddressForm.country
      };

      let res;
      if (editingAddressId) {
        res = await axios.put(`${API_URL}/v1/users/addresses/${editingAddressId}`, payload, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
          }
        });
      } else {
        res = await axios.post(`${API_URL}/v1/users/addresses`, payload, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
          }
        });
      }

      if (res.data.success) {
        setAddresses(res.data.data);
        setIsAddressModalOpen(false);
        setEditingAddressId(null);
        setNewAddressForm({ name: "", phone: "", street: "", apartment: "", landmark: "", postOffice: "", city: "", state: "", zip: "", country: "India" });
        setAddressErrors({});
      } else {
        showToast(res.data.message || "Failed to save address", "error");
      }
    } catch (err: any) {
      console.error(err);
      showToast(err.response?.data?.message || "Error saving address", "error");
    } finally {
      setIsSavingAddress(false);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    try {
      if (!user?.token) return;
      const baseUrl = process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL.replace(/\/api\/?$/, "") : 'http://localhost:5000';
      const API_URL = `${baseUrl}/api`;

      const res = await axios.delete(`${API_URL}/v1/users/addresses/${addressId}`, {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      if (res.data.success) {
        setAddresses(res.data.data);
      }
    } catch (err: any) {
      console.error(err);
      showToast(err.response?.data?.message || "Error removing address", "error");
    }
  };

  const handleSignOut = () => {
    // Clear local session + cart state only. The DB cart is left intact so it
    // restores on the next login (and stays available on other devices).
    localStorage.removeItem("heedy_user");
    clearLocalCart();
    router.push("/sign-in");
  };

  const handleEditProfileClick = () => {
    if (user) {
      setEditProfileForm({
        name: user.name || "",
        phone: user.phone || "",
      });
      setIsEditProfileOpen(true);
    }
  };

  const handleSaveProfile = async () => {
    if (!editProfileForm.name.trim()) {
      showToast("Name is required", "error");
      return;
    }

    setIsSavingProfile(true);
    try {
      if (!user?.token) return;
      const baseUrl = process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL.replace(/\/api\/?$/, "") : 'http://localhost:5000';
      const API_URL = `${baseUrl}/api`;

      const payload = {
        name: editProfileForm.name,
        phone: editProfileForm.phone
      };

      const res = await axios.put(`${API_URL}/v1/users/profile`, payload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        }
      });

      if (res.data.success) {
        const updatedUser = { ...user, ...res.data.data, token: user.token };
        setUser(updatedUser);
        localStorage.setItem("heedy_user", JSON.stringify(updatedUser));
        setIsEditProfileOpen(false);
        showToast("Profile updated successfully", "success");
      }
    } catch (err: any) {
      console.error(err);
      showToast(err.response?.data?.message || "Error updating profile", "error");
    } finally {
      setIsSavingProfile(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center pt-20">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!user) return null; // Will redirect

  // Extract initials for the avatar
  const initials = user.name
    ? user.name.charAt(0).toUpperCase()
    : "U";

  return (
    <div className="min-h-screen bg-black pt-20 flex justify-center">
      <div className="max-w-[1200px] w-full flex flex-col md:flex-row bg-black min-h-[calc(100vh-5rem)]">

        {/* ── Sidebar ── */}
        <aside className="w-full md:w-72 border-r border-white/10 flex flex-col shrink-0">
          {/* User Profile Info */}
          <div className="p-8 flex flex-col items-center border-b border-white/10">
            <div className="w-24 h-24 rounded-[32px] bg-blue-600 text-white flex items-center justify-center text-4xl font-bold mb-4 shadow-lg shadow-blue-600/20">
              {initials}
            </div>
            <div className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-1">
              VIP
            </div>
            <h2 className="text-lg font-bold text-white text-center mb-1 line-clamp-1">
              {user.name}
            </h2>
            <p className={`text-xs text-slate-400 text-center truncate w-full ${!user.phone ? 'mb-4' : 'mb-1'}`}>
              {user.email}
            </p>
            {user.phone && (
              <p className="text-xs text-slate-400 text-center truncate w-full mb-4">
                {user.phone}
              </p>
            )}
            <button
              onClick={handleEditProfileClick}
              className="text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-full transition-colors"
            >
              Edit Profile
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-6 flex flex-col gap-2 flex-grow">
            <button
              onClick={() => setActiveTab("overview")}
              className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm transition-all ${activeTab === "overview"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
            >
              <User size={18} />
              Overview
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm transition-all ${activeTab === "orders"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
            >
              <Package size={18} />
              My Orders
            </button>
            <button
              onClick={() => setActiveTab("addresses")}
              className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm transition-all ${activeTab === "addresses"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
            >
              <MapPin size={18} />
              Addresses
            </button>
          </nav>

          {/* Sign Out Button */}
          <div className="p-6 border-t border-white/10">
            <button
              onClick={handleSignOut}
              className="flex items-center gap-4 px-6 py-4 w-full rounded-2xl text-red-400 font-bold text-sm hover:bg-red-500/10 hover:text-red-300 transition-colors"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </aside>

        {/* ── Main Content ── */}
        <main className="flex-1 p-8 md:p-12 lg:p-16 bg-black">
          <div className="max-w-3xl">
            {activeTab === "overview" && (
              <>
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-12">
                  <h1 className="font-serif text-4xl md:text-5xl text-white leading-tight">
                    Account <br />
                    Overview
                  </h1>
                  <p className="text-base text-slate-300 max-w-sm md:text-right pt-2 leading-relaxed">
                    Welcome back, {user.name.split(' ')[0]}. Here&apos;s what&apos;s happening with your account.
                  </p>
                </div>

                {/* Profile Completion Warning */}
                {!user.phone && (
                  <div className="mb-8 bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-4 shadow-sm animate-in fade-in">
                    <div className="text-amber-500 mt-0.5 shrink-0 bg-amber-100 p-2 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-amber-800 text-[15px] mb-1">Complete your profile</h3>
                      <p className="text-amber-700/80 text-[14px]">Please add your phone number to receive important order updates and delivery notifications.</p>
                    </div>
                    <button onClick={handleEditProfileClick} className="px-5 py-2.5 bg-amber-100 hover:bg-amber-200 text-amber-800 text-[13px] font-bold rounded-xl transition-colors shrink-0">
                      Add Number
                    </button>
                  </div>
                )}

                {/* Stats Cards */}
                <div className="grid grid-cols-1 gap-6 mb-12">
                  <div className="bg-[#aea3cf]/95 rounded-3xl p-8 border border-slate-100 shadow-sm">
                    <p className="text-xs font-bold text-slate-600 uppercase tracking-widest mb-4">
                      TOTAL ORDERS
                    </p>
                    <p className="font-sans font-bold text-4xl text-slate-900">{orders.length}</p>
                  </div>
                </div>

                {/* Recent Activity */}
                <div>
                  <p className="text-sm font-medium text-slate-300 mb-6">Recent Activity</p>
                  {orders.length > 0 ? (
                    <div className="flex flex-col gap-4">
                      {orders.slice(0, 3).map((order) => (
                        <div key={order._id} className="flex items-center justify-between p-4 bg-[#aea3cf]/95 border border-slate-100 rounded-xl shadow-sm">
                          <div>
                            <p className="font-bold text-sm text-slate-900">Order #{order._id.substring(0, 8)}</p>
                            <p className="text-xs text-slate-500 mt-1">{`${String(new Date(order.createdAt).getDate()).padStart(2, '0')}/${String(new Date(order.createdAt).getMonth() + 1).padStart(2, '0')}/${new Date(order.createdAt).getFullYear()}`}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-sm text-slate-900">₹{order.total}</p>
                            <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${order.orderStatus === 'delivered' ? 'bg-green-100 text-green-700' :
                              order.orderStatus === 'cancelled' ? 'bg-red-100 text-red-700' :
                                order.orderStatus === 'processing' ? 'bg-blue-100 text-blue-700' :
                                  'bg-slate-100 text-slate-700'
                              }`}>
                              {order.orderStatus}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-slate-400">No recent orders found.</div>
                  )}
                </div>
              </>
            )}

            {activeTab === "orders" && (
              <div>
                <h1 className="font-serif text-4xl text-white leading-tight mb-8">My Orders</h1>

                {orders.length > 0 ? (
                  <div className="flex flex-col gap-6">
                    {[...orders].sort((a, b) => {
                      const aIsDone = a.orderStatus === 'delivered' || a.orderStatus === 'cancelled';
                      const bIsDone = b.orderStatus === 'delivered' || b.orderStatus === 'cancelled';
                      if (aIsDone && !bIsDone) return 1;
                      if (!aIsDone && bIsDone) return -1;
                      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                    }).map((order) => (
                      <div key={order._id} className={`bg-[#aea3cf]/95 rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden ${(order.orderStatus === 'delivered' || order.orderStatus === 'cancelled') ? 'opacity-80' : ''}`}>
                        <div className="bg-slate-50 border-b border-slate-100 p-6 sm:px-8 flex flex-wrap items-center justify-between gap-4">
                          <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Order Placed</p>
                            <p className="text-sm font-bold text-slate-900">{`${String(new Date(order.createdAt).getDate()).padStart(2, '0')}/${String(new Date(order.createdAt).getMonth() + 1).padStart(2, '0')}/${new Date(order.createdAt).getFullYear()}`}</p>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Total Amount</p>
                            <p className="text-sm font-bold text-slate-900">₹{order.total}</p>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Order ID</p>
                            <p className="text-sm font-bold text-slate-900">#{order._id.substring(0, 8)}</p>
                          </div>
                          <div className="flex-1 text-right min-w-[100px]">
                            <span className={`inline-block text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider ${order.orderStatus === 'delivered' ? 'bg-green-100 text-green-700' :
                              order.orderStatus === 'cancelled' ? 'bg-red-100 text-red-700' :
                                order.orderStatus === 'processing' ? 'bg-blue-100 text-blue-700' :
                                  'bg-slate-100 text-slate-700'
                              }`}>
                              {order.orderStatus}
                            </span>
                          </div>
                        </div>
                        <div className="p-6 sm:p-8">
                          <div className="flex flex-col gap-4">
                            {order.items.map((item: any, idx: number) => (
                              <div key={idx} className="flex items-center gap-4 border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                                <div className="w-16 h-16 rounded-xl bg-slate-100 shrink-0 overflow-hidden">
                                  {item.product?.images?.[0] ? (
                                    <img src={item.product.images[0]} alt={item.product?.name} className={`w-full h-full object-cover ${(order.orderStatus === 'delivered' || order.orderStatus === 'cancelled') ? 'grayscale' : ''}`} />
                                  ) : (
                                    <div className="w-full h-full bg-slate-200" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-bold text-sm text-slate-900">{item.product?.name || 'Product unavailable'}</h4>
                                  <p className="text-xs text-slate-500 mt-1">Qty: {item.quantity} | Price: ₹{item.price}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-300">You have no orders yet.</p>
                )}
              </div>
            )}

            {activeTab === "addresses" && (
              <div className="flex flex-col">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                  <h1 className="font-serif text-4xl text-white leading-tight">
                    Shipping<br />Addresses
                  </h1>
                  <p className="text-slate-300 text-sm max-w-xs text-left md:text-right pt-2">
                    Manage your delivery locations for a faster checkout.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {addresses.map((addr, idx) => (
                    <div key={addr._id || idx} className="bg-[#aea3cf]/95 rounded-[2rem] p-8 border border-slate-100 shadow-sm relative">
                      <h3 className="font-bold text-lg text-slate-900 mb-4">Address {idx + 1}</h3>
                      <div className="text-slate-500 text-base leading-relaxed mb-6">
                        {addr.name && <p className="font-bold text-slate-900">{addr.name}</p>}
                        {addr.phone && <p>📞 {addr.phone}</p>}
                        {addr.street && <p>{addr.street}</p>}
                        {addr.apartment && <p>{addr.apartment}</p>}
                        {addr.landmark && <p>Landmark: {addr.landmark}</p>}
                        {addr.postOffice && <p>P.O. {addr.postOffice}</p>}
                        <p>{addr.city}{addr.state ? `, ${addr.state}` : ''} {addr.zipCode}</p>
                        <p>{addr.country}</p>
                      </div>
                      <div className="flex items-center gap-6">
                        <button
                          onClick={() => {
                            setNewAddressForm({
                              name: addr.name || "",
                              phone: addr.phone || "",
                              street: addr.street || "",
                              apartment: addr.apartment || "",
                              landmark: addr.landmark || "",
                              postOffice: addr.postOffice || "",
                              city: addr.city || "",
                              state: addr.state || "",
                              zip: addr.zipCode || "",
                              country: addr.country || "India"
                            });
                            setEditingAddressId(addr._id);
                            setIsAddressModalOpen(true);
                          }}
                          className="text-blue-600 text-sm font-bold hover:underline"
                        >
                          Edit Details
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(addr._id)}
                          className="text-red-500 text-sm font-bold hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={() => {
                      setNewAddressForm({ name: "", phone: "", street: "", apartment: "", landmark: "", postOffice: "", city: "", state: "", zip: "", country: "India" });
                      setEditingAddressId(null);
                      setIsAddressModalOpen(true);
                    }}
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
          <div className="relative bg-[#aea3cf]/95 rounded-[2rem] w-full max-w-lg max-h-[90dvh] shadow-xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 sm:p-8 border-b border-slate-100 shrink-0">
              <h2 className="font-sans font-black text-xl sm:text-2xl text-slate-900 tracking-tight">
                {editingAddressId ? "Edit Shipping Address" : "New Shipping Address"}
              </h2>
              <button
                onClick={() => setIsAddressModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors focus:outline-none shrink-0"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-5 sm:p-8 flex flex-col gap-5 overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block font-sans font-bold text-sm text-slate-700 mb-2">Full Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={newAddressForm.name}
                    onChange={(e) => { setNewAddressForm({ ...newAddressForm, name: e.target.value }); setAddressErrors(prev => ({ ...prev, name: '' })); }}
                    placeholder="Recipient's full name"
                    className={`w-full border rounded-xl px-4 py-3 text-base text-slate-900 focus:outline-none focus:border-blue-500 placeholder:text-slate-700 ${addressErrors.name ? 'border-red-400 ring-1 ring-red-400' : 'border-slate-200'}`}
                  />
                  {addressErrors.name && <p className="text-red-500 text-xs mt-1.5 font-medium">{addressErrors.name}</p>}
                </div>
                <div>
                  <label className="block font-sans font-bold text-sm text-slate-700 mb-2">Phone Number <span className="text-red-500">*</span></label>
                  <input
                    type="tel"
                    inputMode="numeric"
                    value={newAddressForm.phone}
                    onChange={(e) => { setNewAddressForm({ ...newAddressForm, phone: e.target.value }); setAddressErrors(prev => ({ ...prev, phone: '' })); }}
                    placeholder="10-digit mobile number"
                    className={`w-full border rounded-xl px-4 py-3 text-base text-slate-900 focus:outline-none focus:border-blue-500 placeholder:text-slate-700 ${addressErrors.phone ? 'border-red-400 ring-1 ring-red-400' : 'border-slate-200'}`}
                  />
                  {addressErrors.phone && <p className="text-red-500 text-xs mt-1.5 font-medium">{addressErrors.phone}</p>}
                </div>
              </div>

              <div>
                <label className="block font-sans font-bold text-sm text-slate-700 mb-2">Street Address</label>
                <input
                  type="text"
                  value={newAddressForm.street}
                  onChange={(e) => { setNewAddressForm({ ...newAddressForm, street: e.target.value }); setAddressErrors(prev => ({ ...prev, street: '' })); }}
                  placeholder="e.g. 123 Luxury Lane"
                  className={`w-full border rounded-xl px-4 py-3 text-base text-slate-900 focus:outline-none focus:border-blue-500 placeholder:text-slate-700 ${addressErrors.street ? 'border-red-400 ring-1 ring-red-400' : 'border-slate-200'}`}
                />
                {addressErrors.street && <p className="text-red-500 text-xs mt-1.5 font-medium">{addressErrors.street}</p>}
              </div>

              <div>
                <label className="block font-sans font-bold text-sm text-slate-700 mb-2">Post Office <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={newAddressForm.postOffice}
                  onChange={(e) => { setNewAddressForm({ ...newAddressForm, postOffice: e.target.value }); setAddressErrors(prev => ({ ...prev, postOffice: '' })); }}
                  placeholder="e.g. Thamarassery"
                  className={`w-full border rounded-xl px-4 py-3 text-base text-slate-900 focus:outline-none focus:border-blue-500 placeholder:text-slate-700 ${addressErrors.postOffice ? 'border-red-400 ring-1 ring-red-400' : 'border-slate-200'}`}
                />
                {addressErrors.postOffice && <p className="text-red-500 text-xs mt-1.5 font-medium">{addressErrors.postOffice}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block font-sans font-bold text-sm text-slate-700 mb-2">Apartment, suite, etc. <span className="text-slate-400 font-normal">(Optional)</span></label>
                  <input
                    type="text"
                    value={newAddressForm.apartment}
                    onChange={(e) => setNewAddressForm({ ...newAddressForm, apartment: e.target.value })}
                    placeholder="e.g. Apt 4B"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-base text-slate-900 focus:outline-none focus:border-blue-500 placeholder:text-slate-700"
                  />
                </div>
                <div>
                  <label className="block font-sans font-bold text-sm text-slate-700 mb-2">Landmark <span className="text-slate-400 font-normal">(Optional)</span></label>
                  <input
                    type="text"
                    value={newAddressForm.landmark}
                    onChange={(e) => setNewAddressForm({ ...newAddressForm, landmark: e.target.value })}
                    placeholder="e.g. Near City Mall"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-base text-slate-900 focus:outline-none focus:border-blue-500 placeholder:text-slate-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block font-sans font-bold text-sm text-slate-700 mb-2">City <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={newAddressForm.city}
                    onChange={(e) => { setNewAddressForm({ ...newAddressForm, city: e.target.value }); setAddressErrors(prev => ({ ...prev, city: '' })); }}
                    placeholder="Mumbai"
                    className={`w-full border rounded-xl px-4 py-3 text-base text-slate-900 focus:outline-none focus:border-blue-500 placeholder:text-slate-700 ${addressErrors.city ? 'border-red-400 ring-1 ring-red-400' : 'border-slate-200'}`}
                  />
                  {addressErrors.city && <p className="text-red-500 text-xs mt-1.5 font-medium">{addressErrors.city}</p>}
                </div>
                <div>
                  <label className="block font-sans font-bold text-sm text-slate-700 mb-2">State <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={newAddressForm.state}
                    onChange={(e) => { setNewAddressForm({ ...newAddressForm, state: e.target.value }); setAddressErrors(prev => ({ ...prev, state: '' })); }}
                    placeholder="Maharashtra"
                    className={`w-full border rounded-xl px-4 py-3 text-base text-slate-900 focus:outline-none focus:border-blue-500 placeholder:text-slate-700 ${addressErrors.state ? 'border-red-400 ring-1 ring-red-400' : 'border-slate-200'}`}
                  />
                  {addressErrors.state && <p className="text-red-500 text-xs mt-1.5 font-medium">{addressErrors.state}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block font-sans font-bold text-sm text-slate-700 mb-2">PIN Code <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={newAddressForm.zip}
                    onChange={(e) => { setNewAddressForm({ ...newAddressForm, zip: e.target.value }); setAddressErrors(prev => ({ ...prev, zip: '' })); }}
                    placeholder="123456"
                    className={`w-full border rounded-xl px-4 py-3 text-base text-slate-900 focus:outline-none focus:border-blue-500 placeholder:text-slate-700 ${addressErrors.zip ? 'border-red-400 ring-1 ring-red-400' : 'border-slate-200'}`}
                  />
                  {addressErrors.zip && <p className="text-red-500 text-xs mt-1.5 font-medium">{addressErrors.zip}</p>}
                </div>
                <div>
                  <label className="block font-sans font-bold text-sm text-slate-700 mb-2">Country</label>
                  <input
                    type="text"
                    value={newAddressForm.country}
                    onChange={(e) => setNewAddressForm({ ...newAddressForm, country: e.target.value })}
                    placeholder="India"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-base text-slate-900 focus:outline-none focus:border-blue-500 placeholder:text-slate-700"
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

      {/* ── Delete Address Confirmation Modal ── */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setDeleteConfirmId(null)}
          />
          <div className="relative bg-[#aea3cf]/95 rounded-[2rem] w-full max-w-sm shadow-xl p-8 text-center">
            <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-5">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
            </div>
            <h3 className="font-bold text-xl text-slate-900 mb-2">Remove Address?</h3>
            <p className="text-sm text-slate-500 mb-8">This address will be permanently removed from your saved locations.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleDeleteAddress(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold text-sm hover:bg-red-600 transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit Profile Modal ── */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setIsEditProfileOpen(false)}
          />
          <div className="relative bg-[#aea3cf]/95 rounded-[2rem] w-full max-w-md shadow-xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 sm:p-8 border-b border-slate-100">
              <h2 className="font-sans font-black text-2xl text-slate-900 tracking-tight">
                Edit Profile
              </h2>
              <button
                onClick={() => setIsEditProfileOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors focus:outline-none"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-6 sm:p-8 flex flex-col gap-6">
              <div>
                <label className="block font-sans font-bold text-sm text-slate-700 mb-2">Full Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={editProfileForm.name}
                  onChange={(e) => setEditProfileForm({ ...editProfileForm, name: e.target.value })}
                  placeholder="Your Name"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-base text-slate-900 focus:outline-none focus:border-blue-500 placeholder:text-slate-700"
                />
              </div>

              <div>
                <label className="block font-sans font-bold text-sm text-slate-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={editProfileForm.phone}
                  onChange={(e) => setEditProfileForm({ ...editProfileForm, phone: e.target.value })}
                  placeholder="e.g. +91 9876543210"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-base text-slate-900 focus:outline-none focus:border-blue-500 placeholder:text-slate-700"
                />
                <p className="text-[12px] text-slate-500 mt-2">Required for delivery and order updates.</p>
              </div>

              <button
                onClick={handleSaveProfile}
                disabled={isSavingProfile}
                className="w-full bg-blue-600 text-white font-bold text-base py-4 rounded-xl mt-2 hover:bg-blue-700 transition-colors focus:outline-none disabled:opacity-50"
              >
                {isSavingProfile ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
