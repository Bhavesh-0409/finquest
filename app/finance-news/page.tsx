"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import FinanceNewsList from "@/components/FinanceNewsList";

export default function FinanceNewsPage() {
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
      <main className="max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <div className="mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Finance News
          </h1>
          <p className="text-gray-400 text-sm md:text-base">
            Stay up-to-date with the latest in finance, markets, banking, and
            economic news.
          </p>
        </div>

        <FinanceNewsList limit={10} showHeader={false} />
      </main>
    </div>
  );
}
