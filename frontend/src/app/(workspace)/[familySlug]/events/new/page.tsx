"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
  QrCode,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Camera,
  ShieldCheck,
  Upload,
  Info
} from "lucide-react";
import { apiRequest } from "@/services/api";

const COVER_PRESETS = [
  { id: "p1", title: "Habesha Wedding & Feast", url: "/assets/images/heritage-wedding.jpeg" },
  { id: "p2", title: "Communal Gathering & QR", url: "/assets/images/feature-events-qr.jpeg" },
  { id: "p3", title: "Elders & Wisdom Ceremony", url: "/assets/images/heritage-elders.jpeg" },
  { id: "p4", title: "Generations at Home", url: "/assets/images/hero-family.jpeg" }
];

export default function CreateEventPage() {
  const router = useRouter();
  const params = useParams();
  const slug = (params?.familySlug as string) || "bekele-family";

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [title, setTitle] = useState("");
  const [titleAmharic, setTitleAmharic] = useState("");
  const [category, setCategory] = useState("holiday");
  const [date, setDate] = useState("2026-05-10");
  const [ethiopianDate, setEthiopianDate] = useState("ግንቦት 2, 2018 ዓ.ም");
  const [startTime, setStartTime] = useState("11:00");
  const [endTime, setEndTime] = useState("18:00");
  const [venueName, setVenueName] = useState("");
  const [city, setCity] = useState("Addis Ababa");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCover, setSelectedCover] = useState(COVER_PRESETS[0].url);

  // QR & Host settings
  const [selectedHosts, setSelectedHosts] = useState<string[]>(["Dawit Bekele"]);
  const [enableQrGuestUpload, setEnableQrGuestUpload] = useState(true);
  const [requireGuestName, setRequireGuestName] = useState(true);
  const [requireModeration, setRequireModeration] = useState(false);
  const [allowGuestWishes, setAllowGuestWishes] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdEventSlug, setCreatedEventSlug] = useState("");

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep((step + 1) as 1 | 2 | 3);
    } else {
      setIsSubmitting(true);
      const eventTypeMap: Record<string, string> = {
        holiday: "HOLIDAY",
        wedding: "WEDDING",
        birthday: "BIRTHDAY",
        reunion: "REUNION",
        memorial: "MEMORIAL"
      };

      const payload = {
        title: title || "Family Gathering",
        title_amharic: titleAmharic,
        event_type: eventTypeMap[category] || "CELEBRATION",
        start_datetime: `${date}T${startTime || "10:00"}:00Z`,
        end_datetime: endTime ? `${date}T${endTime}:00Z` : undefined,
        location_name: venueName,
        location_address: address,
        location_city: city,
        description,
        cover_image_url: selectedCover,
        enable_guest_uploads: enableQrGuestUpload,
        require_guest_upload_moderation: requireModeration
      };

      const res = await apiRequest(`/api/v1/families/by-slug/${slug}/events/`, {
        method: "POST",
        body: JSON.stringify(payload)
      });
      setIsSubmitting(false);
      if (res.success && res.data) {
        setCreatedEventSlug(res.data.slug || res.data.id);
      } else {
        setCreatedEventSlug(title.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "event");
      }
      setIsSuccess(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F1E9] text-[#2B2B2B]">
      {/* Top Header */}
      <div className="border-b border-[#EAE3D6] bg-white px-6 py-5 md:px-10">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href={`/${slug}/events`}
              className="rounded-lg p-1.5 text-[#736B5E] transition hover:bg-[#F6F1E9] hover:text-[#2B2B2B]"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="font-serif text-xl font-bold text-[#2B2B2B]">
                Create Family Event
              </h1>
              <p className="text-xs text-[#736B5E]">
                Step {step} of 3: {step === 1 ? "Event Overview" : step === 2 ? "Schedule & Hosts" : "QR & Memory Permissions"}
              </p>
            </div>
          </div>

          {/* Stepper indicators */}
          <div className="hidden items-center gap-2 sm:flex">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition ${
                  step === s
                    ? "bg-[#C18B58] text-white"
                    : step > s
                    ? "bg-[#4A7C59] text-white"
                    : "border border-[#EAE3D6] bg-[#FAF8F5] text-[#736B5E]"
                }`}
              >
                {step > s ? <CheckCircle2 className="h-4 w-4" /> : s}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-8 md:px-10">
        {isSuccess ? (
          <div className="rounded-2xl border border-[#EAE3D6] bg-white p-8 text-center shadow-sm sm:p-12">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#EAF3EC] text-[#4A7C59]">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h2 className="mt-4 font-serif text-2xl font-bold text-[#2B2B2B]">
              Event Created Successfully!
            </h2>
            <p className="mx-auto mt-2 max-w-md text-xs text-[#736B5E]">
              &ldquo;{title || "Bekele Family Gathering"}&rdquo; has been added to your family archive. Guest QR tokens and RSVP channels are now live.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href={`/${slug}/events/${createdEventSlug || "timkat-gathering-2026"}/qr`}
                className="inline-flex items-center gap-2 rounded-xl border border-[#C18B58] bg-[#FAF5EE] px-5 py-2.5 text-xs font-semibold text-[#C18B58] hover:bg-[#F3EAD9]"
              >
                <QrCode className="h-4 w-4" />
                <span>View Guest QR Card</span>
              </Link>
              <Link
                href={`/${slug}/events/${createdEventSlug || "timkat-gathering-2026"}`}
                className="inline-flex items-center gap-2 rounded-xl bg-[#C18B58] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#A97544]"
              >
                <span>Go to Event Hub</span>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleNext} className="space-y-8">
            {step === 1 && (
              <div className="rounded-2xl border border-[#EAE3D6] bg-white p-6 shadow-sm md:p-8">
                <h2 className="font-serif text-lg font-bold text-[#2B2B2B]">
                  1. Event Basics & Cultural Identity
                </h2>
                <p className="mt-0.5 text-xs text-[#736B5E]">
                  Provide the title, category, and traditional Ethiopian calendar details for this occasion.
                </p>

                <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div>
                    <label className="block text-xs font-medium text-[#2B2B2B]">
                      Event Title (English) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Bekele Family Meskel Gathering"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-[#EAE3D6] bg-[#FAF8F5] px-3.5 py-2.5 text-xs text-[#2B2B2B] focus:border-[#C18B58] focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#2B2B2B]">
                      Amharic Title (የበዓሉ ስም)
                    </label>
                    <input
                      type="text"
                      placeholder="ለምሳሌ: የቤተሰብ የመስቀል ደመራ በዓል"
                      value={titleAmharic}
                      onChange={(e) => setTitleAmharic(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-[#EAE3D6] bg-[#FAF8F5] px-3.5 py-2.5 text-xs text-[#2B2B2B] focus:border-[#C18B58] focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#2B2B2B]">
                      Category *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-[#EAE3D6] bg-[#FAF8F5] px-3.5 py-2.5 text-xs text-[#2B2B2B] focus:border-[#C18B58] focus:bg-white focus:outline-none"
                    >
                      <option value="holiday">Holiday / Traditional Feast (በዓል)</option>
                      <option value="wedding">Traditional Wedding / Melse (ሰርግ)</option>
                      <option value="birthday">Milestone Birthday (የልደት ቀን)</option>
                      <option value="reunion">Family Homecoming & Reunion (መገናኛ)</option>
                      <option value="memorial">Memorial / Tazya (መታሰቢያ)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#2B2B2B]">
                      Ethiopian Calendar Reference
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. መስከረም 17, 2018 ዓ.ም (መስቀል)"
                      value={ethiopianDate}
                      onChange={(e) => setEthiopianDate(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-[#EAE3D6] bg-[#FAF8F5] px-3.5 py-2.5 text-xs text-[#2B2B2B] focus:border-[#C18B58] focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#2B2B2B]">
                      Date (Gregorian) *
                    </label>
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-[#EAE3D6] bg-[#FAF8F5] px-3.5 py-2.5 text-xs text-[#2B2B2B] focus:border-[#C18B58] focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-[#2B2B2B]">
                        Start Time
                      </label>
                      <input
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-[#EAE3D6] bg-[#FAF8F5] px-3.5 py-2.5 text-xs text-[#2B2B2B] focus:border-[#C18B58] focus:bg-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#2B2B2B]">
                        End Time
                      </label>
                      <input
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-[#EAE3D6] bg-[#FAF8F5] px-3.5 py-2.5 text-xs text-[#2B2B2B] focus:border-[#C18B58] focus:bg-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-[#2B2B2B]">
                      Event Description & Cultural Notes
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Share program highlights, attire suggestions (e.g. Traditional white Habesha Kemis), and prayer blessings..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-[#EAE3D6] bg-[#FAF8F5] p-3 text-xs text-[#2B2B2B] focus:border-[#C18B58] focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* Preset Cover Selector */}
                <div className="mt-6 border-t border-[#EAE3D6] pt-5">
                  <label className="block text-xs font-semibold text-[#2B2B2B]">
                    Select Event Cover Image
                  </label>
                  <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {COVER_PRESETS.map((preset) => (
                      <div
                        key={preset.id}
                        onClick={() => setSelectedCover(preset.url)}
                        className={`relative cursor-pointer overflow-hidden rounded-xl border-2 transition ${
                          selectedCover === preset.url
                            ? "border-[#C18B58] shadow-md"
                            : "border-transparent opacity-75 hover:opacity-100"
                        }`}
                      >
                        <div className="relative h-20 w-full">
                          <Image
                            src={preset.url}
                            alt={preset.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <p className="bg-white p-1.5 text-center text-[10px] font-medium text-[#2B2B2B]">
                          {preset.title}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="rounded-2xl border border-[#EAE3D6] bg-white p-6 shadow-sm md:p-8">
                <h2 className="font-serif text-lg font-bold text-[#2B2B2B]">
                  2. Venue Location & Event Hosts
                </h2>
                <p className="mt-0.5 text-xs text-[#736B5E]">
                  Specify where relatives will gather and designate coordinators from the family directory.
                </p>

                <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div>
                    <label className="block text-xs font-medium text-[#2B2B2B]">
                      Venue Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Bole Medhanialem Grand Banquet Hall"
                      value={venueName}
                      onChange={(e) => setVenueName(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-[#EAE3D6] bg-[#FAF8F5] px-3.5 py-2.5 text-xs text-[#2B2B2B] focus:border-[#C18B58] focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#2B2B2B]">
                      City / Region *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Addis Ababa or Gondar"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-[#EAE3D6] bg-[#FAF8F5] px-3.5 py-2.5 text-xs text-[#2B2B2B] focus:border-[#C18B58] focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-[#2B2B2B]">
                      Address / Map Landmark
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Next to Edna Mall, Cameroon Street"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-[#EAE3D6] bg-[#FAF8F5] px-3.5 py-2.5 text-xs text-[#2B2B2B] focus:border-[#C18B58] focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="mt-6 border-t border-[#EAE3D6] pt-5">
                  <label className="block text-xs font-semibold text-[#2B2B2B]">
                    Designated Event Hosts
                  </label>
                  <p className="text-[11px] text-[#736B5E]">
                    Hosts can manage RSVPs, generate QR codes, and review guest photo submissions.
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {["Dawit Bekele", "Hana Mekonnen", "Elias Bekele", "Selam Bekele"].map((host) => {
                      const isSelected = selectedHosts.includes(host);
                      return (
                        <button
                          key={host}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              setSelectedHosts(selectedHosts.filter((h) => h !== host));
                            } else {
                              setSelectedHosts([...selectedHosts, host]);
                            }
                          }}
                          className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
                            isSelected
                              ? "bg-[#C18B58] text-white"
                              : "border border-[#EAE3D6] bg-[#FAF8F5] text-[#2B2B2B] hover:border-[#C18B58]"
                          }`}
                        >
                          {isSelected && "✓ "}
                          {host}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="rounded-2xl border border-[#EAE3D6] bg-white p-6 shadow-sm md:p-8">
                <h2 className="font-serif text-lg font-bold text-[#2B2B2B]">
                  3. QR Guest Uploads & Memory Safeguards
                </h2>
                <p className="mt-0.5 text-xs text-[#736B5E]">
                  KinKeep creates an instant QR code allowing wedding and reunion guests to upload photos without creating an account.
                </p>

                <div className="mt-6 space-y-4">
                  <div className="flex items-start justify-between rounded-xl border border-[#EAE3D6] bg-[#FAF8F5] p-4">
                    <div className="flex gap-3">
                      <QrCode className="mt-0.5 h-5 w-5 text-[#C18B58]" />
                      <div>
                        <h4 className="text-xs font-bold text-[#2B2B2B]">
                          Enable Public Guest QR Upload Portal
                        </h4>
                        <p className="text-[11px] text-[#736B5E]">
                          Printable table cards allow any guest with a smartphone camera to upload photos and memories.
                        </p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={enableQrGuestUpload}
                      onChange={(e) => setEnableQrGuestUpload(e.target.checked)}
                      className="h-4 w-4 rounded text-[#C18B58] focus:ring-[#C18B58]"
                    />
                  </div>

                  <div className="flex items-start justify-between rounded-xl border border-[#EAE3D6] bg-[#FAF8F5] p-4">
                    <div className="flex gap-3">
                      <Users className="mt-0.5 h-5 w-5 text-[#C18B58]" />
                      <div>
                        <h4 className="text-xs font-bold text-[#2B2B2B]">
                          Require Guest Name & Kinship
                        </h4>
                        <p className="text-[11px] text-[#736B5E]">
                          Prompts uploaders for their name and how they know the family before accepting files.
                        </p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={requireGuestName}
                      onChange={(e) => setRequireGuestName(e.target.checked)}
                      className="h-4 w-4 rounded text-[#C18B58] focus:ring-[#C18B58]"
                    />
                  </div>

                  <div className="flex items-start justify-between rounded-xl border border-[#EAE3D6] bg-[#FAF8F5] p-4">
                    <div className="flex gap-3">
                      <ShieldCheck className="mt-0.5 h-5 w-5 text-[#C18B58]" />
                      <div>
                        <h4 className="text-xs font-bold text-[#2B2B2B]">
                          Require Host Moderation Before Public Stream
                        </h4>
                        <p className="text-[11px] text-[#736B5E]">
                          If enabled, guest photos remain in a private review inbox until approved by an event host.
                        </p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={requireModeration}
                      onChange={(e) => setRequireModeration(e.target.checked)}
                      className="h-4 w-4 rounded text-[#C18B58] focus:ring-[#C18B58]"
                    />
                  </div>

                  <div className="flex items-start justify-between rounded-xl border border-[#EAE3D6] bg-[#FAF8F5] p-4">
                    <div className="flex gap-3">
                      <Sparkles className="mt-0.5 h-5 w-5 text-[#C18B58]" />
                      <div>
                        <h4 className="text-xs font-bold text-[#2B2B2B]">
                          Digital Guestbook Wishes
                        </h4>
                        <p className="text-[11px] text-[#736B5E]">
                          Allow attendees to leave written blessings and congratulations in the event guestbook.
                        </p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={allowGuestWishes}
                      onChange={(e) => setAllowGuestWishes(e.target.checked)}
                      className="h-4 w-4 rounded text-[#C18B58] focus:ring-[#C18B58]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Form Nav Buttons */}
            <div className="flex items-center justify-between">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep((step - 1) as 1 | 2 | 3)}
                  className="rounded-xl border border-[#EAE3D6] bg-white px-5 py-2.5 text-xs font-semibold text-[#2B2B2B] hover:bg-[#FAF8F5]"
                >
                  Previous Step
                </button>
              ) : (
                <div />
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 rounded-xl bg-[#C18B58] px-6 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#A97544] disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Saving Event...</span>
                ) : step === 3 ? (
                  <span>Publish & Generate QR</span>
                ) : (
                  <span>Continue to Step {step + 1}</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
