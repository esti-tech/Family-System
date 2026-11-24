"use client";

import Link from "next/link";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Mic,
  Square,
  Upload,
  Image as ImageIcon,
  Check,
  Sparkles,
  Save,
  Loader2,
} from "lucide-react";
import { apiRequest } from "@/services/api";

export default function CreateStoryPage() {
  const params = useParams();
  const router = useRouter();
  const slug = (params?.familySlug as string) || "bekele-family";

  const [title, setTitle] = useState("");
  const [amharicTitle, setAmharicTitle] = useState("");
  const [storyteller, setStoryteller] = useState("Almaz Tesfaye");
  const [category, setCategory] = useState("AUDIO");
  const [content, setContent] = useState("");

  // Simulated Voice Recorder state
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [hasRecordedAudio, setHasRecordedAudio] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      setHasRecordedAudio(true);
    } else {
      setIsRecording(true);
      setRecordSeconds(0);
      const timer = setInterval(() => {
        setRecordSeconds((prev) => {
          if (prev >= 60) {
            clearInterval(timer);
            setIsRecording(false);
            setHasRecordedAudio(true);
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    }
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await apiRequest(`/api/v1/families/by-slug/${slug}/stories/`, {
      method: "POST",
      body: JSON.stringify({
        title,
        title_amharic: amharicTitle,
        narrator_name: storyteller,
        content: content || "Family oral history narrative.",
        category: category === "AUDIO" ? "ORAL_HISTORY" : category,
        status: "PUBLISHED",
        audio_url: hasRecordedAudio ? "https://storage.kinkeep.com/audio/voice_recording.mp3" : "",
        audio_duration_seconds: recordSeconds > 0 ? recordSeconds : undefined,
      }),
    });

    setLoading(false);
    if (res.success) {
      router.push(`/${slug}/stories`);
    } else {
      alert(res.error?.message || "Failed to publish story.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#EAE3D6]">
        <Link
          href={`/${slug}/stories`}
          className="text-xs text-[#5A5A5A] hover:text-[#2B2B2B] flex items-center"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1" />
          Back to Stories Directory
        </Link>
      </div>

      <div className="space-y-1">
        <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#C18B58]">
          PRESERVE LIVING MEMORY
        </span>
        <h1 className="font-serif text-3xl font-bold text-[#2B2B2B]">
          Record or Write a Family Story
        </h1>
        <p className="text-xs text-[#5A5A5A] font-light">
          Capture the voices, recipes, and traditions that make your family unmistakably yours.
        </p>
      </div>

      <form onSubmit={handlePublish} className="space-y-6 text-xs">
        {/* Title Inputs */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#EAE3D6] shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-4">
          <div>
            <label className="block font-medium text-[#2B2B2B] mb-1">
              Story Title (English) *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. The Story of Our First Coffee Ceremony in Gondar"
              className="w-full px-3.5 py-2.5 rounded-md border border-[#D5C9B8] text-sm text-[#2B2B2B] placeholder:text-[#9A9A9A] focus:outline-none focus:ring-1 focus:ring-[#C18B58]"
            />
          </div>

          <div>
            <label className="block font-medium text-[#2B2B2B] mb-1">
              Amharic Title (Optional)
            </label>
            <input
              type="text"
              value={amharicTitle}
              onChange={(e) => setAmharicTitle(e.target.value)}
              placeholder="ለምሳሌ፡ የጎንደር የሰንበት ጠዋት የቡና ቁርስ"
              className="w-full px-3.5 py-2 rounded-md border border-[#D5C9B8] text-xs text-[#2B2B2B] placeholder:text-[#9A9A9A] focus:outline-none focus:ring-1 focus:ring-[#C18B58]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-[#2B2B2B] mb-1">
                Storyteller / Voice
              </label>
              <select
                value={storyteller}
                onChange={(e) => setStoryteller(e.target.value)}
                className="w-full px-3.5 py-2 rounded-md border border-[#D5C9B8] text-xs text-[#2B2B2B] bg-white focus:outline-none focus:ring-1 focus:ring-[#C18B58]"
              >
                <option value="Almaz Tesfaye">Almaz Tesfaye (Grandmother)</option>
                <option value="Elias Bekele">Elias Bekele (Grandfather)</option>
                <option value="Dawit Mekonnen">Dawit Mekonnen (Father)</option>
                <option value="Hana Mekonnen">Hana Mekonnen (Mother)</option>
                <option value="Selam Mekonnen">Selam Mekonnen (You)</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-[#2B2B2B] mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2 rounded-md border border-[#D5C9B8] text-xs text-[#2B2B2B] bg-white focus:outline-none focus:ring-1 focus:ring-[#C18B58]"
              >
                <option value="AUDIO">Elder Voice Recording</option>
                <option value="RECIPE">Traditional Recipe</option>
                <option value="MIGRATION">Historical Migration</option>
                <option value="MEMOIR">Family Memoir & Folktale</option>
              </select>
            </div>
          </div>
        </div>

        {/* VOICE MEMO RECORDER WIDGET */}
        <div className="bg-[#2B2B2B] text-white rounded-2xl p-6 sm:p-8 border border-[#EAE3D6] space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#C18B58]">
              ELDER VOICE RECORDER
            </span>
            <span className="text-[11px] font-mono text-[#EAE3D6]">
              {isRecording
                ? `Recording: 00:${recordSeconds < 10 ? `0${recordSeconds}` : recordSeconds}`
                : hasRecordedAudio
                ? "Audio captured (00:45)"
                : "Microphone Ready"}
            </span>
          </div>

          <p className="text-xs text-[#EAE3D6] font-light leading-relaxed">
            Record elder recollections directly from your phone, laptop, or tablet during family gatherings.
          </p>

          <div className="flex items-center space-x-4 pt-2">
            <button
              type="button"
              onClick={toggleRecording}
              className={`px-4 py-2.5 rounded-md font-semibold text-xs flex items-center space-x-2 transition-all ${
                isRecording
                  ? "bg-red-600 hover:bg-red-700 text-white animate-pulse"
                  : "bg-[#C18B58] hover:bg-[#b07d4b] text-white shadow-sm"
              }`}
            >
              {isRecording ? <Square className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
              <span>{isRecording ? "Stop Recording" : hasRecordedAudio ? "Re-record Audio" : "Start Voice Recording"}</span>
            </button>

            <label className="px-3.5 py-2.5 rounded-md border border-white/20 hover:bg-white/10 text-white text-xs font-medium cursor-pointer flex items-center space-x-1.5 transition-colors">
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Audio File</span>
              <input type="file" accept="audio/*" className="hidden" />
            </label>
          </div>

          {hasRecordedAudio && (
            <div className="p-3 bg-white/10 rounded-lg flex items-center justify-between text-xs text-emerald-400">
              <span className="flex items-center">
                <Check className="w-3.5 h-3.5 mr-1" />
                Voice memo attached successfully
              </span>
              <span className="text-[11px] text-[#EAE3D6]/70">45 seconds recorded</span>
            </div>
          )}
        </div>

        {/* Written Story Text */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#EAE3D6] shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-4">
          <label className="block font-medium text-[#2B2B2B]">
            Story Narrative & Transcribed Notes
          </label>
          <textarea
            rows={8}
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Type or paste the story here. Mention key elders, sayings, and details..."
            className="w-full px-3.5 py-2.5 rounded-md border border-[#D5C9B8] text-xs text-[#2B2B2B] leading-relaxed placeholder:text-[#9A9A9A] focus:outline-none focus:ring-1 focus:ring-[#C18B58] resize-none"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-2">
          <Link
            href={`/${slug}/stories`}
            className="px-4 py-2.5 rounded-md border border-[#D5C9B8] text-[#5A5A5A] hover:bg-[#F6F1E9] transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-md bg-[#C18B58] hover:bg-[#b07d4b] text-white text-xs font-semibold shadow-sm transition-colors flex items-center space-x-1.5"
          >
            {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>Publish Story to Heritage</span>
          </button>
        </div>
      </form>
    </div>
  );
}
