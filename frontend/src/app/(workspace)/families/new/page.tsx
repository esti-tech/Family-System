"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, AlertCircle, ShieldCheck, MapPin, Users } from "lucide-react";
import { apiRequest } from "@/services/api";

export default function CreateFamilyPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [originCity, setOriginCity] = useState("");
  const [originCountry, setOriginCountry] = useState("Ethiopia");
  const [privacy, setPrivacy] = useState("MEMBERS_ONLY");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    setErrorMsg(null);

    const res = await apiRequest("/api/v1/families/", {
      method: "POST",
      body: JSON.stringify({
        name,
        description,
        origin_city: originCity,
        origin_country: originCountry,
      }),
    });

    setLoading(false);

    if (!res.success) {
      setErrorMsg(res.error?.message || "Failed to create family space.");
      return;
    }

    const slug = res.data?.slug || "my-family";
    router.push(`/${slug}/dashboard`);
  };

  return (
    <div className="min-h-screen bg-ivory-100 flex flex-col">
      <header className="h-20 bg-white border-b border-border px-6 flex items-center">
        <Link
          href="/families"
          className="inline-flex items-center text-xs font-semibold text-charcoal-700 hover:text-charcoal-900"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back to Family Spaces
        </Link>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <span className="text-[11px] uppercase font-bold tracking-widest text-gold-600">
            Onboarding
          </span>
          <h1 className="font-serif text-3xl font-bold text-charcoal-900 mt-1">
            Create Your Family Space
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-700 mt-1">
            Establish your digital heirloom. You will automatically become the <span className="font-semibold text-charcoal-900">Family Owner</span> with full governance rights.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form */}
          <div className="lg:col-span-7 bg-white p-8 rounded-2xl border border-border shadow-card">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1">
                  Family Workspace Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. The Bekele Family Archive"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-gold-500 bg-ivory-50/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1">
                  Family Motto or Short Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell relatives about your family lineage, traditions, or values..."
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-gold-500 bg-ivory-50/50"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1">
                    Ancestral City / Region
                  </label>
                  <input
                    type="text"
                    value={originCity}
                    onChange={(e) => setOriginCity(e.target.value)}
                    placeholder="e.g. Gondar, Harar"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-gold-500 bg-ivory-50/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1">
                    Ancestral Country
                  </label>
                  <input
                    type="text"
                    value={originCountry}
                    onChange={(e) => setOriginCountry(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-gold-500 bg-ivory-50/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1">
                  Privacy Setting
                </label>
                <select
                  value={privacy}
                  onChange={(e) => setPrivacy(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-gold-500 bg-ivory-50/50"
                >
                  <option value="MEMBERS_ONLY">Members Only (Strictly Private to Invited Relatives)</option>
                  <option value="RESTRICTED">Restricted (Public guests can only upload via QR)</option>
                </select>
              </div>

              <div className="pt-4 flex items-center justify-end space-x-3">
                <Link
                  href="/families"
                  className="px-5 py-2.5 rounded-lg border border-border text-xs font-semibold text-charcoal-700 hover:bg-ivory-50"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-lg bg-gold-500 hover:bg-gold-600 text-white text-xs font-semibold shadow-xs flex items-center space-x-2 disabled:opacity-70"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Create Family Space</span>
                </button>
              </div>
            </form>
          </div>

          {/* Real-time Preview Card */}
          <div className="lg:col-span-5 space-y-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-charcoal-700">
              Live Preview
            </div>
            <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-card">
              <div className="h-32 bg-gradient-to-r from-charcoal-900 to-charcoal-800 p-4 flex flex-col justify-between text-white relative">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-gold-500 w-fit">
                  Owner Preview
                </span>
                <div className="flex items-center space-x-1.5 text-xs text-ivory-200">
                  <MapPin className="w-3.5 h-3.5 text-gold-400" />
                  <span>{originCity ? `${originCity}, ` : ""}{originCountry}</span>
                </div>
              </div>
              <div className="p-5 space-y-2">
                <h4 className="font-serif font-bold text-lg text-charcoal-900 truncate">
                  {name || "Your Family Name Here"}
                </h4>
                <p className="text-xs text-charcoal-700 line-clamp-2">
                  {description || "A living digital vault of family photographs, oral histories, and generational lineage."}
                </p>
                <div className="pt-3 border-t border-border flex items-center justify-between text-[11px] text-charcoal-700">
                  <div className="flex items-center space-x-1">
                    <Users className="w-3.5 h-3.5 text-gold-600" />
                    <span>1 Member (You)</span>
                  </div>
                  <span className="text-gold-600 font-semibold">Ready to Launch</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-ivory-50 rounded-xl border border-border flex items-start space-x-2 text-xs text-charcoal-700">
              <ShieldCheck className="w-4 h-4 text-gold-600 shrink-0 mt-0.5" />
              <span>
                As Family Owner, you maintain exclusive control over subscription tiers, member roles, and data export.
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
