import React from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/contexts/LanguageContext";

// Twitter/X SVG Icon
const TwitterIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
  </svg>
);

export default function Header() {
  const { connected } = useWallet();
  const { language, setLanguage, t } = useLanguage();

  // Debug the translation function
  React.useEffect(() => {
    console.log("Header - Language:", language);
    console.log("Header - Translation test:", t("header.language"));
  }, [language, t]);

  return (
    <header className="bg-primary-white border-b border-neutral-gray">
      <div className="px-container-x py-container-y">
        <div className="flex items-center justify-between">
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
            <h1 className="text-brand font-bold text-primary-red tracking-tight">
              LETSBONKBURN
            </h1>
          </div>

          {/* Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Custom styled wallet button */}
            <div className="wallet-adapter-button-wrapper">
              <WalletMultiButton className="!bg-primary-orange !text-white hover:!bg-primary-orange/90 !px-button-x !py-button-y !rounded-medium !font-medium !text-button !transition-all !duration-200 !border-2 !border-primary-orange hover:!border-primary-orange/90" />
            </div>

            {/* Twitter/X Link */}
            <Button
              asChild
              variant="outline"
              size="sm"
              className="px-button-x py-button-y rounded-medium text-button border-neutral-gray text-neutral-medium-gray hover:bg-neutral-background-gray hover:text-primary-orange transition-colors"
            >
              <a
                href="https://x.com/i/communities/1933506841335537838"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2"
              >
                <TwitterIcon />
                <span className="hidden sm:inline">Follow</span>
              </a>
            </Button>

            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="px-button-x py-button-y rounded-medium text-button border-neutral-gray text-neutral-medium-gray hover:bg-neutral-background-gray"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                    <path d="M2 12h20" />
                  </svg>
                  {language === "en" ? "EN" : "中文"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => setLanguage("en")}
                  className={language === "en" ? "bg-primary-yellow/20" : ""}
                >
                  🇺🇸 English
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setLanguage("zh")}
                  className={language === "zh" ? "bg-primary-yellow/20" : ""}
                >
                  🇨🇳 中文
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile menu */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Mobile wallet button */}
            <div className="wallet-adapter-button-wrapper">
              <WalletMultiButton className="!bg-primary-orange !text-white hover:!bg-primary-orange/90 !px-3 !py-2 !rounded-medium !font-medium !text-sm !transition-all !duration-200" />
            </div>

            {/* Mobile menu dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="p-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="4" x2="20" y1="12" y2="12" />
                    <line x1="4" x2="20" y1="6" y2="6" />
                    <line x1="4" x2="20" y1="18" y2="18" />
                  </svg>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <a
                    href="https://x.com/i/communities/1933506841335537838"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2"
                  >
                    <TwitterIcon />
                    <span>Follow on X</span>
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setLanguage(language === "en" ? "zh" : "en")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                    <path d="M2 12h20" />
                  </svg>
                  {language === "en" ? "中文" : "English"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
