"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft,
  Play,
  Pause,
  Volume2,
  Mic,
  Calendar,
  Share2,
  Bookmark,
  Sparkles,
  Heart,
  MessageSquare,
  Loader2,
} from "lucide-react";
import { apiRequest } from "@/services/api";

export default function StoryReaderPage() {
  const params = useParams();
  const slug = (params?.familySlug as string) || "bekele-family";
  const storyId = (params?.storyId as string) || "story-coffee-ceremony";

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(35);
  const [playbackSpeed, setPlaybackSpeed] = useState("1.0x");
  const [languageMode, setLanguageMode] = useState<"EN" | "AM">("EN");
  const [liveStory, setLiveStory] = useState<any | null>(null);

  useEffect(() => {
    async function loadStory() {
      if (!storyId || storyId.startsWith("story-")) return;
      const res = await apiRequest(`/api/v1/families/by-slug/${slug}/stories/${storyId}/`);
      if (res.success && res.data) {
        setLiveStory(res.data);
      }
    }
    loadStory();
  }, [slug, storyId]);

  const defaultStory = {
    title: "The Sunday Morning Coffee Ceremony in Gondar",
    amharicTitle: "የጎንደር የሰንበት ጠዋት የቡና ቁርስ",
    storyteller: "Almaz Tesfaye",
    role: "Grandmother (አያት)",
    avatarColor: "bg-[#A75D5D]",
    date: "Recorded November 18, 2026",
    duration: "14:15 audio recording",
    location: "Gondar, Begemder",
    audioTimestamp: "04:58 / 14:15",
    contentEn: `In our home in Gondar, Sunday mornings belonged to the buna. Before the morning sun climbed above the stone walls of the castle compound, my mother would wash the raw green coffee beans three times in cold well water, ensuring every speck of dust was carried away.

She placed the beans onto the menkeshkesha—the flat iron roasting pan—holding it steadily over glowing charcoal embers. As the beans heated, their skins cracked with a sound like gentle rain. The smoke rose, thick and nutty, filling the veranda. We would gather the smoke with our hands and draw it toward our faces, thanking God for the fragrance and the gift of another day together.

The coffee was brewed slowly in the black clay jebena. There was never any rushing. The ceremony demanded patience, because the coffee was only half the reason we sat together—the true purpose was the talk. 

My father would sip the first cup, Abol, in quiet contemplation. 'Abol is for the spirit,' he would say. With the second round, Tona, the news of the town began to flow—who was marrying, whose harvest was plentiful, and who needed help fixing a thatch roof. By the third round, Baraka, the blessing was spoken over every child in the room:

"May your paths be clear. May peace dwell under your roof. May what we drink today unite our hearts forever."`,

    contentAm: `በጎንደር ቤታችን የሰንበት ጠዋቶች የቡና ነበሩ። የጠዋቱ ፀሐይ ከቤተ-መንግሥቱ ግንብ በላይ ከመውጣቷ በፊት እናቴ ያልተቆላውን አረንጓዴ ቡና በጠራ ምንጭ ውሃ ሦስት ጊዜ ታጥበው ነበር።

ቡናውን በመንከሽከሻው ላይ አድርጋ ፍም በሆነው ከሰል ላይ ታንተከትከው ነበር። ቡናው ሲሞቅና ሲፈነዳ እንደ ዝናብ ድምፅ ያሰማል። ወተቱ የመሰለው ጥሩ መዓዛ ያለው ጭስ በረንዳውን ይሞላዋል። እኛም ጭሱን በእጃችን እያሸተትን ለተሰጠን አዲስ ቀን እግዚአብሔርን እናመሰግናለን።

በሸክላ ጀበናው ቀስ ተብሎ የሚፈላው ቡና ትዕግሥትን ይጠይቃል። የመጀመሪያው ዙር አቦል ሲሆን አባቴ በዝምታ ይቀምሰዋል። ሁለተኛው ቶና የሰፈሩ ወሬ የሚወራበት ነው። ሦስተኛው በረካ ደግሞ በቤቱ ላሉት ልጆች በሙሉ ምርቃት የሚሰጥበት ነው፦

"መንገዳችሁ የቀና ይሁን። በቤታችሁ ሰላም ይስፈን። ዛሬ የምንጠጣው አንድነታችንን ለዘላለም ያጽና።"`,
  };

  const story = liveStory
    ? {
        title: liveStory.title,
        amharicTitle: liveStory.title_amharic || defaultStory.amharicTitle,
        storyteller: liveStory.narrator_name || liveStory.author_name || "Family Elder",
        role: liveStory.era || "Heritage Oral Record",
        avatarColor: liveStory.audio_url ? "bg-[#A75D5D]" : "bg-[#C18B58]",
        date: new Date(liveStory.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
        duration: liveStory.audio_duration_seconds ? `${Math.round(liveStory.audio_duration_seconds / 60)} min audio recording` : "5 min read",
        location: liveStory.location_name || "Ethiopia",
        audioTimestamp: "00:00 / " + (liveStory.audio_duration_seconds ? `${Math.round(liveStory.audio_duration_seconds / 60)}:00` : "05:00"),
        contentEn: liveStory.content || defaultStory.contentEn,
        contentAm: liveStory.content_amharic || defaultStory.contentAm,
      }
    : defaultStory;

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#EAE3D6]">
        <Link
          href={`/${slug}/stories`}
          className="text-xs text-[#5A5A5A] hover:text-[#2B2B2B] flex items-center"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1" />
          Back to Family Stories
        </Link>
        <div className="flex items-center space-x-2">
          {/* Language Toggle */}
          <div className="flex rounded-md border border-[#D5C9B8] overflow-hidden text-xs">
            <button
              onClick={() => setLanguageMode("EN")}
              className={`px-2.5 py-1 ${
                languageMode === "EN" ? "bg-[#C18B58] text-white font-semibold" : "bg-white text-[#5A5A5A]"
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguageMode("AM")}
              className={`px-2.5 py-1 ${
                languageMode === "AM" ? "bg-[#C18B58] text-white font-semibold" : "bg-white text-[#5A5A5A]"
              }`}
            >
              አማርኛ
            </button>
          </div>
          <button
            onClick={() => alert("Story link copied to clipboard")}
            className="p-1.5 rounded-md border border-[#D5C9B8] text-[#5A5A5A] hover:bg-[#F6F1E9]"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Story Headline */}
      <div className="space-y-3">
        <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#C18B58]">
          ORAL MEMOIR · {story.location}
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#2B2B2B] leading-tight">
          {languageMode === "EN" ? story.title : story.amharicTitle}
        </h1>
        {languageMode === "EN" && (
          <p className="font-serif text-base text-[#7A7A7A] italic">
            {story.amharicTitle}
          </p>
        )}

        {/* Storyteller Tag */}
        <div className="flex items-center space-x-3 pt-2 text-xs text-[#5A5A5A]">
          <div
            className={`w-9 h-9 rounded-full ${story.avatarColor} text-white flex items-center justify-center font-serif font-bold text-sm shadow-xs`}
          >
            {story.storyteller.charAt(0)}
          </div>
          <div>
            <span className="font-bold text-[#2B2B2B]">{story.storyteller}</span>
            <span className="text-[11px] text-[#7A7A7A] block">{story.role} · {story.date}</span>
          </div>
        </div>
      </div>

      {/* AUDIO MEMOIR PLAYER WIDGET */}
      <div className="bg-[#2B2B2B] text-white rounded-2xl p-6 border border-[#EAE3D6] shadow-md space-y-4">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2 text-[#C18B58]">
            <Mic className="w-4 h-4" />
            <span className="font-bold tracking-wider uppercase text-[10px]">
              Elder Oral Voice Recording
            </span>
          </div>
          <span className="text-[11px] font-mono text-[#EAE3D6]">{story.audioTimestamp}</span>
        </div>

        {/* Player Controls & Waveform */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-12 h-12 rounded-full bg-[#C18B58] hover:bg-[#b07d4b] text-white flex items-center justify-center transition-all shrink-0 shadow-sm"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
          </button>

          {/* Waveform Bar simulation */}
          <div className="flex-1 space-y-1">
            <div
              className="h-2 bg-white/20 rounded-full overflow-hidden cursor-pointer"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const pos = ((e.clientX - rect.left) / rect.width) * 100;
                setCurrentProgress(pos);
              }}
            >
              <div
                className="h-full bg-[#C18B58] transition-all"
                style={{ width: `${currentProgress}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-white/50 font-mono">
              <span>04:58</span>
              <span>14:15</span>
            </div>
          </div>

          {/* Speed picker */}
          <button
            onClick={() =>
              setPlaybackSpeed(
                playbackSpeed === "1.0x" ? "1.2x" : playbackSpeed === "1.2x" ? "1.5x" : "1.0x"
              )
            }
            className="px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-[10px] font-mono font-bold text-white transition-colors"
          >
            {playbackSpeed}
          </button>
        </div>
      </div>

      {/* STORY CONTENT BODY */}
      <article className="prose max-w-none text-[#2B2B2B] leading-relaxed text-sm sm:text-base font-light space-y-6">
        <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-[#EAE3D6] shadow-sm my-6">
          <Image
            src="/assets/images/heritage-coffee.jpeg"
            alt="Traditional coffee ceremony in progress"
            fill
            className="object-cover"
          />
        </div>

        <div className="whitespace-pre-line leading-loose text-[#343434]">
          {languageMode === "EN" ? story.contentEn : story.contentAm}
        </div>

        {/* Pull Quote */}
        <blockquote className="my-8 p-6 rounded-2xl bg-[#F6F1E9] border-l-4 border-[#C18B58] font-serif italic text-base sm:text-lg text-[#2B2B2B]">
          “The first cup (Abol) is for the spirit. The second (Tona) is for conversation. The third (Baraka) is for the blessing of peace.”
        </blockquote>
      </article>

      {/* Relatives Mentioned Tag */}
      <div className="p-4 rounded-xl bg-white border border-[#EAE3D6] flex flex-wrap items-center justify-between text-xs gap-3">
        <div className="flex items-center space-x-2">
          <span className="text-[#7A7A7A] font-semibold">Relatives Tagged:</span>
          <Link
            href={`/${slug}/tree/person/p-elias`}
            className="px-2 py-0.5 rounded bg-[#F6F1E9] text-[#2B2B2B] hover:text-[#C18B58] font-medium"
          >
            Elias Bekele (Grandfather)
          </Link>
          <Link
            href={`/${slug}/tree/person/p-aster`}
            className="px-2 py-0.5 rounded bg-[#F6F1E9] text-[#2B2B2B] hover:text-[#C18B58] font-medium"
          >
            Aster Gebre (Grandmother)
          </Link>
        </div>
        <button
          onClick={() => alert("Added to your saved memories")}
          className="inline-flex items-center text-[#C18B58] font-semibold hover:underline"
        >
          <Bookmark className="w-3.5 h-3.5 mr-1" />
          <span>Save to My Favorites</span>
        </button>
      </div>
    </div>
  );
}
