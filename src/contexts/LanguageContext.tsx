import React, { createContext, useContext, useState, ReactNode } from "react";

type Language = "en" | "zh";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

// Translations
const translations = {
  en: {
    // Header
    "header.connectWallet": "Connect Wallet",
    "header.language": "EN",

    // Hero Section
    "hero.title1": "Burn Tokens,",
    "hero.title2": "Earn SOL",
    "hero.subtitle":
      "Official Bonk Hackathon project. Burn your unwanted tokens and receive $SOL rewards instantly.",
    "hero.feature1": "Instant Burn",
    "hero.feature2": "SOL Rewards",
    "hero.feature3": "Verified Safe",
    "hero.card1.title": "Burn Tokens",
    "hero.card1.desc": "Select unwanted tokens",
    "hero.card2.title": "Earn SOL",
    "hero.card2.desc": "Receive instant rewards",
    "hero.card3.title": "Lightning Fast",
    "hero.card3.desc": "Quick transactions",

    // Token List
    "tokens.title": "Your Tokens",
    "tokens.subtitle":
      "Select tokens to burn and earn SOL rewards. Only full token amounts can be burned.",
    "tokens.search": "Search tokens...",
    "tokens.filter.all": "All Tokens",
    "tokens.filter.verified": "Verified",
    "tokens.filter.unverified": "Unverified",
    "tokens.filter.spam": "Possible Spam",
    "tokens.connectWallet": "Connect Your Wallet",
    "tokens.connectWalletDesc":
      "Connect your Solana wallet to view and burn your tokens",
    "tokens.noTokens": "No Tokens Found",
    "tokens.noTokensDesc": "No tokens match your search.",
    "tokens.balance": "Balance:",
    "tokens.mint": "Mint:",
    "tokens.burnAll": "Burn All Tokens",

    // Burn Modal
    "burn.title": "Burn Token",
    "burn.amountToBurn": "Amount to burn:",
    "burn.estimatedReward": "Estimated reward:",
    "burn.tokenContract": "Token contract:",
    "burn.verifiedToken": "Verified Token",
    "burn.spamToken": "Possible Spam Token",
    "burn.warning.title": "Important Notice",
    "burn.warning.text":
      "This action will burn ALL your {symbol} tokens. This action is irreversible. Make sure you want to burn all your tokens before proceeding.",
    "burn.cancel": "Cancel",
    "burn.confirm": "Burn All Tokens",
    "burn.burning": "Burning Tokens...",
    "burn.processing": "Please wait while we process your transaction",
    "burn.processingText": "Processing burn transaction",
    "burn.success": "Burn Successful! 🎉",
    "burn.successDesc":
      "Your tokens have been burned and you received your SOL reward!",
    "burn.viewTransaction": "View reward transaction",
    "burn.close": "Close",
    "burn.failed": "Burn Failed",
    "burn.tryAgain": "Try Again",

    // Footer
    "footer.rights": "2025 © BonkBurn! All Rights Reserved.",
    "footer.hackathon": "Official Bonk Hackathon Project",

    // Toast Messages
    "toast.walletConnected": "Wallet Connected! 🎉",
    "toast.walletDisconnected": "Wallet Disconnected",
    "toast.burnSuccess": "Burn Successful! 🔥",
    "toast.burnFailed": "Burn Failed",
    "toast.connectionFailed": "Connection Failed",
  },
  zh: {
    // Header
    "header.connectWallet": "连接钱包",
    "header.language": "中文",

    // Hero Section
    "hero.title1": "销毁代币，",
    "hero.title2": "赚取 SOL",
    "hero.subtitle":
      "官方 Bonk 黑客马拉松项目。销毁您不需要的代币，立即获得 $SOL 奖励。",
    "hero.feature1": "即时销毁",
    "hero.feature2": "SOL 奖励",
    "hero.feature3": "验证安全",
    "hero.card1.title": "销毁代币",
    "hero.card1.desc": "选择不需要的代币",
    "hero.card2.title": "赚取 SOL",
    "hero.card2.desc": "获得即时奖励",
    "hero.card3.title": "闪电般快速",
    "hero.card3.desc": "快速交易",

    // Token List
    "tokens.title": "您的代币",
    "tokens.subtitle":
      "选择要销毁的代币并获得 SOL 奖励。只能销毁全部代币数量。",
    "tokens.search": "搜索代币...",
    "tokens.filter.all": "所有代币",
    "tokens.filter.verified": "已验证",
    "tokens.filter.unverified": "未验证",
    "tokens.filter.spam": "可能是垃圾币",
    "tokens.connectWallet": "连接您的钱包",
    "tokens.connectWalletDesc": "连接您的 Solana 钱包以查看和销毁您的代币",
    "tokens.noTokens": "未找到代币",
    "tokens.noTokensDesc": "没有代币匹配您的搜索。",
    "tokens.balance": "余额：",
    "tokens.mint": "铸币：",
    "tokens.burnAll": "销毁所有代币",

    // Burn Modal
    "burn.title": "销毁代币",
    "burn.amountToBurn": "销毁数量：",
    "burn.estimatedReward": "预估奖励：",
    "burn.tokenContract": "代币合约：",
    "burn.verifiedToken": "已验证代币",
    "burn.spamToken": "可能是垃圾代币",
    "burn.warning.title": "重要提醒",
    "burn.warning.text":
      "此操作将销毁您所有的 {symbol} 代币。此操作不可逆。请确保您想要销毁所有代币后再继续。",
    "burn.cancel": "取消",
    "burn.confirm": "销毁所有代币",
    "burn.burning": "正在销毁代币...",
    "burn.processing": "请等待我们处理您的交易",
    "burn.processingText": "正在处理销毁交易",
    "burn.success": "销毁成功！🎉",
    "burn.successDesc": "您的代币已被销毁，您已收到 SOL 奖励！",
    "burn.viewTransaction": "查看奖励交易",
    "burn.close": "关闭",
    "burn.failed": "销毁失败",
    "burn.tryAgain": "重试",

    // Footer
    "footer.rights": "2025 © BonkBurn! 保留所有权利。",
    "footer.hackathon": "官方 Bonk 黑客马拉松项目",

    // Toast Messages
    "toast.walletConnected": "钱包已连接！🎉",
    "toast.walletDisconnected": "钱包已断开连接",
    "toast.burnSuccess": "销毁成功！🔥",
    "toast.burnFailed": "销毁失败",
    "toast.connectionFailed": "连接失败",
  },
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
}) => {
  const [language, setLanguage] = useState<Language>("en");

  const t = (key: string): string => {
    if (!key || typeof key !== "string") {
      return "";
    }

    try {
      // Get the translation object for current language
      const languageTranslations = translations[language];
      if (!languageTranslations) {
        return key;
      }

      // Split the key and traverse the object
      const keys = key.split(".");
      let value: any = languageTranslations;

      for (const k of keys) {
        if (value && typeof value === "object" && k in value) {
          value = value[k];
        } else {
          value = undefined;
          break;
        }
      }

      // If we found a string value, return it
      if (typeof value === "string") {
        return value;
      }

      // Fallback to English if not found and not already English
      if (language !== "en") {
        const englishTranslations = translations.en;
        let fallbackValue: any = englishTranslations;

        for (const k of keys) {
          if (
            fallbackValue &&
            typeof fallbackValue === "object" &&
            k in fallbackValue
          ) {
            fallbackValue = fallbackValue[k];
          } else {
            fallbackValue = undefined;
            break;
          }
        }

        if (typeof fallbackValue === "string") {
          return fallbackValue;
        }
      }

      // Return the key if no translation found
      return key;
    } catch (error) {
      console.error("Translation error for key:", key, error);
      return key;
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
