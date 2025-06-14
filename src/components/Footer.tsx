import { ExternalLink } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

// Twitter/X SVG Icon
const TwitterIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
  </svg>
);

export default function Footer() {
  const { language } = useLanguage();

  const texts = {
    en: {
      rights: "2025 © LetsBonkBurn! All Rights Reserved.",
      hackathon: "Official Bonk Hackathon Project",
    },
    zh: {
      rights: "2025 © LetsBonkBurn! 保留所有权利。",
      hackathon: "官方 Bonk 黑客马拉松项目",
    },
  };

  const t = texts[language] || texts.en;

  return (
    <footer className="bg-footer-gradient text-white">
      <div className="px-container-x py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-hero-gradient rounded-full flex items-center justify-center">
                {/* Placeholder logo image */}
                <img
                  src="https://via.placeholder.com/32x32/ff5c01/ffffff?text=LB"
                  alt="LetsBonkBurn Logo"
                  className="w-8 h-8 rounded-full"
                  onError={(e) => {
                    // Show emoji if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                    const emoji = target.nextElementSibling as HTMLElement;
                    if (emoji) emoji.style.display = "block";
                  }}
                />
                <span className="text-2xl font-bold hidden">🔥</span>
              </div>
              <h1 className="text-brand font-bold text-primary-yellow tracking-tight">
                LETSBONKBURN
              </h1>
            </div>

            {/* Social Links */}
            <div className="flex justify-center space-x-6">
              <a
                href="https://x.com/i/communities/1933506841335537838"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-white/80 hover:text-primary-yellow transition-colors duration-200"
              >
                <TwitterIcon />
                <span className="hidden sm:inline">Follow Community</span>
              </a>
              <a
                href="https://solscan.io"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-white/80 hover:text-primary-yellow transition-colors duration-200"
              >
                <ExternalLink className="w-5 h-5" />
                <span className="hidden sm:inline">Solscan</span>
              </a>
            </div>

            {/* Copyright */}
            <div className="text-center md:text-right">
              <p className="text-footer text-white/60">{t.rights}</p>
              <p className="text-sm text-white/40 mt-1">{t.hackathon}</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
