import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useWallet } from "@solana/wallet-adapter-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  Flame,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
} from "lucide-react";
import { TokenInfo, realBonkBurnAPI } from "@/lib/realApi";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

interface TokenListProps {
  onBurnToken: (token: TokenInfo) => void;
}

export default function TokenList({ onBurnToken }: TokenListProps) {
  const { connected, publicKey } = useWallet();
  const [tokens, setTokens] = useState<TokenInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const { toast } = useToast();
  const { language } = useLanguage();

  // Static translations to avoid context issues
  const texts = {
    en: {
      title: "Your Tokens",
      subtitle:
        "Select tokens to burn and earn SOL rewards. Only full token amounts can be burned.",
      search: "Search tokens...",
      filterAll: "All Tokens",
      filterVerified: "Verified",
      filterUnverified: "Unverified",
      filterSpam: "Possible Spam",
      connectWallet: "Connect Your Wallet",
      connectWalletDesc:
        "Connect your Solana wallet to view and burn your tokens",
      noTokens: "No Tokens Found",
      noTokensDesc: "No tokens match your search.",
      balance: "Balance:",
      mint: "Mint:",
      burnAll: "Burn All Tokens",
      verifiedToken: "Verified Token",
      spamToken: "Possible Spam Token",
    },
    zh: {
      title: "您的代币",
      subtitle: "选择要销毁的代币并获得 SOL 奖励。只能销毁全部代币数量。",
      search: "搜索代币...",
      filterAll: "所有代币",
      filterVerified: "已验证",
      filterUnverified: "未验证",
      filterSpam: "可能是垃圾币",
      connectWallet: "连接您的钱包",
      connectWalletDesc: "连接您的 Solana 钱包以查看和销毁您的代币",
      noTokens: "未找到代币",
      noTokensDesc: "没有代币匹配您的搜索。",
      balance: "余额：",
      mint: "铸币：",
      burnAll: "销毁所有代币",
      verifiedToken: "已验证代币",
      spamToken: "可能是垃圾代币",
    },
  };

  const t = texts[language] || texts.en;

  const filters = [
    { id: "all", label: t.filterAll, count: tokens.length },
    {
      id: "verified",
      label: t.filterVerified,
      count: tokens.filter((t) => t.isVerified).length,
    },
    {
      id: "unverified",
      label: t.filterUnverified,
      count: tokens.filter((t) => !t.isVerified && !t.possibleSpam).length,
    },
    {
      id: "spam",
      label: t.filterSpam,
      count: tokens.filter((t) => t.possibleSpam).length,
    },
  ];

  const fetchTokens = async (force = false) => {
    if (!publicKey || !connected) return;

    setLoading(true);
    try {
      // Clear any cached tokens if force refresh
      if (force) {
        setTokens([]);
      }

      const fetchedTokens = await realBonkBurnAPI.fetchUserTokens(
        publicKey.toBase58(),
      );
      setTokens(fetchedTokens);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch your tokens. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (connected && publicKey) {
      fetchTokens(true);

      // Set up real-time refresh every 10 seconds
      const interval = setInterval(() => {
        fetchTokens();
      }, 10000);

      return () => clearInterval(interval);
    }
  }, [connected, publicKey]);

  const filteredTokens = tokens.filter((token) => {
    const matchesSearch =
      token.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      token.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      activeFilter === "all" ||
      (activeFilter === "verified" && token.isVerified) ||
      (activeFilter === "unverified" &&
        !token.isVerified &&
        !token.possibleSpam) ||
      (activeFilter === "spam" && token.possibleSpam);

    return matchesSearch && matchesFilter;
  });

  const SkeletonCard = () => (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Skeleton className="w-12 h-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>
        <div className="text-right space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-20" />
        </div>
      </div>
    </Card>
  );

  if (!connected) {
    return (
      <section className="px-section-x py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-neutral-background-gray/50 rounded-large p-12">
            <Flame className="w-16 h-16 text-neutral-medium-gray mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-black mb-2">
              {t.connectWallet}
            </h3>
            <p className="text-neutral-medium-gray">{t.connectWalletDesc}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="px-section-x py-16 bg-primary-white">
      <div className="max-w-6xl mx-auto">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-medium-gray w-5 h-5" />
            <Input
              placeholder={t.search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 rounded-large border-neutral-gray"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <Button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                variant="outline"
                size="sm"
                className={`
                  filter-button
                  ${activeFilter === filter.id ? "filter-button-active" : "filter-button-inactive"}
                `}
              >
                {filter.label} ({filter.count})
              </Button>
            ))}
          </div>
        </div>

        {/* Section Header */}
        <div className="mb-8">
          <h2 className="text-heading font-bold text-black mb-2">{t.title}</h2>
          <p className="text-neutral-medium-gray">{t.subtitle}</p>
        </div>

        {/* Token Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filteredTokens.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-neutral-background-gray/50 rounded-large p-8 max-w-md mx-auto">
              <Flame className="w-12 h-12 text-neutral-medium-gray mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-black mb-2">
                {t.noTokens}
              </h3>
              <p className="text-neutral-medium-gray">
                {searchTerm ? t.noTokensDesc : "No tokens available to burn."}
              </p>
            </div>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {filteredTokens.map((token, index) => (
              <motion.div
                key={token.mint}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="p-6 hover:shadow-lg transition-all duration-300 group hover:border-primary-orange/50">
                  <div className="space-y-4">
                    {/* Token Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {token.logo ? (
                          <img
                            src={token.logo}
                            alt={token.symbol}
                            className="w-12 h-12 rounded-full"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = "none";
                              target.nextElementSibling?.classList.remove(
                                "hidden",
                              );
                            }}
                          />
                        ) : null}
                        <div
                          className={`w-12 h-12 rounded-full bg-hero-gradient flex items-center justify-center text-xl font-bold ${token.logo ? "hidden" : ""}`}
                        >
                          {token.symbol.slice(0, 1)}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold text-black">
                              {token.symbol}
                            </h3>
                            {token.isVerified && (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            )}
                            {token.possibleSpam && (
                              <AlertTriangle className="w-4 h-4 text-yellow-500" />
                            )}
                          </div>
                          <p className="text-sm text-neutral-medium-gray truncate max-w-[120px]">
                            {token.name}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Token Details */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-neutral-medium-gray">
                          {t.balance}
                        </span>
                        <span className="font-semibold text-black">
                          {realBonkBurnAPI.formatTokenAmount(
                            token.balance * Math.pow(10, token.decimals),
                            token.decimals,
                          )}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-neutral-medium-gray">
                          {t.mint}
                        </span>
                        <a
                          href={`https://solscan.io/token/${token.mint}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-orange hover:text-primary-orange/80 text-sm flex items-center space-x-1"
                        >
                          <span>
                            {realBonkBurnAPI.shortenAddress(token.mint)}
                          </span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>

                    {/* Status Badges */}
                    <div className="flex flex-wrap gap-1">
                      {token.isVerified && (
                        <Badge
                          variant="secondary"
                          className="bg-green-100 text-green-800 text-xs"
                        >
                          {t.verifiedToken}
                        </Badge>
                      )}
                      {token.possibleSpam && (
                        <Badge
                          variant="secondary"
                          className="bg-yellow-100 text-yellow-800 text-xs"
                        >
                          {t.spamToken}
                        </Badge>
                      )}
                    </div>

                    {/* Burn Button */}
                    <Button
                      onClick={() => onBurnToken(token)}
                      className="w-full burn-button group-hover:shadow-lg"
                      disabled={token.balance === 0}
                    >
                      <Flame className="w-4 h-4 mr-2" />
                      {t.burnAll}
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
