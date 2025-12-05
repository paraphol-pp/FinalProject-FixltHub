import Link from "next/link";
import { Facebook, Twitter, Instagram, Github, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-neutral-950 border-t border-white/5 pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 font-bold text-2xl tracking-tighter mb-4 text-white">
              <div className="bg-linear-to-bl from-pink-500 to-orange-500 px-3 py-1 rounded-lg text-white font-bold shadow-lg shadow-orange-500/20">
                F
              </div>
              <h1 className="text-xl font-bold">FixIt Hub</h1>
            </div>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Empowering communities to report and resolve issues faster
              alongside local authorities.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm tracking-wider uppercase">
              Platform
            </h3>
            <ul className="space-y-3 text-sm text-neutral-400">
              <li>
                <Link
                  href="/"
                  className="hover:text-pink-500 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/report/new"
                  className="hover:text-pink-500 transition-colors"
                >
                  Report Issue
                </Link>
              </li>
              <li>
                <Link
                  href="/report"
                  className="hover:text-pink-500 transition-colors"
                >
                  All Reports
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm tracking-wider uppercase">
              Legal
            </h3>
            <ul className="space-y-3 text-sm text-neutral-400">
              <li>
                <Link
                  href="#"
                  className="hover:text-pink-500 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-pink-500 transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-pink-500 transition-colors"
                >
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm tracking-wider uppercase">
              Connect
            </h3>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center text-neutral-400 hover:bg-pink-500 hover:text-white transition-all duration-300"
              >
                <Facebook size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center text-neutral-400 hover:bg-pink-500 hover:text-white transition-all duration-300"
              >
                <Twitter size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center text-neutral-400 hover:bg-pink-500 hover:text-white transition-all duration-300"
              >
                <Github size={18} />
              </a>
            </div>
            <div className="mt-6 flex items-center gap-2 text-neutral-400 text-sm">
              <Mail size={16} />
              <span>support@fixithub.com</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-neutral-600 text-sm">
            © 2025 FixIt Community. All rights reserved.
          </p>
          <div className="text-neutral-600 text-sm flex items-center gap-1">
            Design inspired by{" "}
            <span className="text-orange-500 font-medium">Paraphol.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
