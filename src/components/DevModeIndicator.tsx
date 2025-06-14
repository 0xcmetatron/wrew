import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle } from "lucide-react";

export default function DevModeIndicator() {
  const [isDev, setIsDev] = useState(false);

  useEffect(() => {
    setIsDev(import.meta.env.DEV || window.location.hostname === "localhost");
  }, []);

  if (!isDev) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      <Badge
        variant="outline"
        className="bg-green-100 text-green-800 border-green-300 flex items-center gap-2"
      >
        <CheckCircle className="w-4 h-4" />
        Dev Mode - Mock APIs Active
      </Badge>
    </div>
  );
}
