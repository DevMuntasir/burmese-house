"use client";

import { ArrowLeft, Check, Home, MapPin, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";

export interface SavedAddress {
  id: string;
  label: "Home" | "Office" | "Other";
  customerName: string;
  phone: string;
  district: string;
  area: string;
  address: string;
  deliveryZone: string;
  isDefault: boolean;
}

const STORAGE_KEY = "burmese-house-saved-addresses";

export function AccountAddresses() {
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddress, setNewAddress] = useState<Omit<SavedAddress, "id">>({
    label: "Home",
    customerName: "",
    phone: "",
    district: "Dhaka",
    area: "",
    address: "",
    deliveryZone: "Inside Dhaka",
    isDefault: false,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          setAddresses(JSON.parse(stored));
        }
      } catch {
        // ignore parse error
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const saveList = (list: SavedAddress[]) => {
    setAddresses(list);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    const def = list.find((a) => a.isDefault);
    if (def) {
      localStorage.setItem("burmese-house-default-address", JSON.stringify(def));
    }
  };

  const handleAdd = (e: FormEvent) => {
    e.preventDefault();
    if (!newAddress.customerName || !newAddress.phone || !newAddress.address) {
      toast.error("Please fill in all required fields");
      return;
    }

    const created: SavedAddress = {
      ...newAddress,
      id: crypto.randomUUID(),
      isDefault: addresses.length === 0 || newAddress.isDefault,
    };

    let updated = [created, ...addresses];
    if (created.isDefault) {
      updated = updated.map((a) => (a.id === created.id ? a : { ...a, isDefault: false }));
    }

    saveList(updated);
    toast.success("Delivery address saved");
    setShowAddForm(false);
    setNewAddress({
      label: "Home",
      customerName: "",
      phone: "",
      district: "Dhaka",
      area: "",
      address: "",
      deliveryZone: "Inside Dhaka",
      isDefault: false,
    });
  };

  const handleDelete = (id: string) => {
    const updated = addresses.filter((a) => a.id !== id);
    if (updated.length > 0 && !updated.some((a) => a.isDefault)) {
      updated[0].isDefault = true;
    }
    saveList(updated);
    toast.success("Address removed");
  };

  const handleSetDefault = (id: string) => {
    const updated = addresses.map((a) => ({
      ...a,
      isDefault: a.id === id,
    }));
    saveList(updated);
    toast.success("Default address updated");
  };

  return (
    <div className="container-shell max-w-3xl py-10">
      <Link
        href="/account"
        className="inline-flex items-center gap-2 text-xs font-bold text-stone-500 hover:text-[#6f2742]"
      >
        <ArrowLeft size={14} /> Back to Account
      </Link>

      <div className="mt-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f3e8ec] text-[#6f2742]">
            <MapPin size={20} />
          </div>
          <div>
            <h1 className="display-title text-3xl sm:text-4xl">Saved Addresses</h1>
            <p className="mt-1 text-sm text-stone-500">
              Manage your delivery addresses for quick and effortless checkout.
            </p>
          </div>
        </div>

        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="button-primary shrink-0 text-sm"
          >
            <Plus size={16} /> Add New Address
          </button>
        )}
      </div>

      {showAddForm && (
        <form onSubmit={handleAdd} className="card mt-8 space-y-4 p-6 sm:p-8">
          <h2 className="display-title text-2xl">New Delivery Address</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="addr-label">
                Address Type
              </label>
              <select
                id="addr-label"
                className="field"
                value={newAddress.label}
                onChange={(e) =>
                  setNewAddress({
                    ...newAddress,
                    label: e.target.value as "Home" | "Office" | "Other",
                  })
                }
              >
                <option value="Home">Home</option>
                <option value="Office">Office</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="label" htmlFor="addr-zone">
                Delivery Zone / Area
              </label>
              <input
                id="addr-zone"
                type="text"
                className="field"
                placeholder="e.g. Inside Dhaka, Inside Feni, Outside Dhaka"
                value={newAddress.deliveryZone}
                onChange={(e) =>
                  setNewAddress({
                    ...newAddress,
                    deliveryZone: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label className="label" htmlFor="addr-name">
                Recipient Name
              </label>
              <input
                id="addr-name"
                type="text"
                className="field"
                placeholder="Full Name"
                value={newAddress.customerName}
                onChange={(e) => setNewAddress({ ...newAddress, customerName: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="label" htmlFor="addr-phone">
                Contact Phone
              </label>
              <input
                id="addr-phone"
                type="tel"
                className="field"
                placeholder="01XXXXXXXXX"
                value={newAddress.phone}
                onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="label" htmlFor="addr-district">
                District
              </label>
              <input
                id="addr-district"
                type="text"
                className="field"
                placeholder="e.g. Dhaka, Chittagong, Sylhet"
                value={newAddress.district}
                onChange={(e) => setNewAddress({ ...newAddress, district: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="label" htmlFor="addr-area">
                Area / Thana / Police Station
              </label>
              <input
                id="addr-area"
                type="text"
                className="field"
                placeholder="e.g. Dhanmondi, Uttara"
                value={newAddress.area}
                onChange={(e) => setNewAddress({ ...newAddress, area: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <label className="label" htmlFor="addr-street">
              Full Street Address
            </label>
            <textarea
              id="addr-street"
              rows={3}
              className="field"
              placeholder="House, Road, Block, Sector, or landmarks"
              value={newAddress.address}
              onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
              required
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-stone-700 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={newAddress.isDefault}
              onChange={(e) => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
              className="h-4 w-4 rounded border-stone-300 text-[#6f2742]"
            />
            <span>Set as default delivery address</span>
          </label>

          <div className="flex gap-3 pt-2">
            <button type="submit" className="button-primary">
              Save Address
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="button-outline"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="mt-8 space-y-4">
        {addresses.length === 0 ? (
          <div className="card py-12 text-center text-stone-500">
            <Home className="mx-auto mb-3 text-stone-300" size={36} />
            <p className="font-bold text-stone-700">No saved addresses yet</p>
            <p className="mt-1 text-xs text-stone-500">
              Add your primary delivery address to save time when ordering.
            </p>
            {!showAddForm && (
              <button
                onClick={() => setShowAddForm(true)}
                className="button-primary mt-5 text-xs"
              >
                Add Address Now
              </button>
            )}
          </div>
        ) : (
          addresses.map((addr) => (
            <div
              key={addr.id}
              className={`card flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center ${
                addr.isDefault ? "border-[#6f2742] bg-[#fdf9fa]" : ""
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-stone-100 px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-stone-600">
                    {addr.label}
                  </span>
                  {addr.isDefault && (
                    <span className="inline-flex items-center gap-1 rounded bg-[#f3e8ec] px-2 py-0.5 text-xs font-bold text-[#6f2742]">
                      <Check size={12} /> Default
                    </span>
                  )}
                  <span className="text-xs text-stone-400">
                    ({addr.deliveryZone === "inside-dhaka" ? "Inside Dhaka" : addr.deliveryZone === "outside-dhaka" ? "Outside Dhaka" : addr.deliveryZone || "Standard"})
                  </span>
                </div>
                <h3 className="font-bold text-stone-900">{addr.customerName}</h3>
                <p className="text-sm text-stone-600">
                  {addr.address}, {addr.area}, {addr.district}
                </p>
                <p className="text-xs font-medium text-stone-500">Phone: {addr.phone}</p>
              </div>

              <div className="flex items-center gap-3 shrink-0 pt-2 sm:pt-0">
                {!addr.isDefault && (
                  <button
                    onClick={() => handleSetDefault(addr.id)}
                    className="text-xs font-bold text-stone-600 hover:text-[#6f2742]"
                  >
                    Make Default
                  </button>
                )}
                <button
                  onClick={() => handleDelete(addr.id)}
                  className="flex items-center gap-1 text-xs font-semibold text-stone-400 hover:text-red-600"
                  aria-label="Delete address"
                >
                  <Trash2 size={14} /> Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
