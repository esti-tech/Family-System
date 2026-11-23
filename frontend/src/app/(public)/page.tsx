import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F6F1E9]">
      <Navbar />

      {/* 1. HERO SECTION */}
      <section className="relative min-h-[700px] lg:min-h-[760px] flex flex-col justify-between overflow-hidden">
        {/* Background Photograph */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/images/hero-family.jpeg"
            alt="Ethiopian multi-generational family sharing a warm moment at home"
            fill
            priority
            className="object-cover object-center"
          />
          {/* Subtle cinematic overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/30" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-24 sm:pt-32 pb-12 w-full">
          <div className="max-w-2xl">
            {/* Small gold horizontal dash */}
            <div className="w-8 h-[2px] bg-[#C18B58] mb-5" />

            {/* Tagline */}
            <p className="text-xs uppercase tracking-[0.25em] text-[#EAE3D6] font-medium mb-5">
              OUR ROOTS. OUR PEOPLE. OUR FOREVER.
            </p>

            {/* Main Headline */}
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-normal text-white leading-[1.08] mb-6">
              Every Family<br />Has a Story.
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-[#F6F1E9]/90 max-w-xl font-light leading-relaxed mb-8">
              Preserve your family tree, your precious memories, and the heritage that makes you who you are. One home for every generation.
            </p>

            {/* Start Button */}
            <div>
              <Link
                href="/register"
                className="inline-flex items-center justify-center px-7 py-3 rounded-md text-sm font-medium text-white bg-[#C18B58] hover:bg-[#b07d4b] transition-colors shadow-sm"
              >
                Start Your Family Story
              </Link>
            </div>

            {/* Explore Link */}
            <div className="mt-5">
              <Link
                href="#features"
                className="inline-flex items-center text-xs text-white/80 hover:text-white transition-colors"
              >
                Explore KinKeep <span className="ml-1 text-[11px]">↗</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Tagline inside Hero */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pb-8 w-full">
          <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-white/60 font-medium">
            THE STORIES WE KEEP BECOME THE LEGACY WE LEAVE.
          </p>
        </div>
      </section>

      {/* 2. TRUST / GENERATIONS STATEMENT */}
      <section className="bg-[#F6F1E9] py-20 sm:py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-serif text-3xl sm:text-4xl text-[#2B2B2B] font-normal tracking-tight">
            Different generations. One belonging.
          </h2>
          <p className="text-sm sm:text-base text-[#5A5A5A] max-w-2xl mx-auto mt-4 leading-relaxed font-light">
            From the stories of our elders to the first steps of our children, KinKeep keeps your family connected—to each other, to your roots, and to what comes next.
          </p>
          <div className="w-20 h-[1.5px] bg-[#C18B58] mx-auto mt-8" />
        </div>
      </section>

      {/* 3. FOUR CORE FEATURES */}
      <section id="features" className="bg-[#F6F1E9] pb-24 sm:pb-32">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          {/* Section Header */}
          <div className="mb-10">
            <p className="text-[11px] uppercase tracking-[0.25em] text-[#7A7A7A] font-semibold mb-2">
              A HOME FOR EVERYTHING THAT MATTERS
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#2B2B2B] font-normal mb-2">
              Keep your family close. Keep your history closer.
            </h2>
            <p className="text-sm sm:text-base text-[#5A5A5A] font-light">
              Thoughtful tools for the people, memories, and traditions you never want to lose.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1: Family Tree */}
            <div className="bg-white rounded-xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-[#EAE3D6] flex flex-col group hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] transition-all">
              <div className="aspect-[4/3] relative w-full overflow-hidden bg-[#EAE3D6]">
                <Image
                  src="/assets/images/feature-family-tree.jpeg"
                  alt="Grandfather and child exploring family photo album"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="font-serif text-lg font-semibold text-[#2B2B2B] mb-2">
                    Family Tree
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5A5A5A] leading-relaxed mb-6 font-light">
                    Connect generations and discover the branches of your family.
                  </p>
                </div>
                <Link
                  href="/register"
                  className="inline-flex items-center text-xs font-medium text-[#2B2B2B] group-hover:text-[#C18B58] transition-colors"
                >
                  Explore feature <span className="ml-1 text-[11px]">↗</span>
                </Link>
              </div>
            </div>

            {/* Feature 2: Memory Archive */}
            <div className="bg-white rounded-xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-[#EAE3D6] flex flex-col group hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] transition-all">
              <div className="aspect-[4/3] relative w-full overflow-hidden bg-[#EAE3D6]">
                <Image
                  src="/assets/images/feature-memory-archive.jpeg"
                  alt="Vintage sepia Ethiopian photographs and letters preserved"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="font-serif text-lg font-semibold text-[#2B2B2B] mb-2">
                    Memory Archive
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5A5A5A] leading-relaxed mb-6 font-light">
                    A beautiful home for photos, videos, and treasured moments.
                  </p>
                </div>
                <Link
                  href="/register"
                  className="inline-flex items-center text-xs font-medium text-[#2B2B2B] group-hover:text-[#C18B58] transition-colors"
                >
                  Explore feature <span className="ml-1 text-[11px]">↗</span>
                </Link>
              </div>
            </div>

            {/* Feature 3: Family Stories */}
            <div className="bg-white rounded-xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-[#EAE3D6] flex flex-col group hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] transition-all">
              <div className="aspect-[4/3] relative w-full overflow-hidden bg-[#EAE3D6]">
                <Image
                  src="/assets/images/feature-family-stories.jpeg"
                  alt="Grandmother and granddaughter sharing oral stories"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="font-serif text-lg font-semibold text-[#2B2B2B] mb-2">
                    Family Stories
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5A5A5A] leading-relaxed mb-6 font-light">
                    Keep the voices, recipes, and wisdom that make you, you.
                  </p>
                </div>
                <Link
                  href="/register"
                  className="inline-flex items-center text-xs font-medium text-[#2B2B2B] group-hover:text-[#C18B58] transition-colors"
                >
                  Explore feature <span className="ml-1 text-[11px]">↗</span>
                </Link>
              </div>
            </div>

            {/* Feature 4: Events & QR Uploads */}
            <div className="bg-white rounded-xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-[#EAE3D6] flex flex-col group hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] transition-all">
              <div className="aspect-[4/3] relative w-full overflow-hidden bg-[#EAE3D6]">
                <Image
                  src="/assets/images/feature-events-qr.jpeg"
                  alt="Ethiopian family wedding and cultural celebration"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="font-serif text-lg font-semibold text-[#2B2B2B] mb-2">
                    Events & QR Uploads
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5A5A5A] leading-relaxed mb-6 font-light">
                    Gather together. Let everyone scan, share, and remember.
                  </p>
                </div>
                <Link
                  href="/register"
                  className="inline-flex items-center text-xs font-medium text-[#2B2B2B] group-hover:text-[#C18B58] transition-colors"
                >
                  Explore feature <span className="ml-1 text-[11px]">↗</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section id="how-it-works" className="bg-white py-24 sm:py-32 border-y border-[#EAE3D6]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          {/* Header */}
          <div className="mb-16">
            <p className="text-[11px] uppercase tracking-[0.25em] text-[#7A7A7A] font-semibold mb-2">
              YOUR LEGACY STARTS HERE
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#2B2B2B] font-normal">
              Three simple steps. Generations of meaning.
            </h2>
          </div>

          {/* Steps */}
          <div className="relative">
            {/* Connecting Horizontal Line (Desktop) */}
            <div className="hidden sm:block absolute top-5 left-[15%] right-[15%] h-[1px] bg-[#EAE3D6] z-0" />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 sm:gap-8 relative z-10">
              {/* Step 01 */}
              <div>
                <div className="w-10 h-10 rounded-full border border-[#D5C9B8] bg-white flex items-center justify-center font-serif text-sm font-medium text-[#2B2B2B] shadow-sm mb-6">
                  01
                </div>
                <h3 className="font-serif text-xl font-medium text-[#2B2B2B] mb-2">
                  Create Your Family
                </h3>
                <p className="text-sm text-[#5A5A5A] font-light leading-relaxed max-w-sm">
                  Start with yourself. Add the people and places that are part of your story.
                </p>
              </div>

              {/* Step 02 */}
              <div>
                <div className="w-10 h-10 rounded-full border border-[#D5C9B8] bg-white flex items-center justify-center font-serif text-sm font-medium text-[#2B2B2B] shadow-sm mb-6">
                  02
                </div>
                <h3 className="font-serif text-xl font-medium text-[#2B2B2B] mb-2">
                  Invite Relatives
                </h3>
                <p className="text-sm text-[#5A5A5A] font-light leading-relaxed max-w-sm">
                  Bring your family together, across cities, countries, and generations.
                </p>
              </div>

              {/* Step 03 */}
              <div>
                <div className="w-10 h-10 rounded-full border border-[#D5C9B8] bg-white flex items-center justify-center font-serif text-sm font-medium text-[#2B2B2B] shadow-sm mb-6">
                  03
                </div>
                <h3 className="font-serif text-xl font-medium text-[#2B2B2B] mb-2">
                  Preserve Memories
                </h3>
                <p className="text-sm text-[#5A5A5A] font-light leading-relaxed max-w-sm">
                  Save a photograph. Record a story. Keep a little more of what matters.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. HERITAGE SHOWCASE */}
      <section id="heritage" className="bg-[#F6F1E9] py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          {/* Header */}
          <div className="mb-12">
            <p className="text-[11px] uppercase tracking-[0.25em] text-[#7A7A7A] font-semibold mb-2">
              ROOTED IN ETHIOPIA. CARRIED BY FAMILY.
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#2B2B2B] font-normal mb-2">
              Heritage lives in the everyday.
            </h2>
            <p className="text-sm sm:text-base text-[#5A5A5A] font-light">
              The stories, rituals, and celebrations that make a family unmistakably yours.
            </p>
          </div>

          {/* 3 Images Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {/* Photo 1: Elders */}
            <div className="rounded-xl overflow-hidden bg-white shadow-sm border border-[#EAE3D6]">
              <div className="aspect-[4/3] relative w-full">
                <Image
                  src="/assets/images/heritage-elders.jpeg"
                  alt="Ethiopian elder grandmother and granddaughter smiling warmly"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Photo 2: Coffee Ceremony */}
            <div className="rounded-xl overflow-hidden bg-white shadow-sm border border-[#EAE3D6] p-2">
              <div className="aspect-[4/3] relative w-full rounded-lg overflow-hidden">
                <Image
                  src="/assets/images/heritage-coffee.jpeg"
                  alt="Traditional Ethiopian jebena coffee ceremony being poured"
                  fill
                  className="object-cover"
                />
              </div>
              <p className="text-xs text-[#5A5A5A] font-serif italic text-center py-3">
                A cup of coffee. A sense of home.
              </p>
            </div>

            {/* Photo 3: Wedding */}
            <div className="rounded-xl overflow-hidden bg-white shadow-sm border border-[#EAE3D6]">
              <div className="aspect-[4/3] relative w-full">
                <Image
                  src="/assets/images/heritage-wedding.jpeg"
                  alt="Ethiopian wedding celebration with traditional white attire and clapping guests"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. PRICING PLANS */}
      <section id="pricing" className="bg-[#F6F1E9] py-24 sm:py-32 border-t border-[#EAE3D6]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          {/* Header */}
          <div className="text-center mb-16">
            <p className="text-[11px] uppercase tracking-[0.25em] text-[#7A7A7A] font-semibold mb-2">
              A PLAN FOR EVERY CHAPTER
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#2B2B2B] font-normal mb-2">
              Your family’s next chapter starts here.
            </h2>
            <p className="text-sm sm:text-base text-[#5A5A5A] font-light">
              Start simply. Make more room as your family’s story grows.
            </p>
          </div>

          {/* Pricing Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
            {/* Plan 1: Basic */}
            <div className="bg-white rounded-xl p-8 border border-[#EAE3D6] shadow-[0_2px_8px_rgba(0,0,0,0.03)] flex flex-col justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#7A7A7A] font-medium mb-1">
                  START YOUR STORY
                </p>
                <h3 className="font-serif text-2xl font-bold text-[#2B2B2B] mb-1">
                  Basic
                </h3>
                <p className="text-xs text-[#7A7A7A] font-light mb-8">
                  For your first roots.
                </p>

                {/* Features Table */}
                <div className="space-y-4 text-xs">
                  <div className="flex justify-between items-center py-1 border-b border-[#F6F1E9]">
                    <span className="text-[#5A5A5A]">Family tree</span>
                    <span className="text-[#2B2B2B] font-medium">Included</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-[#F6F1E9]">
                    <span className="text-[#5A5A5A]">Memory archive</span>
                    <span className="text-[#2B2B2B] font-medium">Essential</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-[#F6F1E9]">
                    <span className="text-[#5A5A5A]">Family stories</span>
                    <span className="text-[#2B2B2B] font-medium">Included</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-[#F6F1E9]">
                    <span className="text-[#5A5A5A]">Event QR uploads</span>
                    <span className="text-[#7A7A7A]">—</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-[#5A5A5A]">Legacy export</span>
                    <span className="text-[#7A7A7A]">—</span>
                  </div>
                </div>
              </div>

              <Link
                href="/register?plan=basic"
                className="w-full mt-10 py-2.5 px-4 rounded-md border border-[#2B2B2B] text-[#2B2B2B] text-xs font-semibold hover:bg-[#F6F1E9] transition-colors text-center inline-block"
              >
                View Plan <span className="ml-1 text-[11px]">↗</span>
              </Link>
            </div>

            {/* Plan 2: Family Plus (Highlighted) */}
            <div className="bg-white rounded-xl p-8 border-2 border-[#C18B58] shadow-[0_8px_24px_rgba(193,139,88,0.12)] flex flex-col justify-between relative">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#C18B58] font-semibold mb-1">
                  GROW TOGETHER
                </p>
                <h3 className="font-serif text-2xl font-bold text-[#2B2B2B] mb-1">
                  Family Plus
                </h3>
                <p className="text-xs text-[#7A7A7A] font-light mb-8">
                  For a family growing closer.
                </p>

                {/* Features Table */}
                <div className="space-y-4 text-xs">
                  <div className="flex justify-between items-center py-1 border-b border-[#F6F1E9]">
                    <span className="text-[#5A5A5A]">Family tree</span>
                    <span className="text-[#2B2B2B] font-medium">Included</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-[#F6F1E9]">
                    <span className="text-[#5A5A5A]">Memory archive</span>
                    <span className="text-[#2B2B2B] font-medium">Expanded</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-[#F6F1E9]">
                    <span className="text-[#5A5A5A]">Family stories</span>
                    <span className="text-[#2B2B2B] font-medium">Included</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-[#F6F1E9]">
                    <span className="text-[#5A5A5A]">Event QR uploads</span>
                    <span className="text-[#2B2B2B] font-medium">Included</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-[#5A5A5A]">Legacy export</span>
                    <span className="text-[#7A7A7A]">—</span>
                  </div>
                </div>
              </div>

              <Link
                href="/register?plan=family_plus"
                className="w-full mt-10 py-2.5 px-4 rounded-md bg-[#C18B58] hover:bg-[#b07d4b] text-white text-xs font-semibold transition-colors text-center inline-block shadow-sm"
              >
                View Plan <span className="ml-1 text-[11px]">↗</span>
              </Link>
            </div>

            {/* Plan 3: Premium */}
            <div className="bg-white rounded-xl p-8 border border-[#EAE3D6] shadow-[0_2px_8px_rgba(0,0,0,0.03)] flex flex-col justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#7A7A7A] font-medium mb-1">
                  KEEP IT FOR GENERATIONS
                </p>
                <h3 className="font-serif text-2xl font-bold text-[#2B2B2B] mb-1">
                  Premium
                </h3>
                <p className="text-xs text-[#7A7A7A] font-light mb-8">
                  For a legacy without limits.
                </p>

                {/* Features Table */}
                <div className="space-y-4 text-xs">
                  <div className="flex justify-between items-center py-1 border-b border-[#F6F1E9]">
                    <span className="text-[#5A5A5A]">Family tree</span>
                    <span className="text-[#2B2B2B] font-medium">Included</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-[#F6F1E9]">
                    <span className="text-[#5A5A5A]">Memory archive</span>
                    <span className="text-[#2B2B2B] font-medium">Complete</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-[#F6F1E9]">
                    <span className="text-[#5A5A5A]">Family stories</span>
                    <span className="text-[#2B2B2B] font-medium">Included</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-[#F6F1E9]">
                    <span className="text-[#5A5A5A]">Event QR uploads</span>
                    <span className="text-[#2B2B2B] font-medium">Included</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-[#5A5A5A]">Legacy export</span>
                    <span className="text-[#2B2B2B] font-medium">Included</span>
                  </div>
                </div>
              </div>

              <Link
                href="/register?plan=premium"
                className="w-full mt-10 py-2.5 px-4 rounded-md border border-[#2B2B2B] text-[#2B2B2B] text-xs font-semibold hover:bg-[#F6F1E9] transition-colors text-center inline-block"
              >
                View Plan <span className="ml-1 text-[11px]">↗</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FINAL CALL TO ACTION */}
      <section className="relative min-h-[520px] flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/images/final-cta-family.jpeg"
            alt="Ethiopian multi-generational family walking in traditional dress"
            fill
            className="object-cover object-center"
          />
          {/* Subtle dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/35" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-20 w-full">
          <div className="max-w-xl">
            <p className="text-xs uppercase tracking-[0.25em] text-[#EAE3D6] font-medium mb-4">
              FOR YOUR FAMILY. FOR GENERATIONS.
            </p>
            <h2 className="font-serif text-4xl sm:text-5xl font-normal text-white leading-tight mb-4">
              Your Story Deserves<br />to Be Remembered.
            </h2>
            <p className="text-sm sm:text-base text-[#F6F1E9]/90 font-light mb-8">
              Begin with one memory. Keep a lifetime of belonging.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center justify-center px-8 py-3 rounded-md text-sm font-medium text-white bg-[#C18B58] hover:bg-[#b07d4b] transition-colors shadow-sm"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* 8. FOOTER */}
      <Footer />
    </div>
  );
}
