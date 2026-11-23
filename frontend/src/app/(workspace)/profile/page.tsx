"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ArrowLeft, User, Shield, Globe, Lock, Check, Smartphone, Monitor, Loader2 } from "lucide-react";
import { apiRequest } from "@/services/api";

export default function UserProfilePage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [language, setLanguage] = useState("en");
  const [calendar, setCalendar] = useState("gregorian");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function loadUser() {
      setLoading(true);
      const res = await apiRequest("/api/v1/auth/me");
      setLoading(false);
      if (res.success && res.data?.user) {
        const u = res.data.user;
        setFullName(u.full_name || "");
        setEmail(u.email || "");
        setPhone(u.phone_number || "");
        setBio(u.profile?.bio || "");
        setLanguage(u.preferred_language || "en");
      } else {
        // Fallback for demonstration
        setFullName("Dawit Bekele");
        setEmail("dawit.bekele@example.com");
        setPhone("+251 91 123 4567");
        setBio("Preserving the Bekele family living archive.");
      }
    }
    loadUser();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);

    const res = await apiRequest("/api/v1/auth/me", {
      method: "PATCH",
      body: JSON.stringify({
        full_name: fullName,
        phone_number: phone,
        bio: bio,
        preferred_language: language,
      }),
    });

    setSaving(false);
    if (res.success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } else {
      setErrorMsg(res.error?.message || "Failed to update profile.");
    }
  };


  return (
    <div className="min-h-screen bg-[#F6F1E9] flex flex-col">
      {/* Header */}
      <header className="h-20 bg-white border-b border-[#EAE3D6] px-6 sm:px-10 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <span className="font-serif font-bold text-2xl text-[#2B2B2B]">KinKeep</span>
        </Link>
        <Link
          href="/families"
          className="text-xs text-[#5A5A5A] hover:text-[#2B2B2B] flex items-center"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1" />
          Back to Family Spaces
        </Link>
      </header>

      {/* Main Container (Figma ui_part2 Page 6) */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-12 space-y-8">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-[#7A7A7A] font-semibold">
            ACCOUNT & PREFERENCES
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#2B2B2B] mt-1">
            Personal Profile & Preferences
          </h1>
          <p className="text-xs text-[#5A5A5A] font-light mt-1">
            Manage your personal profile, Ethiopian calendar preferences, and security settings.
          </p>
        </div>

        {saved && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center space-x-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Profile and preferences updated successfully.</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* 1. PROFILE DETAILS */}
          <div className="bg-white rounded-xl p-6 sm:p-8 border border-[#EAE3D6] shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-5">
            <h2 className="font-serif text-lg font-bold text-[#2B2B2B] pb-3 border-b border-[#F6F1E9]">
              Profile Information
            </h2>

            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-[#C18B58] text-white flex items-center justify-center font-serif font-bold text-2xl shadow-xs">
                S
              </div>
              <div>
                <button
                  type="button"
                  className="px-3 py-1.5 rounded-md border border-[#D5C9B8] text-xs font-semibold text-[#2B2B2B] hover:bg-[#F6F1E9]"
                >
                  Change Photo
                </button>
                <p className="text-[11px] text-[#7A7A7A] mt-1">
                  JPG or PNG, max 5MB.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#2B2B2B] mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-md border border-[#D5C9B8] text-xs text-[#2B2B2B] bg-white focus:outline-none focus:ring-1 focus:ring-[#C18B58]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#2B2B2B] mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  disabled
                  value={email}
                  className="w-full px-3.5 py-2 rounded-md border border-[#EAE3D6] text-xs text-[#7A7A7A] bg-[#F6F1E9]/50 cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#2B2B2B] mb-1">
                Biographical Note
              </label>
              <textarea
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3.5 py-2 rounded-md border border-[#D5C9B8] text-xs text-[#2B2B2B] bg-white focus:outline-none focus:ring-1 focus:ring-[#C18B58] resize-none"
              />
            </div>
          </div>

          {/* 2. LOCALIZATION & CALENDAR */}
          <div className="bg-white rounded-xl p-6 sm:p-8 border border-[#EAE3D6] shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-5">
            <h2 className="font-serif text-lg font-bold text-[#2B2B2B] pb-3 border-b border-[#F6F1E9]">
              Language & Cultural Calendar
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#2B2B2B] mb-1">
                  Preferred Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-md border border-[#D5C9B8] text-xs text-[#2B2B2B] bg-white focus:outline-none focus:ring-1 focus:ring-[#C18B58]"
                >
                  <option value="en">English (Default)</option>
                  <option value="am">አማርኛ (Amharic)</option>
                  <option value="om">Afaan Oromoo</option>
                  <option value="ti">ትግርኛ (Tigrinya)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#2B2B2B] mb-1">
                  Calendar Preference
                </label>
                <select
                  value={calendar}
                  onChange={(e) => setCalendar(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-md border border-[#D5C9B8] text-xs text-[#2B2B2B] bg-white focus:outline-none focus:ring-1 focus:ring-[#C18B58]"
                >
                  <option value="gregorian">Gregorian Calendar (e.g. Nov 2026)</option>
                  <option value="ethiopian">Ethiopian Calendar (ዘመነ ዮሐንስ / ህዳር)</option>
                  <option value="dual">Dual Display (Both side-by-side)</option>
                </select>
              </div>
            </div>
          </div>

          {/* 3. ACTIVE SESSIONS & SECURITY */}
          <div className="bg-white rounded-xl p-6 sm:p-8 border border-[#EAE3D6] shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-4">
            <h2 className="font-serif text-lg font-bold text-[#2B2B2B] pb-3 border-b border-[#F6F1E9]">
              Active Sessions & Security
            </h2>

            <div className="space-y-3">
              <div className="p-3.5 rounded-lg border border-[#EAE3D6] bg-[#F6F1E9]/40 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Monitor className="w-5 h-5 text-[#C18B58]" />
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-[#2B2B2B]">Windows Chrome</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-medium">
                        Current Session
                      </span>
                    </div>
                    <span className="text-[11px] text-[#7A7A7A]">Addis Ababa, Ethiopia · IP: 196.188.xx.xx</span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-lg border border-[#EAE3D6] flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Smartphone className="w-5 h-5 text-[#7A7A7A]" />
                  <div>
                    <span className="text-xs font-bold text-[#2B2B2B]">Safari on iPhone 15</span>
                    <p className="text-[11px] text-[#7A7A7A]">Last active 2 days ago</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => alert("Session revoked")}
                  className="text-xs text-red-600 hover:underline"
                >
                  Revoke
                </button>
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="flex items-center justify-between pt-2">
            {errorMsg ? (
              <span className="text-xs font-semibold text-red-600">{errorMsg}</span>
            ) : <div />}

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-md bg-[#C18B58] hover:bg-[#b07d4b] text-white text-xs font-semibold shadow-sm transition-colors disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Profile Changes</span>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
