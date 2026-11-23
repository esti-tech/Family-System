import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[#F6F1E9] text-[#2B2B2B] pt-20 pb-12 border-t border-[#EAE3D6]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-16">
          {/* Brand Info */}
          <div className="md:col-span-4 space-y-4">
            <Link href="/" className="inline-block">
              <span className="font-serif font-bold text-3xl text-[#2B2B2B]">
                KinKeep
              </span>
            </Link>
            <div className="space-y-1 text-sm text-[#5A5A5A]">
              <p>A home for your roots.</p>
              <p>A legacy for the ones you love.</p>
            </div>
          </div>

          {/* Explore */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#2B2B2B]">
              EXPLORE
            </h4>
            <ul className="space-y-3 text-sm text-[#5A5A5A]">
              <li>
                <Link href="/" className="hover:text-[#C18B58] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="#features" className="hover:text-[#C18B58] transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#how-it-works" className="hover:text-[#C18B58] transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="hover:text-[#C18B58] transition-colors">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* KinKeep */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#2B2B2B]">
              KINKEEP
            </h4>
            <ul className="space-y-3 text-sm text-[#5A5A5A]">
              <li>
                <Link href="#heritage" className="hover:text-[#C18B58] transition-colors">
                  About
                </Link>
              </li>
              <li>
                <a href="mailto:hello@kinkeep.com" className="hover:text-[#C18B58] transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <Link href="/help" className="hover:text-[#C18B58] transition-colors">
                  Help
                </Link>
              </li>
            </ul>
          </div>

          {/* Get In Touch */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#2B2B2B]">
              GET IN TOUCH
            </h4>
            <ul className="space-y-3 text-sm text-[#5A5A5A]">
              <li>
                <a href="mailto:hello@kinkeep.com" className="hover:text-[#C18B58] transition-colors">
                  hello@kinkeep.com
                </a>
              </li>
              <li>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#C18B58] transition-colors inline-flex items-center">
                  Instagram <span className="ml-1 text-xs">↗</span>
                </a>
              </li>
              <li>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#C18B58] transition-colors inline-flex items-center">
                  Facebook <span className="ml-1 text-xs">↗</span>
                </a>
              </li>
              <li>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#C18B58] transition-colors inline-flex items-center">
                  YouTube <span className="ml-1 text-xs">↗</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-[#EAE3D6] flex flex-col sm:flex-row items-center justify-between text-xs text-[#7A7A7A] space-y-3 sm:space-y-0">
          <p>© 2026 KinKeep. All stories belong.</p>
          <div className="flex items-center space-x-6">
            <Link href="/privacy" className="hover:text-[#C18B58] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-[#C18B58] transition-colors">
              Terms of Use
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
