"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import StockMarketGame from "@/components/StockMarketGame";

export default function StockMarketPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("finstinct-user");
    if (!storedUser) {
      router.replace("/");
    } else {
      setChecking(false);
    }
  }, [router]);

  if (checking) return null;

  return (
    <div className="min-h-screen pt-20">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <StockMarketGame />
      </main>
    </div>
  );
}

