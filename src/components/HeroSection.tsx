import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Flame, Coins, TrendingUp } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);
  const { t, language } = useLanguage();

  useEffect(() => {
    setMounted(true);
    console.log("HeroSection - Language:", language);
    console.log("HeroSection - Translation test:", t("hero.title1"));
  }, [language, t]);

  if (!mounted) return null;

  const heroTexts = {
    title1: language === "zh" ? "销毁代币，" : "Burn Tokens,",
    title2: language === "zh" ? "赚取 SOL" : "Earn SOL",
    subtitle:
      language === "zh"
        ? "官方 Bonk 黑客马拉松项目。销毁您不需要的代币，立即获得 $SOL 奖励。"
        : "Official Bonk Hackathon project. Burn your unwanted tokens and receive $SOL rewards instantly.",
    feature1: language === "zh" ? "即时销毁" : "Instant Burn",
    feature2: language === "zh" ? "SOL 奖励" : "SOL Rewards",
    feature3: language === "zh" ? "验证安全" : "Verified Safe",
    card1: {
      title: language === "zh" ? "销毁代币" : "Burn Tokens",
      desc: language === "zh" ? "选择不需要的代币" : "Select unwanted tokens",
    },
    card2: {
      title: language === "zh" ? "赚取 SOL" : "Earn SOL",
      desc: language === "zh" ? "获得即时奖励" : "Receive instant rewards",
    },
    card3: {
      title: language === "zh" ? "闪电般快速" : "Lightning Fast",
      desc: language === "zh" ? "快速交易" : "Quick transactions",
    },
  };

  return (
    <section className="bg-hero-gradient relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute top-10 left-10 w-20 h-20 bg-primary-white rounded-full animate-float"
          style={{ animationDelay: "0s" }}
        />
        <div
          className="absolute top-20 right-20 w-16 h-16 bg-primary-white rounded-full animate-float"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute bottom-20 left-1/4 w-12 h-12 bg-primary-white rounded-full animate-float"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute bottom-10 right-1/3 w-24 h-24 bg-primary-white rounded-full animate-float"
          style={{ animationDelay: "0.5s" }}
        />
      </div>

      <div className="relative px-section-x py-16 md:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Hero text */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-6"
            >
              <motion.h1
                className="text-4xl md:text-6xl font-bold text-black leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                {heroTexts.title1}
                <br />
                <span className="text-primary-red">{heroTexts.title2}</span>
              </motion.h1>

              <motion.p
                className="text-lg md:text-xl text-black/80 max-w-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                {heroTexts.subtitle}
              </motion.p>

              <motion.div
                className="flex items-center space-x-6 text-black/70"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <div className="flex items-center space-x-2">
                  <Flame className="w-5 h-5 text-primary-red" />
                  <span className="font-medium">{heroTexts.feature1}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Coins className="w-5 h-5 text-primary-orange" />
                  <span className="font-medium">{heroTexts.feature2}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-primary-yellow-secondary" />
                  <span className="font-medium">{heroTexts.feature3}</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Animated cards */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="grid grid-cols-1 gap-4"
            >
              {[
                {
                  delay: 0,
                  icon: "🔥",
                  title: heroTexts.card1.title,
                  desc: heroTexts.card1.desc,
                },
                {
                  delay: 0.2,
                  icon: "💰",
                  title: heroTexts.card2.title,
                  desc: heroTexts.card2.desc,
                },
                {
                  delay: 0.4,
                  icon: "⚡",
                  title: heroTexts.card3.title,
                  desc: heroTexts.card3.desc,
                },
              ].map((card, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.6 + card.delay,
                    type: "spring",
                    stiffness: 100,
                  }}
                  className="bg-primary-white/90 backdrop-blur-sm rounded-large p-6 shadow-lg hover:shadow-xl transition-all duration-300 group hover:scale-105"
                >
                  <div className="flex items-start space-x-4">
                    <div className="text-3xl group-hover:scale-110 transition-transform duration-300">
                      {card.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-black text-lg">
                        {card.title}
                      </h3>
                      <p className="text-black/70">{card.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="w-full h-12 md:h-16 fill-primary-white"
        >
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" />
        </svg>
      </div>
    </section>
  );
}
