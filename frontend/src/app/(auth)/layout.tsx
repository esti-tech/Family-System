import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-ivory-100">
      {/* LEFT COLUMN: Cinematic Cultural Montage (Desktop Only) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-charcoal-900 overflow-hidden items-end p-12">
        {/* Background Visual Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-45 mix-blend-overlay filter brightness-90"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1400&q=80')"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900 via-charcoal-900/60 to-transparent" />

        {/* Content */}
        <div className="relative z-10 space-y-6 text-white max-w-lg">
          <Link href="/" className="inline-flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-full bg-gold-500 flex items-center justify-center text-white font-serif font-bold text-xl shadow-md">
              K
            </div>
            <span className="font-serif font-bold text-2xl tracking-tight text-white">
              KinKeep
            </span>
          </Link>

          <div className="space-y-3">
            <div className="inline-flex items-center space-x-2 text-[11px] uppercase tracking-widest text-gold-300 font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>O U R &nbsp; R O O T S . &nbsp; O U R &nbsp; P E O P L E . &nbsp; O U R &nbsp; F O R E V E R .</span>
            </div>
            <h2 className="font-serif text-4xl font-bold leading-tight">
              Every Family Has a Story Worth Preserving.
            </h2>
            <p className="text-sm text-ivory-200/90 leading-relaxed">
              Connect generations, safeguard precious elder memories, and pass down your living heritage in a secure, private digital vault.
            </p>
          </div>

          <div className="pt-4 border-t border-charcoal-700/80 text-xs text-ivory-300/70 flex items-center justify-between">
            <span>Privately hosted & tenant isolated</span>
            <span className="italic font-serif">Made for families everywhere</span>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Interactive Form Container */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-12 py-12">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}
