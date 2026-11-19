"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-ivory-100/90 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-full bg-gold-500 flex items-center justify-center text-white font-serif font-bold text-xl shadow-card group-hover:bg-gold-600 transition-colors">
              K
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-2xl tracking-tight text-charcoal-900">
                KinKeep
              </span>
              <span className="text-[10px] tracking-widest uppercase text-gold-600 font-medium -mt-1">
                Family Heritage
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-sm font-medium text-charcoal-900 hover:text-gold-600 transition-colors">
              Home
            </Link>
            <Link href="#features" className="text-sm font-medium text-charcoal-700 hover:text-gold-600 transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium text-charcoal-700 hover:text-gold-600 transition-colors">
              How It Works
            </Link>
            <Link href="#heritage" className="text-sm font-medium text-charcoal-700 hover:text-gold-600 transition-colors">
              Heritage
            </Link>
            <Link href="#pricing" className="text-sm font-medium text-charcoal-700 hover:text-gold-600 transition-colors">
              Pricing
            </Link>
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/login"
              className="text-sm font-medium text-charcoal-900 hover:text-gold-600 px-4 py-2 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-gold-500 hover:bg-gold-600 shadow-sm transition-all transform hover:-translate-y-0.5"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-charcoal-700 hover:text-charcoal-900 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-border px-4 pt-2 pb-6 space-y-3">
          <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-base font-medium text-charcoal-900">
            Home
          </Link>
          <Link href="#features" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-base font-medium text-charcoal-700">
            Features
          </Link>
          <Link href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-base font-medium text-charcoal-700">
            How It Works
          </Link>
          <Link href="#pricing" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-base font-medium text-charcoal-700">
            Pricing
          </Link>
          <div className="pt-4 border-t border-border flex flex-col space-y-3">
            <Link href="/login" className="block text-center py-2 text-base font-medium text-charcoal-900">
              Sign In
            </Link>
            <Link href="/register" className="block text-center py-2.5 rounded-lg text-base font-medium text-white bg-gold-500">
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
