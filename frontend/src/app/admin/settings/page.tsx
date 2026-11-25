"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Settings,
  ShieldCheck,
  CheckCircle2,
  HardDrive,
  CreditCard,
  Lock,
  Sparkles,
  Save
} from "lucide-react";
import { apiRequest } from "@/services/api";

export default function AdminSettingsPage() {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [allowRegistrations, setAllowRegistrations] = useState(true);
  const [defaultStorageQuota, setDefaultStorageQuota] = useState(5);
  const [sessionTimeoutHours, setSessionTimeoutHours] = useState(24);
  const [savedFeedback, setSavedFeedback] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await apiRequest("/platform-admin/settings/");
        if (res?.data && Array.isArray(res.data)) {
          const general = res.data.find((s: any) => s.key === "general_operations");
          if (general?.value) {
            if (general.value.maintenance_mode !== undefined) {
              setMaintenanceMode(general.value.maintenance_mode);
            }
            if (general.value.allow_registrations !== undefined) {
              setAllowRegistrations(general.value.allow_registrations);
            }
            if (general.value.default_storage_quota_gb !== undefined) {
              setDefaultStorageQuota(general.value.default_storage_quota_gb);
            }
            if (general.value.session_timeout_hours !== undefined) {
              setSessionTimeoutHours(general.value.session_timeout_hours);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load platform settings:", err);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await apiRequest("/platform-admin/settings/", {
        method: "POST",
        body: JSON.stringify({
          key: "general_operations",
          value: {
            maintenance_mode: maintenanceMode,
            allow_registrations: allowRegistrations,
            default_storage_quota_gb: defaultStorageQuota,
            session_timeout_hours: sessionTimeoutHours,
          },
          description: "System-wide general operational thresholds and flags",
        }),
      });
      setSavedFeedback(true);
      setTimeout(() => setSavedFeedback(false), 3000);
    } catch (err) {
      console.error("Failed to save settings:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 md:p-10">
      <div>
        <h1 className="font-serif text-2xl font-bold tracking-tight text-[#2B2B2B] md:text-3xl">
          Platform Settings & Configurations
        </h1>
        <p className="mt-1 text-xs text-[#736B5E]">
          Configure system-wide operational parameters, regional payment gateways, and security thresholds.
        </p>
      </div>

      <div className="mt-8 max-w-3xl space-y-8">
        <form onSubmit={handleSave} className="space-y-6">
          {/* General Policies */}
          <div className="rounded-3xl border border-[#EAE3D6] bg-white p-6 shadow-sm md:p-8">
            <h3 className="font-serif text-lg font-bold text-[#2B2B2B]">
              General Platform Operations
            </h3>

            <div className="mt-5 space-y-4">
              <div className="flex items-center justify-between rounded-2xl border border-[#EAE3D6] bg-[#FAF8F5] p-4">
                <div>
                  <h4 className="text-xs font-bold text-[#2B2B2B]">
                    Allow New Workspace Registrations
                  </h4>
                  <p className="text-[11px] text-[#736B5E]">
                    Permit public users to register accounts and create new family archives.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={allowRegistrations}
                  onChange={(e) => setAllowRegistrations(e.target.checked)}
                  className="h-4 w-4 rounded text-[#C18B58] focus:ring-[#C18B58]"
                />
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-[#EAE3D6] bg-[#FAF8F5] p-4">
                <div>
                  <h4 className="text-xs font-bold text-[#2B2B2B]">
                    Platform Maintenance Mode
                  </h4>
                  <p className="text-[11px] text-[#736B5E]">
                    Display scheduled maintenance notice to non-admin users during database migrations.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={maintenanceMode}
                  onChange={(e) => setMaintenanceMode(e.target.checked)}
                  className="h-4 w-4 rounded text-[#C18B58] focus:ring-[#C18B58]"
                />
              </div>
            </div>
          </div>

          {/* Quotas & Security */}
          <div className="rounded-3xl border border-[#EAE3D6] bg-white p-6 shadow-sm md:p-8">
            <h3 className="font-serif text-lg font-bold text-[#2B2B2B]">
              Quotas & Session Thresholds
            </h3>

            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-[#2B2B2B]">
                  Default Free Tier Storage (GB)
                </label>
                <input
                  type="number"
                  value={defaultStorageQuota}
                  onChange={(e) => setDefaultStorageQuota(Number(e.target.value))}
                  className="mt-1.5 w-full rounded-xl border border-[#EAE3D6] bg-[#FAF8F5] px-3 py-2 text-xs text-[#2B2B2B] focus:border-[#C18B58] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2B2B2B]">
                  Admin Session Timeout (Hours)
                </label>
                <input
                  type="number"
                  value={sessionTimeoutHours}
                  onChange={(e) => setSessionTimeoutHours(Number(e.target.value))}
                  className="mt-1.5 w-full rounded-xl border border-[#EAE3D6] bg-[#FAF8F5] px-3 py-2 text-xs text-[#2B2B2B] focus:border-[#C18B58] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex items-center justify-between">
            {savedFeedback ? (
              <span className="text-xs font-semibold text-[#4A7C59]">
                ✓ Platform configurations saved successfully!
              </span>
            ) : (
              <div />
            )}

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-[#C18B58] px-6 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#A97544] disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              <span>{saving ? "Saving..." : "Save System Settings"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
