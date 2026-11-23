"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#F6F1E9]/95 backdrop-blur-sm border-b border-[#EAE3D6]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="font-serif font-bold text-2xl tracking-tight text-[#2B2B2B]">
              KinKeep
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-9">
            <Link
              href="/"
              className="text-sm font-medium text-[#2B2B2B] hover:text-[#C18B58] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#C18B58]"
            >
              Home
            </Link>
            <Link
              href="#features"
              className="text-sm font-medium text-[#5A5A5A] hover:text-[#C18B58] transition-colors"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm font-medium text-[#5A5A5A] hover:text-[#C18B58] transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium text-[#5A5A5A] hover:text-[#C18B58] transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="#heritage"
              className="text-sm font-medium text-[#5A5A5A] hover:text-[#C18B58] transition-colors"
            >
              About
            </Link>
            <Link
              href="/login"
              className="text-sm font-medium text-[#2B2B2B] hover:text-[#C18B58] transition-colors"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-md text-sm font-medium text-white bg-[#C18B58] hover:bg-[#b07d4b] shadow-sm transition-all"
            >
              Get Started
            </Link>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-[#2B2B2B] hover:text-[#C18B58] focus:outline-none"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#F6F1E9] border-b border-[#EAE3D6] px-6 pt-3 pb-6 space-y-3">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-[#2B2B2B]"
          >
            Home
          </Link>
          <Link
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-[#5A5A5A]"
          >
            Features
          </Link>
          <Link
            href="#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-[#5A5A5A]"
          >
            How It Works
          </Link>
          <Link
            href="#pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-[#5A5A5A]"
          >
            Pricing
          </Link>
          <Link
            href="#heritage"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-[#5A5A5A]"
          >
            About
          </Link>
          <div className="pt-3 border-t border-[#EAE3D6] flex flex-col space-y-3">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-center py-2 text-base font-medium text-[#2B2B2B]"
            >
              Login
            </Link>
            <Link
              href="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-center py-2.5 rounded-md text-base font-medium text-white bg-[#C18B58]"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
