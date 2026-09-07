"use client";

import { ArrowLeft, Check, Save, User } from "lucide-react";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

interface ProfileData {
  name: string;
  phone: string;
  email: string;
  alternatePhone: string;
  smsNotifications: boolean;
  whatsappUpdates: boolean;
}

const STORAGE_KEY = "burmese-house-user-profile";

export function AccountProfile() {
  const [profile, setProfile] = useState<ProfileData>({
    name: "",
    phone: "",
    email: "",
    alternatePhone: "",
    smsNotifications: true,
    whatsappUpdates: true,
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const local = localStorage.getItem(STORAGE_KEY);
        if (local) {
          setProfile(JSON.parse(local));
        }
      } catch {
        // ignore parse error
      }

      const supabase = createSupabaseBrowserClient();
      if (supabase) {
        supabase.auth.getUser().then(({ data }) => {
          if (data.user?.email) {
            setProfile((prev) => ({
              ...prev,
              email: prev.email || data.user.email || "",
              name: prev.name || data.user.user_metadata?.name || "",
            }));
          }
        });
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
      setSaved(true);
      toast.success("Profile saved successfully");
      setTimeout(() => setSaved(false), 3000);
    } catch {
      toast.error("Failed to save profile");
    }
  };

  return (
    <div className="container-shell max-w-2xl py-10">
      <Link
        href="/account"
        className="inline-flex items-center gap-2 text-xs font-bold text-stone-500 hover:text-[#6f2742]"
      >
        <ArrowLeft size={14} /> Back to Account
      </Link>

      <div className="mt-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f3e8ec] text-[#6f2742]">
          <User size={20} />
        </div>
        <div>
          <h1 className="display-title text-3xl sm:text-4xl">Profile Details</h1>
          <p className="mt-1 text-sm text-stone-500">
            Keep your personal contact details up to date for faster checkout.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card mt-8 space-y-5 p-6 sm:p-8">
        <div>
          <label className="label" htmlFor="profile-name">
            Full Name
          </label>
          <input
            id="profile-name"
            type="text"
            className="field"
            placeholder="e.g. Tanvir Ahmed"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            required
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="profile-phone">
              Primary Mobile Number
            </label>
            <input
              id="profile-phone"
              type="tel"
              className="field"
              placeholder="01XXXXXXXXX"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              pattern="^01[3-9]\d{8}$"
              title="Must be an 11-digit Bangladeshi mobile number starting with 01"
            />
          </div>

          <div>
            <label className="label" htmlFor="profile-alt-phone">
              Alternative Contact (Optional)
            </label>
            <input
              id="profile-alt-phone"
              type="tel"
              className="field"
              placeholder="01XXXXXXXXX"
              value={profile.alternatePhone}
              onChange={(e) => setProfile({ ...profile, alternatePhone: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="label" htmlFor="profile-email">
            Email Address
          </label>
          <input
            id="profile-email"
            type="email"
            className="field"
            placeholder="yourname@gmail.com"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
          />
        </div>

        <div className="border-t border-stone-200 pt-5">
          <h3 className="text-sm font-bold text-stone-800">Order Updates & Alerts</h3>
          <div className="mt-3 space-y-3">
            <label className="flex items-center gap-3 text-sm text-stone-700 cursor-pointer">
              <input
                type="checkbox"
                checked={profile.smsNotifications}
                onChange={(e) =>
                  setProfile({ ...profile, smsNotifications: e.target.checked })
                }
                className="h-4 w-4 rounded border-stone-300 text-[#6f2742] focus:ring-[#6f2742]"
              />
              <span>Receive instant SMS when order is confirmed and dispatched</span>
            </label>

            <label className="flex items-center gap-3 text-sm text-stone-700 cursor-pointer">
              <input
                type="checkbox"
                checked={profile.whatsappUpdates}
                onChange={(e) =>
                  setProfile({ ...profile, whatsappUpdates: e.target.checked })
                }
                className="h-4 w-4 rounded border-stone-300 text-[#6f2742] focus:ring-[#6f2742]"
              />
              <span>Receive parcel tracking link via WhatsApp</span>
            </label>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="button-primary w-full sm:w-auto"
            id="save-profile-btn"
          >
            {saved ? (
              <>
                <Check size={16} /> Saved!
              </>
            ) : (
              <>
                <Save size={16} /> Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
