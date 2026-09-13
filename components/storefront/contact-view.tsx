"use client";

import { Clock, Mail, MapPin, MessageCircle, Phone, Send, Sparkles } from "lucide-react";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { formatEmailLink, formatMapLink, formatPhoneForTel, formatWhatsAppLink } from "@/lib/contact";
import type { StoreSettings } from "@/lib/types";

export function ContactView({ settings }: { settings: StoreSettings }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const phoneUrl = formatPhoneForTel(settings.phone);
  const whatsappUrl = formatWhatsAppLink(
    settings.whatsapp,
    `Hi ${settings.storeName}, I would like to make an inquiry.`
  );
  const emailUrl = formatEmailLink(settings.email);
  const mapUrl = formatMapLink(settings.address, settings.googleMapsUrl);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      toast.error("Please fill in your name and message.");
      return;
    }

    // Direct WhatsApp message formatting if user wants fast response
    if (settings.whatsapp) {
      const waMsg = `*New Website Inquiry*\n\n*Name:* ${name}\n*Phone:* ${phone || "N/A"}\n*Subject:* ${subject || "General Inquiry"}\n*Message:* ${message}`;
      const waUrl = formatWhatsAppLink(settings.whatsapp, waMsg);
      window.open(waUrl, "_blank");
    }

    setSubmitted(true);
    toast.success("Thank you! Your message has been sent.");
  };

  return (
    <div className="container-shell py-10 sm:py-16">
      {/* Top Banner */}
      <div className="mx-auto max-w-3xl text-center">
        <span className="eyebrow inline-flex items-center gap-1.5 rounded-full bg-[#f3e8ec] px-3.5 py-1 text-xs font-bold text-[#6f2742]">
          <Sparkles size={13} /> We’d love to hear from you
        </span>
        <h1 className="display-title mt-4 text-4xl sm:text-5xl">
          Get in touch with {settings.storeName}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-stone-600 sm:text-base">
          আমাদের পণ্য, ডেলিভারি, স্পেশাল অর্ডার বা যেকোনো প্রশ্নের জন্য সরাসরি যোগাযোগ করুন।
        </p>
      </div>

      {/* Primary Contact Cards */}
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Phone / Mobile */}
        <div className="card flex flex-col justify-between p-6 transition duration-200 hover:-translate-y-1 hover:shadow-lg">
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f3e8ec] text-[#6f2742]">
              <Phone size={22} />
            </div>
            <h2 className="mt-4 font-bold text-stone-900">Phone Helpline</h2>
            <p className="mt-1 text-xs text-stone-500">সরাসরি কথা বলুন আমাদের সাথে</p>
            <p className="mt-3 text-base font-extrabold text-stone-900">{settings.phone}</p>
          </div>
          {settings.phone && (
            <a
              href={phoneUrl}
              className="button-primary mt-5 flex h-10 w-full items-center justify-center gap-2 text-xs"
            >
              <Phone size={14} /> Call Now
            </a>
          )}
        </div>

        {/* WhatsApp */}
        <div className="card flex flex-col justify-between border-emerald-200/80 bg-gradient-to-b from-white to-emerald-50/30 p-6 transition duration-200 hover:-translate-y-1 hover:shadow-lg">
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
              <MessageCircle size={22} />
            </div>
            <h2 className="mt-4 font-bold text-stone-900">WhatsApp Support</h2>
            <p className="mt-1 text-xs text-stone-500">সবচেয়ে দ্রুত উত্তরের জন্য মেসেজ দিন</p>
            <p className="mt-3 text-base font-extrabold text-emerald-800">{settings.whatsapp}</p>
          </div>
          {settings.whatsapp && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#25d366] text-xs font-bold text-white shadow-sm transition hover:bg-[#20bd5a]"
            >
              <MessageCircle size={14} /> WhatsApp Chat
            </a>
          )}
        </div>

        {/* Email */}
        <div className="card flex flex-col justify-between p-6 transition duration-200 hover:-translate-y-1 hover:shadow-lg">
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f3e8ec] text-[#6f2742]">
              <Mail size={22} />
            </div>
            <h2 className="mt-4 font-bold text-stone-900">Email Inquiry</h2>
            <p className="mt-1 text-xs text-stone-500">অর্ডার বা ফিডব্যাক ইমেইল করুন</p>
            <p className="mt-3 text-sm font-bold text-stone-900 break-all">{settings.email}</p>
          </div>
          {settings.email && (
            <a
              href={emailUrl}
              className="button-outline mt-5 flex h-10 w-full items-center justify-center gap-2 text-xs"
            >
              <Mail size={14} /> Send Email
            </a>
          )}
        </div>

        {/* Location & Hours */}
        <div className="card flex flex-col justify-between p-6 transition duration-200 hover:-translate-y-1 hover:shadow-lg">
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-100 text-stone-800">
              <MapPin size={22} />
            </div>
            <h2 className="mt-4 font-bold text-stone-900">Location & Hours</h2>
            <p className="mt-1 text-xs text-stone-500 leading-relaxed">{settings.address}</p>
            {settings.businessHours && (
              <p className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-stone-700">
                <Clock size={13} className="text-[#6f2742]" /> {settings.businessHours}
              </p>
            )}
          </div>
          {settings.address && (
            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="button-outline mt-5 flex h-10 w-full items-center justify-center gap-2 text-xs"
            >
              <MapPin size={14} /> Open in Maps
            </a>
          )}
        </div>
      </div>

      {/* Form & Map Section */}
      <div className="mt-14 grid gap-10 lg:grid-cols-2">
        {/* Contact Form */}
        <div className="card p-6 sm:p-8">
          <h2 className="display-title text-2xl sm:text-3xl">Send us a message</h2>
          <p className="mt-2 text-xs leading-5 text-stone-500">
            যেকোনো প্রশ্ন, স্পেশাল রিকুয়েস্ট বা ফিডব্যাকের জন্য নিচের ফর্মটি পূরণ করুন।
          </p>

          {submitted ? (
            <div className="mt-6 rounded-2xl bg-emerald-50 p-6 text-center text-emerald-800">
              <p className="font-bold">Thank you for your message!</p>
              <p className="mt-1 text-xs text-emerald-700">
                We will get back to you shortly on your phone/email.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setMessage("");
                  setSubject("");
                }}
                className="button-outline mt-4 border-emerald-300 text-xs"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="label">Your Name *</span>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="আপনার নাম"
                    className="field"
                  />
                </label>
                <label className="block">
                  <span className="label">Mobile Number</span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="field"
                  />
                </label>
              </div>

              <label className="block">
                <span className="label">Subject</span>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Order Inquiry / Wholesale / Feedback"
                  className="field"
                />
              </label>

              <label className="block">
                <span className="label">Message *</span>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="আপনার মেসেজ বিস্তারিত লিখুন..."
                  className="field resize-none"
                />
              </label>

              <button type="submit" className="button-primary mt-2 flex w-full items-center justify-center gap-2">
                <Send size={15} /> Send Message
              </button>
            </form>
          )}
        </div>

        {/* Location Information & FAQ Box */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="card bg-[#fbf9f8] p-6 sm:p-8">
            <h2 className="display-title text-2xl">Visit & Pick-up</h2>
            <div className="mt-4 space-y-3 text-sm text-stone-600">
              <p className="flex items-start gap-3">
                <MapPin size={18} className="mt-0.5 shrink-0 text-[#6f2742]" />
                <span>
                  <strong>Address:</strong> {settings.address}
                </span>
              </p>
              <p className="flex items-center gap-3">
                <Clock size={18} className="shrink-0 text-[#6f2742]" />
                <span>
                  <strong>Support Hours:</strong> {settings.businessHours || "Everyday 9:00 AM - 10:00 PM"}
                </span>
              </p>
              <p className="flex items-center gap-3">
                <Phone size={18} className="shrink-0 text-[#6f2742]" />
                <span>
                  <strong>Customer Helpline:</strong> {settings.phone}
                </span>
              </p>
            </div>
            <div className="mt-6 border-t border-stone-200 pt-5">
              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="button-outline flex w-full items-center justify-center gap-2 text-xs font-bold"
              >
                <MapPin size={15} /> Open Location in Google Maps
              </a>
            </div>
          </div>

          {/* Nationwide Delivery Notice */}
          <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
            <h3 className="font-bold text-stone-900">ডেলিভারি তথ্য</h3>
            <p className="mt-2 text-xs leading-relaxed text-stone-600">
              আমরা সারাদেশে হোম ডেলিভারি দিয়ে থাকি। ঢাকা সিটির ভেতরে সাধারণত ১–২ দিন এবং ঢাকার বাইরে ৩–৫ দিনের মধ্যে পার্সেল পৌঁছে যায়। ক্যাশ অন ডেলিভারি এবং বিকাশ পেমেন্ট দুটিই উপলব্ধ।
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
