import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-charcoal-900 text-ivory-100 py-16 border-t border-charcoal-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-gold-500 flex items-center justify-center text-white font-serif font-bold text-lg">
                K
              </div>
              <span className="font-serif font-bold text-2xl text-white">KinKeep</span>
            </div>
            <p className="text-sm text-ivory-200/80 leading-relaxed">
              Preserving African and diaspora family histories, oral traditions, and memories for generations to come.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gold-400 mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 text-sm text-ivory-200/80">
              <li><Link href="#features" className="hover:text-gold-400 transition-colors">Family Tree</Link></li>
              <li><Link href="#features" className="hover:text-gold-400 transition-colors">Oral Stories Archive</Link></li>
              <li><Link href="#features" className="hover:text-gold-400 transition-colors">Historical Timelines</Link></li>
              <li><Link href="#features" className="hover:text-gold-400 transition-colors">Event QR Uploads</Link></li>
              <li><Link href="#pricing" className="hover:text-gold-400 transition-colors">Subscription Plans</Link></li>
            </ul>
          </div>

          {/* Heritage & Community */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gold-400 mb-4">
              Cultural Heritage
            </h4>
            <ul className="space-y-2.5 text-sm text-ivory-200/80">
              <li><span className="hover:text-gold-400 cursor-pointer">Patronymic Lineage</span></li>
              <li><span className="hover:text-gold-400 cursor-pointer">Coffee Ceremonies</span></li>
              <li><span className="hover:text-gold-400 cursor-pointer">Elder Oral Recordings</span></li>
              <li><span className="hover:text-gold-400 cursor-pointer">Communal Celebrations</span></li>
            </ul>
          </div>

          {/* Privacy & Trust */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gold-400 mb-4">
              Trust & Privacy
            </h4>
            <p className="text-sm text-ivory-200/80 mb-4">
              Your family archive is private by design. We never sell your photos, memories, or lineage records.
            </p>
            <div className="text-xs text-ivory-300/60 space-x-4">
              <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
              <Link href="/terms" className="hover:underline">Terms of Service</Link>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-charcoal-800 flex flex-col sm:flex-row items-center justify-between text-xs text-ivory-300/60">
          <p>© {new Date().getFullYear()} KinKeep Inc. All rights reserved.</p>
          <p className="mt-4 sm:mt-0 font-serif italic text-gold-400/80">
            "Our Roots. Our People. Our Forever."
          </p>
        </div>
      </div>
    </footer>
  );
}
