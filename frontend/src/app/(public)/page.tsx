import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Users, BookOpen, Clock, QrCode, ShieldCheck, Heart, Sparkles, Check, ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-ivory-100">
      <Navbar />

      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-24 lg:pt-20 lg:pb-32 bg-ivory-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headlines & Call to Action */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gold-100 border border-gold-300 text-xs font-medium text-gold-700 tracking-wide uppercase">
                <Sparkles className="w-3.5 h-3.5 text-gold-600" />
                <span>Our Roots. Our People. Our Forever.</span>
              </div>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-charcoal-900 tracking-tight leading-[1.15]">
                Every Family Has a <span className="text-gold-600 italic">Story</span> Worth Preserving.
              </h1>
              <p className="text-lg sm:text-xl text-charcoal-700 max-w-2xl leading-relaxed">
                KinKeep is an elegant digital heirloom designed to unite generations. Build your interactive lineage tree, record elder oral histories, preserve wedding albums, and collect memories with instant QR guest sharing.
              </p>
              <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center px-8 py-3.5 rounded-lg text-base font-semibold text-white bg-gold-500 hover:bg-gold-600 shadow-md transition-all transform hover:-translate-y-0.5"
                >
                  Start Your Family Story
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <Link
                  href="#how-it-works"
                  className="inline-flex items-center justify-center px-6 py-3.5 rounded-lg text-base font-medium text-charcoal-800 bg-white hover:bg-ivory-200 border border-border transition-colors shadow-sm"
                >
                  Explore How It Works
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 flex items-center space-x-8 text-xs text-charcoal-700">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-gold-600" />
                  <span>100% Private & Tenant-Isolated</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Heart className="w-4 h-4 text-gold-600" />
                  <span>Culturally Tailored Lineage</span>
                </div>
              </div>
            </div>

            {/* Right Column: Visual Heirloom Montage */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-charcoal-900">
                <div className="aspect-[4/5] relative bg-gradient-to-t from-charcoal-900/90 via-charcoal-900/20 to-transparent flex flex-col justify-end p-6 text-white">
                  {/* Decorative Family Heirloom Visual */}
                  <div className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-40 bg-[url('https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1200&q=80')]" />
                  <div className="relative z-10 space-y-2">
                    <span className="text-xs uppercase tracking-widest text-gold-300 font-medium">The Mekonnen Family Archive</span>
                    <h3 className="font-serif text-2xl font-bold">Four Generations of Heritage</h3>
                    <p className="text-xs text-ivory-200/90 line-clamp-2">
                      From Gondar and Harar to Addis Ababa and the global diaspora, preserving our elders' voices and family milestones.
                    </p>
                  </div>
                </div>
              </div>
              {/* Floating Decorative Badge */}
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg border border-border flex items-center space-x-3 max-w-xs">
                <div className="w-10 h-10 rounded-full bg-gold-100 flex items-center justify-center text-gold-600 font-bold">
                  98%
                </div>
                <div>
                  <h4 className="text-xs font-bold text-charcoal-900">Living Archive</h4>
                  <p className="text-[11px] text-charcoal-700">All photos & voice recordings securely preserved</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRUST BANNER */}
      <section className="bg-white py-12 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-gold-600 mb-2">
            Preserving What Matters Most
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-900 max-w-3xl mx-auto">
            Keeping families connected across oceans, borders, and generations.
          </h2>
        </div>
      </section>

      {/* 3. FOUR CORE FEATURES */}
      <section id="features" className="py-24 bg-ivory-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-900">
              Everything Your Family Needs to Remember Forever
            </h2>
            <p className="text-base text-charcoal-700">
              Not just a flat pedigree chart. KinKeep combines multi-generational genealogy with stories, audio recordings, event guest uploads, and private albums.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1: Family Tree */}
            <div className="bg-white p-8 rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow space-y-4">
              <div className="w-12 h-12 rounded-lg bg-gold-100 text-gold-600 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-charcoal-900">Multi-Gen Family Tree</h3>
              <p className="text-sm text-charcoal-700 leading-relaxed">
                Map complex biological and partner connections. Dynamically calculate kinship titles like Aunt, Uncle, and Cousin relative to you.
              </p>
            </div>

            {/* Feature 2: Oral Histories & Stories */}
            <div className="bg-white p-8 rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow space-y-4">
              <div className="w-12 h-12 rounded-lg bg-gold-100 text-gold-600 flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-charcoal-900">Family Stories & Audio</h3>
              <p className="text-sm text-charcoal-700 leading-relaxed">
                Record elder voices during coffee ceremonies. Capture rich folklore, migrations, and biographical chapters before they are lost.
              </p>
            </div>

            {/* Feature 3: Historical Timelines */}
            <div className="bg-white p-8 rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow space-y-4">
              <div className="w-12 h-12 rounded-lg bg-gold-100 text-gold-600 flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-charcoal-900">Historical Timelines</h3>
              <p className="text-sm text-charcoal-700 leading-relaxed">
                Situate family milestones along a chronological continuum. Supports approximate historical dates (e.g. circa 1932) seamlessly.
              </p>
            </div>

            {/* Feature 4: QR Guest Uploads */}
            <div className="bg-white p-8 rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow space-y-4">
              <div className="w-12 h-12 rounded-lg bg-gold-100 text-gold-600 flex items-center justify-center">
                <QrCode className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-charcoal-900">QR Event Guest Uploads</h3>
              <p className="text-sm text-charcoal-700 leading-relaxed">
                Place a QR code at wedding tables. Guests instantly upload photos directly from their phone with no account registration required.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section id="how-it-works" className="py-20 bg-white border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-gold-600">Simple 3-Step Process</span>
            <h2 className="font-serif text-3xl font-bold text-charcoal-900 mt-2">How KinKeep Works</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-full bg-ivory-100 border-2 border-gold-500 text-gold-700 font-serif font-bold text-2xl mx-auto flex items-center justify-center">
                1
              </div>
              <h3 className="font-serif text-xl font-bold text-charcoal-900">Create Your Family Space</h3>
              <p className="text-sm text-charcoal-700">
                Establish your private workspace, designate origins, and set custom privacy rules for your family members.
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-14 h-14 rounded-full bg-ivory-100 border-2 border-gold-500 text-gold-700 font-serif font-bold text-2xl mx-auto flex items-center justify-center">
                2
              </div>
              <h3 className="font-serif text-xl font-bold text-charcoal-900">Invite Relatives</h3>
              <p className="text-sm text-charcoal-700">
                Grant roles from Viewers to Editors. Grandparents, siblings, and cousins collaborate on a single unified archive.
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-14 h-14 rounded-full bg-ivory-100 border-2 border-gold-500 text-gold-700 font-serif font-bold text-2xl mx-auto flex items-center justify-center">
                3
              </div>
              <h3 className="font-serif text-xl font-bold text-charcoal-900">Preserve Memories</h3>
              <p className="text-sm text-charcoal-700">
                Upload vintage photos, tag family faces, organize albums, and record stories that will be cherished for decades.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PRICING SECTION */}
      <section id="pricing" className="py-24 bg-ivory-100 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-900">
              Choose the Right Space for Your Family
            </h2>
            <p className="text-base text-charcoal-700">
              Transparent plans with generous storage and member quotas. Upgrade or downgrade anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Plan 1: Basic */}
            <div className="bg-white p-8 rounded-xl border border-border shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="font-serif text-xl font-bold text-charcoal-900">Basic Heritage</h3>
                <p className="text-xs text-charcoal-700 mt-1">For small families beginning their archive</p>
                <div className="my-6">
                  <span className="text-3xl font-bold text-charcoal-900">Free</span>
                  <span className="text-xs text-charcoal-700"> / forever</span>
                </div>
                <ul className="space-y-3 text-sm text-charcoal-700">
                  <li className="flex items-center"><Check className="w-4 h-4 text-gold-600 mr-2" /> Up to 50 family tree members</li>
                  <li className="flex items-center"><Check className="w-4 h-4 text-gold-600 mr-2" /> 2 GB private media storage</li>
                  <li className="flex items-center"><Check className="w-4 h-4 text-gold-600 mr-2" /> Basic story editor</li>
                </ul>
              </div>
              <Link href="/register" className="mt-8 block text-center py-2.5 rounded-lg border border-gold-500 text-gold-700 font-medium hover:bg-gold-50 transition-colors">
                Get Started Free
              </Link>
            </div>

            {/* Plan 2: Family Plus (Recommended) */}
            <div className="bg-white p-8 rounded-xl border-2 border-gold-500 shadow-heirloom relative flex flex-col justify-between">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gold-500 text-white text-[11px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
                Most Popular
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-charcoal-900">Family Plus</h3>
                <p className="text-xs text-charcoal-700 mt-1">For active multi-generational families</p>
                <div className="my-6">
                  <span className="text-3xl font-bold text-charcoal-900">350 ETB</span>
                  <span className="text-xs text-charcoal-700"> / month ($9.99 USD)</span>
                </div>
                <ul className="space-y-3 text-sm text-charcoal-700">
                  <li className="flex items-center"><Check className="w-4 h-4 text-gold-600 mr-2" /> Unlimited family tree persons</li>
                  <li className="flex items-center"><Check className="w-4 h-4 text-gold-600 mr-2" /> 50 GB high-res photo & audio storage</li>
                  <li className="flex items-center"><Check className="w-4 h-4 text-gold-600 mr-2" /> Unlimited event QR guest uploads</li>
                  <li className="flex items-center"><Check className="w-4 h-4 text-gold-600 mr-2" /> Elder audio oral recording archive</li>
                </ul>
              </div>
              <Link href="/register" className="mt-8 block text-center py-2.5 rounded-lg bg-gold-500 hover:bg-gold-600 text-white font-semibold shadow-sm transition-all">
                Start 14-Day Free Trial
              </Link>
            </div>

            {/* Plan 3: Premium Clan */}
            <div className="bg-white p-8 rounded-xl border border-border shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="font-serif text-xl font-bold text-charcoal-900">Premium Clan</h3>
                <p className="text-xs text-charcoal-700 mt-1">For large extended clans and reunions</p>
                <div className="my-6">
                  <span className="text-3xl font-bold text-charcoal-900">950 ETB</span>
                  <span className="text-xs text-charcoal-700"> / month ($24.99 USD)</span>
                </div>
                <ul className="space-y-3 text-sm text-charcoal-700">
                  <li className="flex items-center"><Check className="w-4 h-4 text-gold-600 mr-2" /> Unlimited workspace members & guests</li>
                  <li className="flex items-center"><Check className="w-4 h-4 text-gold-600 mr-2" /> 250 GB video, audio & photo storage</li>
                  <li className="flex items-center"><Check className="w-4 h-4 text-gold-600 mr-2" /> High-definition video streaming</li>
                  <li className="flex items-center"><Check className="w-4 h-4 text-gold-600 mr-2" /> Priority customer support</li>
                </ul>
              </div>
              <Link href="/register" className="mt-8 block text-center py-2.5 rounded-lg border border-gold-500 text-gold-700 font-medium hover:bg-gold-50 transition-colors">
                Contact Clan Concierge
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FINAL CTA */}
      <section className="py-20 bg-charcoal-900 text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight">
            Your Family's Story Deserves to Be Remembered.
          </h2>
          <p className="text-base sm:text-lg text-ivory-200/90 max-w-2xl mx-auto leading-relaxed">
            Begin archiving your family's heritage today. Invite grandparents, capture stories, and hand down an heirloom that endures for generations.
          </p>
          <div className="pt-4">
            <Link
              href="/register"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-lg text-base font-semibold text-charcoal-900 bg-gold-400 hover:bg-gold-300 shadow-lg transition-all transform hover:-translate-y-0.5"
            >
              Create Your Family Archive
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
