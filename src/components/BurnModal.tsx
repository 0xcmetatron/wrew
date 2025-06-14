import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { Transaction } from "@solana/web3.js";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Flame,
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  Loader2,
  DollarSign,
} from "lucide-react";
import {
  TokenInfo,
  realBonkBurnAPI,
  BurnResult,
  RewardResult,
} from "@/lib/realApi";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

interface BurnModalProps {
  token: TokenInfo | null;
  isOpen: boolean;
  onClose: () => void;
}

type BurnState = "confirm" | "burning" | "success" | "error";

export default function BurnModal({ token, isOpen, onClose }: BurnModalProps) {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [burnState, setBurnState] = useState<BurnState>("confirm");
  const [burnResult, setBurnResult] = useState<BurnResult | null>(null);
  const [rewardResult, setRewardResult] = useState<RewardResult | null>(null);
  const [error, setError] = useState<string>("");
  const [burnSignature, setBurnSignature] = useState<string>("");
  const { toast } = useToast();
  const { language } = useLanguage();

  // Static translations
  const texts = {
    en: {
      title: "Burn Token",
      amountToBurn: "Amount to burn:",
      estimatedReward: "Estimated reward:",
      tokenContract: "Token contract:",
      verifiedToken: "Verified Token",
      spamToken: "Possible Spam Token",
      warningTitle: "Important Notice",
      warningText:
        "This action will burn ALL your {symbol} tokens. This action is irreversible. Make sure you want to burn all your tokens before proceeding.",
      cancel: "Cancel",
      confirm: "Burn All Tokens",
      burning: "Burning Tokens...",
      processing: "Please wait while we process your transaction",
      processingText: "Processing burn transaction",
      success: "Burn Successful! 🎉",
      successDesc:
        "Your tokens have been burned and you received your SOL reward!",
      viewTransaction: "View reward transaction",
      close: "Close",
      failed: "Burn Failed",
      tryAgain: "Try Again",
    },
    zh: {
      title: "销毁代币",
      amountToBurn: "销毁数量：",
      estimatedReward: "预估奖励：",
      tokenContract: "代币合约：",
      verifiedToken: "已验证代币",
      spamToken: "可能是垃圾代币",
      warningTitle: "重要提醒",
      warningText:
        "此操作将销毁您所有的 {symbol} 代币。此操作不可逆。请确保您想要销毁所有代币后再继续。",
      cancel: "取消",
      confirm: "销毁所有代币",
      burning: "正在销毁代币...",
      processing: "请等待我们处理您的交易",
      processingText: "正在处理销毁交易",
      success: "销毁成功！🎉",
      successDesc: "您的代币已被销毁，您已收到 SOL 奖励！",
      viewTransaction: "查看奖励交易",
      close: "关闭",
      failed: "销毁失败",
      tryAgain: "重试",
    },
  };

  const t = texts[language] || texts.en;

  const resetModal = () => {
    setBurnState("confirm");
    setBurnResult(null);
    setRewardResult(null);
    setError("");
    setBurnSignature("");
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const handleBurn = async () => {
    if (!token || !publicKey) return;

    setBurnState("burning");
    setError("");

    try {
      // Create burn transaction using your API
      const burnResponse = await realBonkBurnAPI.createBurnTransaction(
        publicKey.toBase58(),
        token.mint,
        token.balance * Math.pow(10, token.decimals),
        token.decimals,
      );

      setBurnResult(burnResponse);

      // Deserialize the transaction from base64 using native browser APIs
      const transactionBytes = Uint8Array.from(
        atob(burnResponse.transaction),
        (c) => c.charCodeAt(0),
      );
      const transaction = Transaction.from(transactionBytes);

      // Send transaction to user's wallet for signing and submission
      const signature = await sendTransaction(transaction, connection);
      setBurnSignature(signature);

      // Wait for transaction confirmation - no buffering
      const confirmationResult = await connection.confirmTransaction(
        signature,
        "confirmed",
      );

      if (confirmationResult.value.err) {
        throw new Error(`Transaction failed: ${confirmationResult.value.err}`);
      }
      // Process reward after successful burn
      const rewardResponse = await realBonkBurnAPI.processReward(
        publicKey.toBase58(),
        signature,
        token.symbol,
        token.balance,
      );

      setRewardResult(rewardResponse);

      if (rewardResponse.success) {
        setBurnState("success");
        toast({
          title: t.success,
          description: `You received ${rewardResponse.rewardAmount} SOL as a reward!`,
        });
      } else {
        setBurnState("error");
        setError(rewardResponse.message);
      }
    } catch (err) {
      setBurnState("error");
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
      toast({
        title: t.failed,
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  if (!token) return null;

  const tokenAmount = realBonkBurnAPI.formatTokenAmount(
    token.balance * Math.pow(10, token.decimals),
    token.decimals,
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Flame className="w-6 h-6 text-primary-orange" />
            <span>{t.title}</span>
          </DialogTitle>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {burnState === "confirm" && (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Token Info */}
              <div className="bg-neutral-background-gray/50 rounded-large p-4">
                <div className="flex items-center space-x-4">
                  {token.logo ? (
                    <img
                      src={token.logo}
                      alt={token.symbol}
                      className="w-12 h-12 rounded-full"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-hero-gradient flex items-center justify-center text-xl font-bold">
                      {token.symbol.slice(0, 1)}
                    </div>
                  )}
                  <div className="flex-1">
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
                    <p className="text-sm text-neutral-medium-gray">
                      {token.name}
                    </p>
                  </div>
                </div>
              </div>

              {/* Burn Details */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-neutral-medium-gray">
                    {t.amountToBurn}
                  </span>
                  <span className="font-semibold text-black">
                    {tokenAmount} {token.symbol}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-neutral-medium-gray">
                    {t.estimatedReward}
                  </span>
                  <div className="flex items-center space-x-1 text-primary-orange font-semibold">
                    <DollarSign className="w-4 h-4" />
                    <span>0.004 SOL (~$1)</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-neutral-medium-gray">
                    {t.tokenContract}
                  </span>
                  <a
                    href={`https://solscan.io/token/${token.mint}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-orange hover:text-primary-orange/80 text-sm flex items-center space-x-1"
                  >
                    <span>{realBonkBurnAPI.shortenAddress(token.mint)}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Status Badges */}
              <div className="flex flex-wrap gap-2">
                {token.isVerified && (
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800"
                  >
                    {t.verifiedToken}
                  </Badge>
                )}
                {token.possibleSpam && (
                  <Badge
                    variant="secondary"
                    className="bg-yellow-100 text-yellow-800"
                  >
                    {t.spamToken}
                  </Badge>
                )}
              </div>

              {/* Warning */}
              <div className="bg-primary-orange/10 border border-primary-orange/20 rounded-large p-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-primary-orange mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-black mb-1">
                      {t.warningTitle}
                    </p>
                    <p className="text-neutral-medium-gray">
                      {t.warningText.replace("{symbol}", token.symbol)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <Button
                  onClick={handleClose}
                  variant="outline"
                  className="flex-1"
                >
                  {t.cancel}
                </Button>
                <Button onClick={handleBurn} className="flex-1 burn-button">
                  <Flame className="w-4 h-4 mr-2" />
                  {t.confirm}
                </Button>
              </div>
            </motion.div>
          )}

          {burnState === "burning" && (
            <motion.div
              key="burning"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-8"
            >
              <div className="animate-glow mx-auto w-20 h-20 bg-hero-gradient rounded-full flex items-center justify-center mb-6">
                <Flame className="w-10 h-10 text-white animate-bounce" />
              </div>
              <h3 className="text-xl font-semibold text-black mb-2">
                {t.burning}
              </h3>
              <p className="text-neutral-medium-gray mb-4">{t.processing}</p>
              <div className="flex items-center justify-center space-x-2 text-primary-orange">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">{t.processingText}</span>
              </div>
            </motion.div>
          )}

          {burnState === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-8"
            >
              <div className="mx-auto w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-black mb-2">
                {t.success}
              </h3>
              <p className="text-neutral-medium-gray mb-4">{t.successDesc}</p>

              {/* Burn Transaction Link */}
              {burnSignature && (
                <div className="bg-blue-50 border border-blue-200 rounded-large p-4 mb-4">
                  <a
                    href={`https://solscan.io/tx/${burnSignature}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 text-sm flex items-center justify-center space-x-1"
                  >
                    <span>View burn transaction</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

              {rewardResult && (
                <div className="bg-green-50 border border-green-200 rounded-large p-4 mb-6">
                  <div className="flex items-center justify-center space-x-2 text-green-800 mb-2">
                    <DollarSign className="w-5 h-5" />
                    <span className="font-semibold">
                      +{rewardResult.rewardAmount} SOL
                    </span>
                  </div>
                  {rewardResult.rewardSignature && (
                    <a
                      href={`https://solscan.io/tx/${rewardResult.rewardSignature}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:text-green-700 text-sm flex items-center justify-center space-x-1"
                    >
                      <span>{t.viewTransaction}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              )}

              <Button onClick={handleClose} className="burn-button">
                {t.close}
              </Button>
            </motion.div>
          )}

          {burnState === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-8"
            >
              <div className="mx-auto w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mb-6">
                <AlertTriangle className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-black mb-2">
                {t.failed}
              </h3>
              <p className="text-neutral-medium-gray mb-4">{error}</p>

              <div className="flex space-x-3">
                <Button
                  onClick={handleClose}
                  variant="outline"
                  className="flex-1"
                >
                  {t.close}
                </Button>
                <Button
                  onClick={() => setBurnState("confirm")}
                  className="flex-1 burn-button"
                >
                  {t.tryAgain}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
