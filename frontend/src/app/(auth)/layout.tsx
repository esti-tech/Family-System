import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-ivory-100">
      {/* LEFT COLUMN: Cinematic Ethiopian Family Montage (Desktop Only) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-charcoal-900 overflow-hidden items-end p-12">
        {/* Exact Ethiopian Family Image from Figma Design */}
        <div 
          className="absolute inset-0 bg-cover bg-center filter brightness-95"
          style={{
            backgroundImage: "url('/assets/images/auth-family-split.jpeg')"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900 via-charcoal-900/40 to-transparent" />

        {/* Content */}
        <div className="relative z-10 space-y-6 text-white max-w-lg">
          <Link href="/" className="inline-flex items-center space-x-3 group">
            <span className="font-serif font-bold text-3xl tracking-tight text-white">
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
