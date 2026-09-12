"use client";

import {
  AlertTriangle,
  ArrowUpDown,
  ChevronRight,
  Clock,
  Download,
  ExternalLink,
  Eye,
  EyeOff,
  Globe,
  Lock,
  LogOut,
  MapPin,
  Menu,
  Minus,
  Package,
  Phone,
  Plus,
  ReceiptText,
  RotateCcw,
  Search,
  ShieldCheck,
  ShoppingBag,
  Store,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { type DashboardOrder, type OrderItemDetail } from "@/lib/orders-data";
import type { Category, Product } from "@/lib/types";

interface DashboardViewProps {
  initialProducts: Product[];
  categories: Category[];
  initialOrders?: DashboardOrder[];
  initialAuthenticated?: boolean;
}

function safeGetStorage(key: string): string | null {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      return window.localStorage.getItem(key);
    }
  } catch {
    return null;
  }
  return null;
}

function safeSetStorage(key: string, value: string): void {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem(key, value);
    }
  } catch {
    // ignore
  }
}

function safeRemoveStorage(key: string): void {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.removeItem(key);
    }
  } catch {
    // ignore
  }
}

export function DashboardView({
  initialProducts,
  categories,
  initialOrders,
  initialAuthenticated = false,
}: DashboardViewProps) {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (initialAuthenticated) return true;
    return safeGetStorage("burmese-admin-auth") === "true";
  });
  const [adminPasswordInput, setAdminPasswordInput] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string>("");
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  // Navigation tabs: "orders" or "products"
  const [activeTab, setActiveTab] = useState<"orders" | "products">(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab");
      if (tabParam === "orders" || tabParam === "products") {
        return tabParam;
      }
    }
    return "products";
  });
  // Channel filter: "online" or "in-shop"
  const [channel, setChannel] = useState<"online" | "in-shop">("online");
  // Status filter for orders
  const [statusFilter, setStatusFilter] = useState<string>("all");
  // Search query
  const [searchQuery, setSearchQuery] = useState("");
  // Sort state
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "amount-high">("newest");

  // Orders state with lazy initializer
  const [orders, setOrders] = useState<DashboardOrder[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem("burmese-house-admin-orders");
        if (cached) {
          const parsed = JSON.parse(cached);
          // Purge stale mock data if present
          if (
            Array.isArray(parsed) &&
            parsed.length > 0 &&
            !parsed.some(
              (o: { customerName?: string; orderNumber?: string }) =>
                o.customerName === "Bushra Kabir" || o.orderNumber === "3015756"
            )
          ) {
            return parsed;
          }
          localStorage.removeItem("burmese-house-admin-orders");
        }
      } catch {
        // ignore
      }
    }
    return initialOrders && initialOrders.length > 0 ? initialOrders : [];
  });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<DashboardOrder | null>(null);

  // Products state
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [productCategoryFilter, setProductCategoryFilter] = useState<string>("all");
  const [productStockFilter, setProductStockFilter] = useState<"all" | "in-stock" | "low-stock">("all");
  const [productSearch, setProductSearch] = useState("");

  // Modals
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [quickActionOpen, setQuickActionOpen] = useState(false);
  const [createOrderOpen, setCreateOrderOpen] = useState(false);
  const [bannerVisible, setBannerVisible] = useState(true);

  // Form state for creating quick In-Shop order
  const [newCustomerName, setNewCustomerName] = useState("");
  const [newCustomerPhone, setNewCustomerPhone] = useState("");
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?._id || "");
  const [newOrderQty, setNewOrderQty] = useState(1);

  // Fetch fresh orders, products, and check admin auth on mount
  useEffect(() => {
    let active = true;

    // Check auth from cookie in background if not already marked authenticated
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/admin/auth");
        if (res.ok) {
          const data = await res.json();
          if (active && data.authenticated) {
            setIsAuthenticated(true);
            safeSetStorage("burmese-admin-auth", "true");
          }
        }
      } catch {
        // silent catch
      }
    };

    checkAuth();

    // Fetch fresh products from Sanity API
    fetch("/api/admin/products")
      .then((res) => res.json())
      .then((data: Product[]) => {
        if (active && Array.isArray(data) && data.length > 0) {
          setProducts(data);
        }
      })
      .catch((err) => console.warn("Products fetch error:", err));

    // Fetch fresh orders from Sanity API
    fetch("/api/admin/orders")
      .then((res) => res.json())
      .then((data: DashboardOrder[]) => {
        if (active && Array.isArray(data) && data.length > 0) {
          setOrders(data);
          try {
            safeSetStorage("burmese-house-admin-orders", JSON.stringify(data));
          } catch {
            // ignore
          }
        }
      })
      .catch((err) => console.warn("Orders fetch error:", err));

    return () => {
      active = false;
    };
  }, []);

  // Handle Admin Login submission
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setIsLoggingIn(true);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: adminPasswordInput }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
        safeSetStorage("burmese-admin-auth", "true");
        toast.success("Welcome to Burmese House Merchant Dashboard!");
      } else {
        setLoginError(data.error || "Incorrect password. Please try again.");
      }
    } catch {
      setLoginError("Connection failed. Please check network and try again.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Handle Admin Logout
  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
    } catch {
      // ignore
    }
    safeRemoveStorage("burmese-admin-auth");
    setIsAuthenticated(false);
    toast.success("Signed out of admin portal");
  };

  // Update order status
  const handleUpdateOrderStatus = async (orderId: string, newStatus: DashboardOrder["orderStatus"]) => {
    const updated = orders.map((o) => (o.id === orderId ? { ...o, orderStatus: newStatus } : o));
    setOrders(updated);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, orderStatus: newStatus });
    }
    try {
      localStorage.setItem("burmese-house-admin-orders", JSON.stringify(updated));
    } catch {
      // ignore
    }

    toast.success(`Order #${orderId} status updated to ${newStatus}`);

    try {
      await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, orderStatus: newStatus }),
      });
    } catch {
      // locally updated already
    }
  };

  // Toggle payment status
  const handleTogglePaymentStatus = async (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;
    const nextStatus: DashboardOrder["paymentStatus"] = order.paymentStatus === "paid" ? "unpaid" : "paid";
    const updated = orders.map((o) => (o.id === orderId ? { ...o, paymentStatus: nextStatus } : o));
    setOrders(updated);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, paymentStatus: nextStatus });
    }
    try {
      localStorage.setItem("burmese-house-admin-orders", JSON.stringify(updated));
    } catch {
      // ignore
    }
    toast.success(`Payment marked as ${nextStatus.toUpperCase()}`);

    try {
      await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, paymentStatus: nextStatus }),
      });
    } catch {
      // locally updated
    }
  };

  // Refresh orders & products handler
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const [ordersRes, prodsRes] = await Promise.all([
        fetch("/api/admin/orders"),
        fetch("/api/admin/products"),
      ]);
      const data: DashboardOrder[] = await ordersRes.json();
      const prods: Product[] = await prodsRes.json();
      if (Array.isArray(data)) {
        setOrders(data);
        localStorage.setItem("burmese-house-admin-orders", JSON.stringify(data));
      }
      if (Array.isArray(prods) && prods.length > 0) {
        setProducts(prods);
      }
      toast.success("Orders & products refreshed");
    } catch {
      toast.error("Could not refresh data");
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  // Create In-Shop order
  const handleCreateInShopOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    const prod = products.find((p) => p._id === selectedProductId) || products[0];
    if (!prod) return;

    const unitPrice = prod.salePrice || prod.regularPrice;
    const totalAmount = unitPrice * newOrderQty;
    const orderItem: OrderItemDetail = {
      productId: prod._id,
      title: prod.title,
      variantTitle: prod.variants?.[0]?.title || "Standard Jar",
      imageUrl: prod.images?.[0] || "/images/mango-chutney.png",
      quantity: newOrderQty,
      unitPrice,
      lineTotal: totalAmount,
      sku: prod.sku,
    };

    const newSeq = orders.length + 1;
    const now = new Date();
    const dateFormatted =
      now.toLocaleDateString("en-US", { month: "short", day: "numeric" }) +
      " · " +
      now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

    const newOrder: DashboardOrder = {
      id: String(newSeq),
      orderSeq: newSeq,
      orderNumber: `${3000000 + Math.floor(Math.random() * 90000)}`,
      fullOrderCode: `BH-${now.toISOString().slice(2, 10).replaceAll("-", "")}-${Math.floor(1000 + Math.random() * 9000)}`,
      channel: "in-shop",
      customerName: newCustomerName.trim() || "Walk-in Customer",
      phone: newCustomerPhone.trim() || "+8801700000000",
      district: "Dhaka",
      area: "Banani Outlet",
      address: "Store Walk-in Counter",
      deliveryZone: "inside-dhaka",
      itemsCount: 1,
      totalQuantity: newOrderQty,
      subtotal: totalAmount,
      shippingCharge: 0,
      totalAmount,
      paymentMethod: "cod",
      paymentStatus: "paid",
      orderStatus: "delivered",
      dateFormatted,
      createdAt: now.toISOString(),
      items: [orderItem],
    };

    const updated = [newOrder, ...orders];
    setOrders(updated);
    try {
      localStorage.setItem("burmese-house-admin-orders", JSON.stringify(updated));
    } catch {
      // ignore
    }

    toast.success(`In-Shop Order #${newOrder.id} created successfully!`);
    setCreateOrderOpen(false);
    setNewCustomerName("");
    setNewCustomerPhone("");
    setNewOrderQty(1);

    fetch("/api/admin/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newOrder),
    }).catch(() => {});
  };

  // Adjust stock count locally and persist to Sanity
  const handleStockAdjust = (productId: string, delta: number) => {
    let targetStock = 0;
    setProducts((prev) =>
      prev.map((p) => {
        if (p._id === productId) {
          const newStock = Math.max(0, p.stockQuantity + delta);
          targetStock = newStock;
          return { ...p, stockQuantity: newStock };
        }
        return p;
      })
    );
    toast.success("Stock updated");

    fetch("/api/admin/products/stock", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, stockQuantity: targetStock }),
    }).catch((err) => console.warn("Stock update sync failed", err));
  };

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders
      .filter((o) => {
        // Channel filter
        if (o.channel !== channel) return false;
        // Status filter
        if (statusFilter !== "all" && o.orderStatus !== statusFilter) return false;
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchesPhone = o.phone.toLowerCase().includes(q);
          const matchesName = o.customerName.toLowerCase().includes(q);
          const matchesOrderNum = o.orderNumber.toLowerCase().includes(q);
          const matchesCode = o.fullOrderCode.toLowerCase().includes(q);
          if (!matchesPhone && !matchesName && !matchesOrderNum && !matchesCode) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortOrder === "newest") return b.orderSeq - a.orderSeq;
        if (sortOrder === "oldest") return a.orderSeq - b.orderSeq;
        if (sortOrder === "amount-high") return b.totalAmount - a.totalAmount;
        return 0;
      });
  }, [orders, channel, statusFilter, searchQuery, sortOrder]);

  // Product stats
  const productStats = useMemo(() => {
    const total = products.length;
    const inStock = products.filter((p) => p.stockQuantity > 5).length;
    const lowStock = products.filter((p) => p.stockQuantity <= 5).length;
    const totalVariants = products.reduce((sum, p) => sum + (p.variants?.length || 1), 0);
    return { total, inStock, lowStock, totalVariants };
  }, [products]);

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (productCategoryFilter !== "all" && p.category?.slug !== productCategoryFilter) return false;
      if (productStockFilter === "in-stock" && p.stockQuantity === 0) return false;
      if (productStockFilter === "low-stock" && p.stockQuantity > 5) return false;
      if (productSearch.trim()) {
        const q = productSearch.toLowerCase().trim();
        const matchesTitle = p.title.toLowerCase().includes(q);
        const matchesSku = p.sku.toLowerCase().includes(q);
        const matchesCat = p.category?.name.toLowerCase().includes(q);
        if (!matchesTitle && !matchesSku && !matchesCat) return false;
      }
      return true;
    });
  }, [products, productCategoryFilter, productStockFilter, productSearch]);

  // Pending orders count
  const pendingOrdersCount = useMemo(() => {
    return orders.filter((o) => o.orderStatus === "placed" || o.orderStatus === "confirmed").length;
  }, [orders]);

  // Export orders to CSV
  const handleExportCSV = () => {
    const rows = [
      ["Order #", "Channel", "Customer Name", "Phone", "Status", "Payment", "Total (BDT)", "Date"],
      ...filteredOrders.map((o) => [
        o.orderNumber,
        o.channel,
        o.customerName,
        o.phone,
        o.orderStatus,
        o.paymentStatus,
        o.totalAmount.toFixed(2),
        o.dateFormatted,
      ]),
    ];
    const csvContent = "data:text/csv;charset=utf-8," + rows.map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `orders-${channel}-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Orders exported to CSV");
  };

  // If not authenticated: render secure login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4 select-none">
        <div className="w-full max-w-sm bg-white rounded-3xl p-6 sm:p-7 shadow-xl border border-stone-200/80">
          <div className="flex flex-col items-center text-center">
            <div className="relative h-12 w-36 mb-4">
              <Image
                src="/logo.png"
                alt="Burmese House"
                fill
                priority
                sizes="144px"
                className="object-contain"
              />
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#6f2742]/10 text-[#6f2742] text-[11px] font-bold uppercase tracking-wider mb-2">
              <ShieldCheck size={13} />
              Merchant Portal
            </div>
            <h1 className="text-xl font-extrabold text-stone-900 tracking-tight">Admin Authentication</h1>
            <p className="text-xs text-stone-500 mt-1 max-w-[260px]">
              Please enter your merchant password to access the products and orders manager.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                Admin Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={adminPasswordInput}
                  onChange={(e) => {
                    setAdminPasswordInput(e.target.value);
                    if (loginError) setLoginError("");
                  }}
                  placeholder="Enter admin password..."
                  required
                  autoFocus
                  className="w-full h-11 pl-3.5 pr-10 text-sm bg-stone-50 border border-stone-300 rounded-xl outline-none focus:border-[#6f2742] focus:ring-2 focus:ring-[#6f2742]/20 font-medium text-stone-900"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {loginError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertTriangle size={15} className="shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full h-11 rounded-xl bg-[#6f2742] hover:bg-[#5a1e35] text-white font-bold text-sm shadow-md shadow-[#6f2742]/20 active:scale-[0.98] transition flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              {isLoggingIn ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <Lock size={15} />
                  <span>Log In to Admin Portal</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
            <Link
              href="/"
              className="hover:text-stone-900 font-semibold flex items-center gap-1 transition"
            >
              &larr; Back to Store
            </Link>
            <span className="text-[11px] text-stone-400 font-mono">Burmese House</span>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200/80 text-[11px] text-amber-900 leading-relaxed">
            <span className="font-bold block mb-0.5">Quick Access Hint:</span>
            Default password is <code className="bg-amber-100/80 px-1.5 py-0.5 rounded font-mono font-bold text-amber-950">burmeseadmin</code> or <code className="bg-amber-100/80 px-1.5 py-0.5 rounded font-mono font-bold text-amber-950">admin1234</code>.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f5f8] text-stone-900 pb-28 select-none font-sans antialiased">
      {/* Top Bar (Burmese House Merchant Header) */}
      <header className="sticky top-0 z-30 bg-white border-b border-stone-200/80 px-4 py-2.5 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button
            onClick={() => setDrawerOpen(true)}
            className="p-1.5 -ml-1.5 text-stone-700 hover:text-stone-900 active:scale-95 transition"
            aria-label="Open navigation drawer"
          >
            <Menu size={24} strokeWidth={2.2} />
          </button>

          {/* Website Logo */}
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="relative h-8 w-28 shrink-0">
              <Image
                src="/logo.png"
                alt="Burmese House"
                fill
                priority
                sizes="112px"
                className="object-contain object-left"
              />
            </div>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-stone-900 text-amber-300 uppercase tracking-wider">
              Admin
            </span>
          </Link>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleRefresh}
              className={`p-1.5 text-stone-500 hover:text-[#6f2742] transition ${isRefreshing ? "animate-spin text-[#6f2742]" : ""}`}
              title="Refresh Orders & Products"
            >
              <RotateCcw size={18} />
            </button>
            <Link
              href="/"
              target="_blank"
              className="text-xs font-semibold text-stone-600 hover:text-[#6f2742] flex items-center gap-1 bg-stone-100 px-2 py-1 rounded-lg"
              title="View Public Store"
            >
              <Store size={14} />
              <span className="hidden sm:inline">Store</span>
            </Link>
            <button
              onClick={handleLogout}
              className="p-1.5 text-stone-400 hover:text-rose-600 transition"
              title="Sign Out"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area Container (Centered mobile frame on desktop, 100% full width on mobile) */}
      <main className="max-w-md mx-auto px-3.5 pt-3.5">
        {/* Top Segmented Navigation Tabs (Products vs Orders) */}
        <div className="grid grid-cols-2 p-1 bg-stone-200/80 rounded-2xl mb-3.5 shadow-inner">
          <button
            type="button"
            onClick={() => {
              setActiveTab("products");
              if (typeof window !== "undefined") {
                window.history.replaceState(null, "", "?tab=products");
              }
            }}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === "products"
                ? "bg-white text-stone-900 shadow-sm"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <Store size={15} />
            <span>Products ({productStats.total})</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab("orders");
              if (typeof window !== "undefined") {
                window.history.replaceState(null, "", "?tab=orders");
              }
            }}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === "orders"
                ? "bg-white text-stone-900 shadow-sm"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <ReceiptText size={15} />
            <span>Orders ({orders.length})</span>
            {pendingOrdersCount > 0 && (
              <span className="ml-1 rounded-full bg-rose-500 text-white text-[10px] px-1.5 py-0.2 font-extrabold">
                {pendingOrdersCount}
              </span>
            )}
          </button>
        </div>

        {/* Top Warning/Alert Banner */}
        {bannerVisible && (
          <div className="mb-3.5 rounded-2xl border border-[#fbd38d]/60 bg-[#fffaf0] p-4 shadow-sm relative transition">
            <button
              onClick={() => setBannerVisible(false)}
              className="absolute right-2.5 top-2.5 text-stone-400 hover:text-stone-600 p-1"
              aria-label="Dismiss banner"
            >
              <X size={16} />
            </button>
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#feebc8] text-[#c05621]">
                <AlertTriangle size={20} strokeWidth={2.3} />
              </div>
              <div className="pr-4">
                <h2 className="text-sm font-bold text-[#7b341e]">
                  {activeTab === "orders" ? "Pending Orders Alert" : "Inventory Overview"}
                </h2>
                <p className="mt-0.5 text-xs leading-relaxed text-[#9c4221]">
                  {activeTab === "orders"
                    ? `${pendingOrdersCount} orders need rider dispatch confirmation. Settle them to maintain same-day delivery.`
                    : `${productStats.total} total products listed in Burmese House catalog. Manage stocks & variants.`}
                </p>
                <div className="mt-3">
                  <button
                    onClick={() => {
                      if (activeTab === "orders") {
                        setStatusFilter("confirmed");
                      } else {
                        setProductStockFilter("low-stock");
                      }
                    }}
                    className="rounded-xl bg-[#ed8936] px-4 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-[#dd6b20] active:scale-95 transition"
                  >
                    {activeTab === "orders" ? "View Confirmed" : "Check Low Stock"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB 1: ORDERS ===================== */}
        {activeTab === "orders" && (
          <div>
            {/* Channel Tabs & Action Buttons (Online / In Shop / + / Sort / Download) */}
            <div className="flex items-center justify-between gap-2 mb-3">
              {/* Channel Selector */}
              <div className="flex items-center bg-stone-200/70 p-1 rounded-2xl flex-1 max-w-[210px]">
                <button
                  onClick={() => setChannel("online")}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition ${
                    channel === "online"
                      ? "bg-white text-[#5423e7] shadow-sm"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  Online
                </button>
                <button
                  onClick={() => setChannel("in-shop")}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition ${
                    channel === "in-shop"
                      ? "bg-white text-[#5423e7] shadow-sm"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  In Shop
                </button>
              </div>

              {/* Right Action Icons (+, Sort, Download) */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCreateOrderOpen(true)}
                  className="w-9 h-9 rounded-xl bg-[#5423e7] text-white flex items-center justify-center hover:bg-[#4318cf] active:scale-95 shadow-sm transition"
                  title="Add Manual In-Shop Order"
                >
                  <Plus size={19} strokeWidth={2.5} />
                </button>
                <button
                  onClick={() => {
                    if (sortOrder === "newest") setSortOrder("oldest");
                    else if (sortOrder === "oldest") setSortOrder("amount-high");
                    else setSortOrder("newest");
                    toast.info(`Sort: ${sortOrder === "newest" ? "Oldest" : sortOrder === "oldest" ? "Highest Price" : "Newest"}`);
                  }}
                  className="w-9 h-9 rounded-xl border border-stone-300 bg-white text-stone-700 flex items-center justify-center hover:bg-stone-50 active:scale-95 shadow-sm transition"
                  title="Toggle Sort"
                >
                  <ArrowUpDown size={17} />
                </button>
                <button
                  onClick={handleExportCSV}
                  className="w-9 h-9 rounded-xl border border-stone-300 bg-white text-stone-700 flex items-center justify-center hover:bg-stone-50 active:scale-95 shadow-sm transition"
                  title="Export to CSV"
                >
                  <Download size={17} />
                </button>
              </div>
            </div>

            {/* Search and Status Dropdown Row */}
            <div className="flex items-center gap-2 mb-3">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search phone"
                  className="w-full h-10 pl-9 pr-3 text-xs bg-white border border-stone-200/90 rounded-xl outline-none focus:border-[#5423e7] focus:ring-1 focus:ring-[#5423e7] shadow-sm text-stone-800 placeholder-stone-400 font-medium"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Status Filter Dropdown */}
              <div className="w-[110px] shrink-0">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full h-10 px-3 text-xs font-bold bg-white border border-stone-200/90 rounded-xl outline-none focus:border-[#5423e7] shadow-sm text-stone-700 cursor-pointer"
                >
                  <option value="all">All</option>
                  <option value="placed">Placed</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Active Filters Pill info */}
            {(statusFilter !== "all" || searchQuery) && (
              <div className="flex items-center justify-between text-xs text-stone-500 mb-2.5 px-1">
                <span>
                  Found <strong>{filteredOrders.length}</strong> matching orders
                </span>
                <button
                  onClick={() => {
                    setStatusFilter("all");
                    setSearchQuery("");
                  }}
                  className="text-[#5423e7] font-bold hover:underline"
                >
                  Clear filters
                </button>
              </div>
            )}

            {/* Orders List (Exact layout matching the user's reference screenshot) */}
            <div className="space-y-3">
              {filteredOrders.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-8 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-[#5423e7] mb-3">
                    <ReceiptText size={24} />
                  </div>
                  <h3 className="text-sm font-bold text-stone-800">No orders found</h3>
                  <p className="mt-1 text-xs text-stone-500 max-w-xs mx-auto">
                    {channel === "in-shop"
                      ? "No in-shop counter orders recorded yet. Tap '+' to create an order."
                      : "No online orders match your current search or status filter."}
                  </p>
                  {channel === "in-shop" && (
                    <button
                      onClick={() => setCreateOrderOpen(true)}
                      className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-[#5423e7] px-4 py-2 text-xs font-bold text-white shadow-sm"
                    >
                      <Plus size={16} /> Create First In-Shop Order
                    </button>
                  )}
                </div>
              ) : (
                filteredOrders.map((order) => {
                  const statusColors: Record<string, string> = {
                    confirmed: "bg-[#16a34a] text-white",
                    delivered: "bg-[#15803d] text-white",
                    placed: "bg-[#d97706] text-white",
                    processing: "bg-[#4f46e5] text-white",
                    shipped: "bg-[#2563eb] text-white",
                    cancelled: "bg-[#dc2626] text-white",
                  };

                  return (
                    <div
                      key={order.id}
                      onClick={() => setSelectedOrder(order)}
                      className="group cursor-pointer rounded-2xl border border-stone-200/90 bg-white p-3.5 shadow-sm hover:shadow-md hover:border-purple-200 transition-all active:scale-[0.99]"
                    >
                      {/* Card Header Row */}
                      <div className="flex items-center justify-between pb-2.5 border-b border-stone-100">
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold text-sm text-[#4338ca]">#{order.orderSeq}</span>

                          {/* Channel Badge */}
                          <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700">
                            <Globe size={11} className="shrink-0" />
                            {order.channel === "online" ? "Online" : "In Shop"}
                          </span>

                          {/* Payment Status Pill */}
                          <span
                            className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold ${
                              order.paymentStatus === "paid"
                                ? "bg-emerald-50 text-emerald-700"
                                : order.paymentStatus === "submitted"
                                  ? "bg-amber-50 text-amber-700"
                                  : "bg-rose-50 text-rose-700"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                order.paymentStatus === "paid"
                                  ? "bg-emerald-500"
                                  : order.paymentStatus === "submitted"
                                    ? "bg-amber-500"
                                    : "bg-rose-500"
                              }`}
                            />
                            {order.paymentStatus === "paid"
                              ? "Paid"
                              : order.paymentStatus === "submitted"
                                ? "Review Trx"
                                : "Unpaid"}
                          </span>

                          {/* Refresh button on card */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRefresh();
                            }}
                            className="p-1 text-stone-400 hover:text-purple-600 rounded-full hover:bg-stone-100 transition"
                            title="Refresh order"
                          >
                            <RotateCcw size={12} />
                          </button>
                        </div>

                        {/* Price with right chevron */}
                        <div className="flex items-center gap-1">
                          <span className="font-black text-stone-900 text-sm tracking-tight">
                            {order.totalAmount.toFixed(2)} ৳
                          </span>
                          <ChevronRight size={15} className="text-stone-400 group-hover:text-purple-600 transition" />
                        </div>
                      </div>

                      {/* Card Body (Item thumbnails + Customer Details) */}
                      <div className="flex items-center gap-3 py-2.5">
                        {/* Product Thumbnails side-by-side */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          {order.items.slice(0, 2).map((item, idx) => (
                            <div
                              key={idx}
                              className="relative h-12 w-12 rounded-xl overflow-hidden bg-stone-900 border border-stone-100 shadow-sm shrink-0"
                            >
                              <Image
                                src={item.imageUrl || "/images/mango-chutney.png"}
                                alt={item.title}
                                fill
                                sizes="48px"
                                className="object-cover"
                              />
                            </div>
                          ))}
                          {order.items.length > 2 && (
                            <div className="flex h-12 w-8 items-center justify-center rounded-xl bg-stone-100 text-[10px] font-bold text-stone-600">
                              +{order.items.length - 2}
                            </div>
                          )}
                        </div>

                        {/* Customer Information */}
                        <div className="min-w-0 flex-1">
                          <h3 className="font-bold text-stone-900 text-sm truncate">{order.customerName}</h3>
                          <a
                            href={`tel:${order.phone}`}
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1 text-xs text-stone-600 font-semibold hover:text-[#5423e7] mt-0.5"
                          >
                            <Phone size={12} className="text-stone-400" />
                            <span>{order.phone}</span>
                          </a>
                          <div className="flex items-center gap-1.5 text-[11px] text-stone-500 mt-0.5">
                            <span>
                              {order.itemsCount} {order.itemsCount > 1 ? "items" : "item"} · {order.totalQuantity} qty
                            </span>
                            <span>·</span>
                            <span>Order #{order.orderNumber}</span>
                          </div>
                          <div className="flex items-center gap-1 text-[11px] text-stone-500 truncate mt-0.5">
                            <MapPin size={11} className="text-stone-400 shrink-0" />
                            <span className="truncate">{order.area || order.district || "Others"}</span>
                          </div>
                        </div>
                      </div>

                      {/* Card Footer (Date & Status Pill) */}
                      <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                        <div className="flex items-center gap-1.5 text-xs text-stone-500 font-medium">
                          <Clock size={12} className="text-stone-400" />
                          <span>{order.dateFormatted}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`rounded-md px-2.5 py-1 text-[11px] font-bold capitalize tracking-wide shadow-xs ${
                              statusColors[order.orderStatus] || "bg-stone-600 text-white"
                            }`}
                          >
                            {order.orderStatus}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ===================== TAB 2: PRODUCTS ===================== */}
        {activeTab === "products" && (
          <div>
            {/* Products Metrics Summary */}
            <div className="grid grid-cols-3 gap-2 mb-3.5">
              <div className="bg-white rounded-2xl border border-stone-200/90 p-3 shadow-sm text-center">
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">Products</span>
                <span className="text-xl font-extrabold text-stone-900 mt-0.5 block">{productStats.total}</span>
                <span className="text-[10px] text-purple-700 font-semibold">{productStats.totalVariants} Variants</span>
              </div>
              <div className="bg-white rounded-2xl border border-stone-200/90 p-3 shadow-sm text-center">
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">In Stock</span>
                <span className="text-xl font-extrabold text-emerald-600 mt-0.5 block">{productStats.inStock}</span>
                <span className="text-[10px] text-emerald-700 font-semibold">Active & Live</span>
              </div>
              <div className="bg-white rounded-2xl border border-stone-200/90 p-3 shadow-sm text-center">
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">Low Stock</span>
                <span className="text-xl font-extrabold text-amber-600 mt-0.5 block">{productStats.lowStock}</span>
                <span className="text-[10px] text-amber-700 font-semibold">&le; 5 units left</span>
              </div>
            </div>

            {/* Top Product Controls (Search & Add) */}
            <div className="flex items-center gap-2 mb-3">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Search products, SKU..."
                  className="w-full h-10 pl-9 pr-3 text-xs bg-white border border-stone-200/90 rounded-xl outline-none focus:border-[#5423e7] focus:ring-1 focus:ring-[#5423e7] shadow-sm text-stone-800 placeholder-stone-400 font-medium"
                />
                {productSearch && (
                  <button
                    onClick={() => setProductSearch("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              <Link
                href="/studio"
                target="_blank"
                className="h-10 px-3.5 rounded-xl bg-[#6f2742] !text-white flex items-center gap-1.5 text-xs font-bold hover:bg-[#5a1e35] active:scale-95 shadow-sm transition shrink-0"
              >
                <Plus size={16} strokeWidth={2.5} />
                <span>Add / Studio</span>
              </Link>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none mb-2">
              <button
                onClick={() => setProductCategoryFilter("all")}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold whitespace-nowrap transition ${
                  productCategoryFilter === "all"
                    ? "bg-[#6f2742] text-white shadow-sm"
                    : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-50"
                }`}
              >
                All Products ({products.length})
              </button>
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => setProductCategoryFilter(cat.slug)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-bold whitespace-nowrap transition ${
                    productCategoryFilter === cat.slug
                      ? "bg-[#6f2742] text-white shadow-sm"
                      : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-50"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Product List Cards */}
            <div className="space-y-3">
              {filteredProducts.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-8 text-center">
                  <Package size={28} className="mx-auto text-stone-400 mb-2" />
                  <h3 className="text-sm font-bold text-stone-800">No products matching filter</h3>
                  <p className="text-xs text-stone-500 mt-1">
                    {products.length} products exist in your catalog.
                  </p>
                  <button
                    onClick={() => {
                      setProductCategoryFilter("all");
                      setProductStockFilter("all");
                      setProductSearch("");
                    }}
                    className="mt-3 px-4 py-1.5 rounded-xl bg-[#6f2742] text-white text-xs font-bold hover:bg-[#5a1e35] transition"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                filteredProducts.map((p) => {
                  const isLow = p.stockQuantity <= 5;
                  const isOutOfStock = p.stockQuantity === 0;

                  return (
                    <div
                      key={p._id}
                      className="rounded-2xl border border-stone-200/90 bg-white p-3.5 shadow-sm hover:shadow-md transition-all"
                    >
                      <div className="flex items-start gap-3">
                        {/* Product Image */}
                        <div className="relative h-20 w-20 rounded-xl overflow-hidden bg-stone-900 border border-stone-100 shrink-0 shadow-sm">
                          <Image
                            src={p.images?.[0] || "/images/mango-chutney.png"}
                            alt={p.title}
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        </div>

                        {/* Product Info */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-1">
                            <div>
                              <h3 className="font-bold text-stone-900 text-sm leading-tight">{p.title}</h3>
                              <span className="text-[11px] text-stone-500 font-mono">SKU: {p.sku}</span>
                            </div>

                            {/* Stock Badge */}
                            <span
                              className={`rounded-md px-2 py-0.5 text-[10px] font-bold shrink-0 ${
                                isOutOfStock
                                  ? "bg-rose-100 text-rose-800"
                                  : isLow
                                    ? "bg-amber-100 text-amber-800"
                                    : "bg-emerald-100 text-emerald-800"
                              }`}
                            >
                              {isOutOfStock ? "Out of Stock" : `${p.stockQuantity} in stock`}
                            </span>
                          </div>

                          {/* Price Display */}
                          <div className="mt-1.5 flex items-baseline gap-2">
                            <span className="font-extrabold text-stone-900 text-base">
                              {(p.salePrice || p.regularPrice).toFixed(2)} ৳
                            </span>
                            {p.salePrice && p.salePrice < p.regularPrice && (
                              <span className="text-xs text-stone-400 line-through">
                                {p.regularPrice.toFixed(2)} ৳
                              </span>
                            )}
                            <span className="text-[11px] text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded font-semibold ml-auto">
                              {p.category?.name || "Achar"}
                            </span>
                          </div>

                          {/* Variants preview if any */}
                          {p.variants && p.variants.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {p.variants.map((v) => (
                                <span
                                  key={v._key}
                                  className="text-[10px] font-semibold bg-stone-100 text-stone-600 px-2 py-0.5 rounded-md border border-stone-200/60"
                                >
                                  {v.title} ({v.stock} pcs)
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Card Action Row: Quick Stock Adjust & Links */}
                      <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between">
                        {/* Quick Stock Adjuster */}
                        <div className="flex items-center gap-1.5 bg-stone-100 rounded-xl p-1">
                          <span className="text-[11px] font-semibold text-stone-500 pl-1.5 pr-1">Stock:</span>
                          <button
                            onClick={() => handleStockAdjust(p._id, -1)}
                            className="w-6 h-6 rounded-lg bg-white text-stone-700 flex items-center justify-center hover:bg-stone-200 active:scale-95 shadow-xs font-bold"
                            title="Decrease stock"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="text-xs font-bold text-stone-800 px-1">{p.stockQuantity}</span>
                          <button
                            onClick={() => handleStockAdjust(p._id, 1)}
                            className="w-6 h-6 rounded-lg bg-white text-stone-700 flex items-center justify-center hover:bg-stone-200 active:scale-95 shadow-xs font-bold"
                            title="Increase stock"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        {/* External Actions */}
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/products/${p.slug}`}
                            target="_blank"
                            className="text-[11px] font-bold text-stone-600 hover:text-purple-700 flex items-center gap-1 bg-stone-100 hover:bg-stone-200 px-2.5 py-1.5 rounded-xl transition"
                          >
                            <span>View</span>
                            <ExternalLink size={11} />
                          </Link>
                          <Link
                            href="/studio"
                            target="_blank"
                            className="text-[11px] font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1 bg-purple-50 hover:bg-purple-100 px-2.5 py-1.5 rounded-xl transition"
                          >
                            <span>Edit in Studio</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </main>

      {/* ===================== MOBILE BOTTOM NAVIGATION (2 Tabs: Products & Orders) ===================== */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 py-1.5 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
        <div className="max-w-md mx-auto px-4 flex items-center gap-2">
          {/* Left Tab: Products */}
          <button
            type="button"
            onClick={() => {
              setActiveTab("products");
              if (typeof window !== "undefined") {
                window.history.replaceState(null, "", "?tab=products");
              }
            }}
            className={`flex-1 flex flex-col items-center justify-center py-2 px-3 rounded-2xl transition-all active:scale-95 ${
              activeTab === "products"
                ? "bg-[#6f2742]/10 text-[#6f2742] font-bold"
                : "text-stone-500 hover:text-stone-800 font-medium"
            }`}
          >
            <div className="relative">
              <Store size={22} strokeWidth={activeTab === "products" ? 2.5 : 1.9} />
              <span className="absolute -top-1.5 -right-3.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-stone-900 px-1 text-[9px] font-extrabold text-amber-300">
                {productStats.total}
              </span>
            </div>
            <span className="text-xs mt-1">Products</span>
          </button>

          {/* Right Tab: Orders */}
          <button
            type="button"
            onClick={() => {
              setActiveTab("orders");
              if (typeof window !== "undefined") {
                window.history.replaceState(null, "", "?tab=orders");
              }
            }}
            className={`flex-1 flex flex-col items-center justify-center py-2 px-3 rounded-2xl transition-all active:scale-95 ${
              activeTab === "orders"
                ? "bg-[#6f2742]/10 text-[#6f2742] font-bold"
                : "text-stone-500 hover:text-stone-800 font-medium"
            }`}
          >
            <div className="relative">
              <ReceiptText size={22} strokeWidth={activeTab === "orders" ? 2.5 : 1.9} />
              {pendingOrdersCount > 0 ? (
                <span className="absolute -top-1.5 -right-3.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-extrabold text-white animate-pulse">
                  {pendingOrdersCount}
                </span>
              ) : (
                <span className="absolute -top-1.5 -right-3.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-stone-200 px-1 text-[9px] font-bold text-stone-700">
                  {orders.length}
                </span>
              )}
            </div>
            <span className="text-xs mt-1">Orders</span>
          </button>
        </div>
      </nav>

      {/* ===================== ORDER DETAIL MODAL ===================== */}
      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-y-auto p-5 shadow-2xl animate-in slide-in-from-bottom-6 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div>
                <span className="text-xs font-bold text-[#5423e7]">Order Details</span>
                <h3 className="text-lg font-extrabold text-stone-900">
                  #{selectedOrder.orderNumber}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 rounded-full hover:bg-stone-100 text-stone-500 hover:text-stone-900"
              >
                <X size={20} />
              </button>
            </div>

            {/* Order Status Changer Bar */}
            <div className="my-4 p-3 rounded-2xl bg-purple-50/70 border border-purple-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-purple-900">Change Order Status:</span>
                <span className="text-[11px] font-extrabold uppercase px-2 py-0.5 rounded bg-purple-200 text-purple-800">
                  Current: {selectedOrder.orderStatus}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {(["confirmed", "processing", "shipped", "delivered", "cancelled"] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => handleUpdateOrderStatus(selectedOrder.id, st)}
                    className={`py-1.5 px-2 rounded-xl text-xs font-bold capitalize transition ${
                      selectedOrder.orderStatus === st
                        ? "bg-[#5423e7] text-white shadow-sm"
                        : "bg-white text-stone-700 border border-stone-200 hover:bg-purple-100"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Customer Details & Contact Actions */}
            <div className="space-y-3">
              <div className="rounded-2xl border border-stone-200 p-3.5 bg-stone-50/60">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Customer</span>
                  <span className="text-xs font-bold text-stone-900">{selectedOrder.customerName}</span>
                </div>
                <div className="mt-2.5 flex items-center gap-2">
                  <a
                    href={`tel:${selectedOrder.phone}`}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-sm hover:bg-emerald-700 transition"
                  >
                    <Phone size={14} /> Call Customer
                  </a>
                  <a
                    href={`https://wa.me/${selectedOrder.phone.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[#25d366] text-white text-xs font-bold shadow-sm hover:opacity-90 transition"
                  >
                    WhatsApp
                  </a>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="rounded-2xl border border-stone-200 p-3.5 bg-stone-50/60 text-xs">
                <span className="font-bold text-stone-500 uppercase tracking-wider block mb-1">
                  Delivery Destination
                </span>
                <p className="font-semibold text-stone-800">{selectedOrder.address}</p>
                <p className="text-stone-500 mt-0.5">
                  {selectedOrder.area}, {selectedOrder.district} (
                  {selectedOrder.deliveryZone === "inside-dhaka"
                    ? "Inside Dhaka"
                    : selectedOrder.deliveryZone === "outside-dhaka"
                    ? "Outside Dhaka"
                    : selectedOrder.deliveryZone || "Standard Delivery"})
                </p>
                {selectedOrder.customerNote && (
                  <p className="mt-2 p-2 rounded-lg bg-amber-50 border border-amber-100 text-amber-900 font-medium">
                    <strong>Note:</strong> {selectedOrder.customerNote}
                  </p>
                )}
              </div>

              {/* Items Breakdown */}
              <div className="rounded-2xl border border-stone-200 p-3.5 bg-stone-50/60">
                <span className="font-bold text-xs text-stone-500 uppercase tracking-wider block mb-2">
                  Ordered Items ({selectedOrder.totalQuantity})
                </span>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-white p-2 rounded-xl border border-stone-100">
                      <div className="relative h-11 w-11 rounded-lg overflow-hidden bg-stone-900 shrink-0">
                        <Image src={item.imageUrl} alt={item.title} fill sizes="44px" className="object-cover" />
                      </div>
                      <div className="min-w-0 flex-1 text-xs">
                        <h4 className="font-bold text-stone-900 truncate">{item.title}</h4>
                        <span className="text-stone-500 text-[11px]">
                          {item.variantTitle ? `${item.variantTitle} · ` : ""}Qty: {item.quantity} × {item.unitPrice} ৳
                        </span>
                      </div>
                      <span className="font-extrabold text-xs text-stone-900">{item.lineTotal.toFixed(2)} ৳</span>
                    </div>
                  ))}
                </div>

                {/* Subtotal & Totals */}
                <div className="mt-3 pt-2.5 border-t border-stone-200 text-xs space-y-1">
                  <div className="flex justify-between text-stone-600">
                    <span>Subtotal</span>
                    <span>{selectedOrder.subtotal.toFixed(2)} ৳</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Delivery Charge</span>
                    <span>{selectedOrder.shippingCharge.toFixed(2)} ৳</span>
                  </div>
                  <div className="flex justify-between font-extrabold text-sm text-stone-900 pt-1 border-t border-stone-200">
                    <span>Total Amount</span>
                    <span className="text-[#5423e7]">{selectedOrder.totalAmount.toFixed(2)} ৳</span>
                  </div>
                </div>
              </div>

              {/* Payment Details & Toggle */}
              <div className="rounded-2xl border border-stone-200 p-3.5 bg-stone-50/60 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-stone-500 block">Payment Method</span>
                  <span className="text-xs font-bold text-stone-900 uppercase">
                    {selectedOrder.paymentMethod === "bkash" ? "bKash Online" : "Cash on Delivery (COD)"}
                  </span>
                  {selectedOrder.payment?.transactionId && (
                    <span className="text-[11px] text-purple-700 block font-mono">
                      TrxID: {selectedOrder.payment.transactionId}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => handleTogglePaymentStatus(selectedOrder.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-xs ${
                    selectedOrder.paymentStatus === "paid"
                      ? "bg-emerald-600 text-white"
                      : "bg-rose-100 text-rose-800 border border-rose-200"
                  }`}
                >
                  {selectedOrder.paymentStatus === "paid" ? "✓ Paid" : "Mark as Paid"}
                </button>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-full py-3 rounded-2xl bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 transition"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== QUICK ACTIONS BOTTOM SHEET (Center FAB) ===================== */}
      {quickActionOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in"
          onClick={() => setQuickActionOpen(false)}
        >
          <div
            className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl animate-in slide-in-from-bottom-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="font-extrabold text-base text-stone-900">Store Quick Actions</h3>
              <button onClick={() => setQuickActionOpen(false)} className="p-1 text-stone-400 hover:text-stone-700">
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5 my-4">
              <button
                onClick={() => {
                  setQuickActionOpen(false);
                  setCreateOrderOpen(true);
                }}
                className="p-4 rounded-2xl border border-stone-200 bg-stone-50 hover:bg-purple-50 hover:border-purple-200 text-left transition group"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-[#5423e7] flex items-center justify-center mb-2 group-hover:scale-105 transition">
                  <Plus size={20} />
                </div>
                <h4 className="text-xs font-bold text-stone-900">New In-Shop Order</h4>
                <p className="text-[11px] text-stone-500 mt-0.5">Quick sale counter entry</p>
              </button>

              <Link
                href="/studio"
                target="_blank"
                onClick={() => setQuickActionOpen(false)}
                className="p-4 rounded-2xl border border-stone-200 bg-stone-50 hover:bg-purple-50 hover:border-purple-200 text-left transition group"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2 group-hover:scale-105 transition">
                  <Package size={20} />
                </div>
                <h4 className="text-xs font-bold text-stone-900">Sanity Studio</h4>
                <p className="text-[11px] text-stone-500 mt-0.5">Add, edit, delete products</p>
              </Link>

              <button
                onClick={() => {
                  setQuickActionOpen(false);
                  setActiveTab("products");
                }}
                className="p-4 rounded-2xl border border-stone-200 bg-stone-50 hover:bg-purple-50 hover:border-purple-200 text-left transition group"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-2 group-hover:scale-105 transition">
                  <Store size={20} />
                </div>
                <h4 className="text-xs font-bold text-stone-900">Product Stocks</h4>
                <p className="text-[11px] text-stone-500 mt-0.5">Check inventory counts</p>
              </button>

              <Link
                href="/"
                target="_blank"
                onClick={() => setQuickActionOpen(false)}
                className="p-4 rounded-2xl border border-stone-200 bg-stone-50 hover:bg-purple-50 hover:border-purple-200 text-left transition group"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-2 group-hover:scale-105 transition">
                  <ShoppingBag size={20} />
                </div>
                <h4 className="text-xs font-bold text-stone-900">Live Storefront</h4>
                <p className="text-[11px] text-stone-500 mt-0.5">Open public shop view</p>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ===================== CREATE IN-SHOP ORDER MODAL ===================== */}
      {createOrderOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in"
          onClick={() => setCreateOrderOpen(false)}
        >
          <div
            className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl animate-in slide-in-from-bottom-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="font-extrabold text-base text-stone-900">Create In-Shop Order</h3>
              <button onClick={() => setCreateOrderOpen(false)} className="p-1 text-stone-400 hover:text-stone-700">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateInShopOrder} className="space-y-3.5 mt-4">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Customer Name (Optional)</label>
                <input
                  type="text"
                  value={newCustomerName}
                  onChange={(e) => setNewCustomerName(e.target.value)}
                  placeholder="e.g. Rafiqul Islam / Walk-in"
                  className="w-full h-10 px-3 text-xs bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-[#5423e7]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Customer Phone (Optional)</label>
                <input
                  type="tel"
                  value={newCustomerPhone}
                  onChange={(e) => setNewCustomerPhone(e.target.value)}
                  placeholder="e.g. 018XXXXXXXX"
                  className="w-full h-10 px-3 text-xs bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-[#5423e7]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Select Product</label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full h-10 px-3 text-xs font-semibold bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-[#5423e7]"
                >
                  {products.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.title} — {(p.salePrice || p.regularPrice).toFixed(0)} ৳ ({p.stockQuantity} in stock)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Quantity</label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setNewOrderQty((q) => Math.max(1, q - 1))}
                    className="w-10 h-10 rounded-xl border border-stone-200 bg-stone-100 flex items-center justify-center font-bold text-stone-700"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="font-extrabold text-sm text-stone-900 w-10 text-center">{newOrderQty}</span>
                  <button
                    type="button"
                    onClick={() => setNewOrderQty((q) => q + 1)}
                    className="w-10 h-10 rounded-xl border border-stone-200 bg-stone-100 flex items-center justify-center font-bold text-stone-700"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-[#5423e7] text-white text-xs font-bold shadow-md hover:bg-[#4318cf] transition"
                >
                  Confirm & Save In-Shop Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================== SLIDE-OVER NAVIGATION DRAWER (Hamburger Menu) ===================== */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex animate-in fade-in"
          onClick={() => setDrawerOpen(false)}
        >
          <div
            className="w-4/5 max-w-xs h-full bg-white p-5 shadow-2xl flex flex-col justify-between animate-in slide-in-from-left duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-stone-200">
                <div className="flex items-center gap-2.5">
                  <div className="relative h-8 w-28 shrink-0">
                    <Image
                      src="/logo.png"
                      alt="Burmese House"
                      fill
                      priority
                      sizes="112px"
                      className="object-contain object-left"
                    />
                  </div>
                </div>
                <button onClick={() => setDrawerOpen(false)} className="p-1 text-stone-400 hover:text-stone-700">
                  <X size={20} />
                </button>
              </div>

              {/* Navigation Menu */}
              <nav className="mt-5 space-y-1">
                <button
                  onClick={() => {
                    setActiveTab("orders");
                    setDrawerOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                    activeTab === "orders" ? "bg-[#6f2742]/10 text-[#6f2742]" : "text-stone-700 hover:bg-stone-50"
                  }`}
                >
                  <ReceiptText size={18} />
                  <span>Orders Management</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab("products");
                    setDrawerOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                    activeTab === "products" ? "bg-[#6f2742]/10 text-[#6f2742]" : "text-stone-700 hover:bg-stone-50"
                  }`}
                >
                  <Store size={18} />
                  <span>Products & Inventory</span>
                </button>

                <Link
                  href="/studio"
                  target="_blank"
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold text-stone-700 hover:bg-stone-50 transition"
                >
                  <div className="flex items-center gap-3">
                    <Package size={18} className="text-[#6f2742]" />
                    <span>Sanity Studio CMS</span>
                  </div>
                  <ExternalLink size={14} className="text-stone-400" />
                </Link>

                <Link
                  href="/"
                  target="_blank"
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold text-stone-700 hover:bg-stone-50 transition"
                >
                  <div className="flex items-center gap-3">
                    <Globe size={18} className="text-blue-600" />
                    <span>View Live Storefront</span>
                  </div>
                  <ExternalLink size={14} className="text-stone-400" />
                </Link>

                <Link
                  href="/track-order"
                  target="_blank"
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold text-stone-700 hover:bg-stone-50 transition"
                >
                  <div className="flex items-center gap-3">
                    <Clock size={18} className="text-amber-600" />
                    <span>Track Order Portal</span>
                  </div>
                  <ExternalLink size={14} className="text-stone-400" />
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setDrawerOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition mt-4"
                >
                  <LogOut size={18} />
                  <span>Sign Out of Admin</span>
                </button>
              </nav>
            </div>

            {/* Drawer Footer */}
            <div className="pt-4 border-t border-stone-200 text-[11px] text-stone-500">
              <p className="font-semibold text-stone-800">Burmese House</p>
              <p className="mt-0.5">Admin Management Portal</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
