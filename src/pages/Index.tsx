import { useState } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import TokenList from "@/components/TokenList";
import BurnModal from "@/components/BurnModal";
import Footer from "@/components/Footer";
<<<<<<< HEAD
import { TokenInfo } from "@/lib/realApi";
=======
import DevModeIndicator from "@/components/DevModeIndicator";
import { TokenInfo } from "@/lib/api";
>>>>>>> f2baa7371ab17fe613a23ed06ff2cb2b66cff4a2

const Index = () => {
  const [selectedToken, setSelectedToken] = useState<TokenInfo | null>(null);
  const [isBurnModalOpen, setIsBurnModalOpen] = useState(false);

  const handleBurnToken = (token: TokenInfo) => {
    setSelectedToken(token);
    setIsBurnModalOpen(true);
  };

  const handleCloseBurnModal = () => {
    setIsBurnModalOpen(false);
    setSelectedToken(null);
  };

  return (
    <div className="min-h-screen bg-primary-white">
      {/* Development Mode Indicator */}
      <DevModeIndicator />

      {/* Header */}
      <Header />

      {/* Thin divider */}
      <div className="h-px bg-neutral-gray" />

      {/* Hero Section */}
      <HeroSection />

      {/* Token List Section */}
      <TokenList onBurnToken={handleBurnToken} />

      {/* Footer */}
      <Footer />

      {/* Burn Modal */}
      <BurnModal
        token={selectedToken}
        isOpen={isBurnModalOpen}
        onClose={handleCloseBurnModal}
      />
    </div>
  );
};

export default Index;
