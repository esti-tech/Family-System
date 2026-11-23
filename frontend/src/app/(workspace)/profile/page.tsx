"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, User as UserIcon, Save, Check, ShieldCheck } from "lucide-react";

export default function UserProfilePage() {
  const [fullName, setFullName] = useState("Dawit Haile");
  const [email] = useState("dawit.haile@example.com");
  const [phone, setPhone] = useState("+251 91 123 4567");
  const [language, setLanguage] = useState("en");
  const [bio, setBio] = useState("Preserving our family history and oral recordings for the next generation.");
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-ivory-100 flex flex-col">
      <header className="h-20 bg-white border-b border-border px-6 flex items-center">
        <Link
          href="/families"
          className="inline-flex items-center text-xs font-semibold text-charcoal-700 hover:text-charcoal-900"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back to Workspaces
        </Link>
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-12 space-y-6">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-900">
            Personal Account Profile
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-700 mt-1">
            Manage your credentials and login profile. (Note: Your account is separate from person records in the family tree).
          </p>
        </div>

        {saved && (
          <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-xs flex items-center space-x-2">
            <Check className="w-4 h-4" />
            <span>Profile updated successfully!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="bg-white p-8 rounded-2xl border border-border shadow-card space-y-6">
          {/* Avatar Section */}
          <div className="flex items-center space-x-4 pb-6 border-b border-border">
            <div className="w-16 h-16 rounded-full bg-gold-100 text-gold-700 border-2 border-gold-300 flex items-center justify-center font-bold text-xl uppercase">
              {fullName.slice(0, 2)}
            </div>
            <div>
              <h3 className="text-sm font-bold text-charcoal-900">{fullName}</h3>
              <p className="text-xs text-charcoal-500">{email}</p>
              <button type="button" className="text-xs text-gold-600 font-semibold hover:underline mt-1">
                Change Profile Photo
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-gold-500 bg-ivory-50/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-gold-500 bg-ivory-50/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1">
                Email Address (Account Identifier)
              </label>
              <input
                type="email"
                disabled
                value={email}
                className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm text-charcoal-400 bg-gray-50 cursor-not-allowed"
              />
              <span className="text-[10px] text-charcoal-700 mt-1 block">Contact support to change account email.</span>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1">
                Preferred Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-gold-500 bg-ivory-50/50"
              >
                <option value="en">English</option>
                <option value="am">Amharic (አማርኛ)</option>
                <option value="om">Oromo (Afaan Oromoo)</option>
                <option value="ti">Tigrinya (ትግርኛ)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1">
                Bio / About Me
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-gold-500 bg-ivory-50/50"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-border flex items-center justify-between">
            <div className="flex items-center space-x-1.5 text-xs text-charcoal-700">
              <ShieldCheck className="w-4 h-4 text-gold-600" />
              <span>Two-factor authentication ready</span>
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-lg bg-gold-500 hover:bg-gold-600 text-white text-xs font-semibold shadow-xs flex items-center space-x-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Save Profile</span>
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
