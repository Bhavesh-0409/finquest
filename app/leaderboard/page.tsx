"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

type User = {
  name: string;
  email: string;
  character: string;
  xp: number;
  streak?: number;
  lastLoginDate?: string | null;
};

// Leaderboard will be generated dynamically with user's position

const characterImages: Record<string, string> = {
  explorer: "/characters/explorer.png",
  strategist: "/characters/strategist.png",
  dreamer: "/characters/dreamer.png",
  realist: "/characters/realist.png",
};

export default function LeaderboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("finstinct-user");
    if (!storedUser) {
      router.replace("/");
    } else {
      setUser(JSON.parse(storedUser));
      setChecking(false);
    }
  }, [router]);

  if (checking || !user) return null;

  // Generate leaderboard with specific names
  const generateLeaderboard = () => {
    const leaderboard = [
      { name: "Bhavesh", xp: 280, leaderboard_position: 1 },
      { name: "Lasya", xp: 250, leaderboard_position: 2 },
      { name: user.name, xp: user.xp || 0, leaderboard_position: 3 },
    ];
    
    // Sort by XP (descending) and update positions
    leaderboard.sort((a, b) => b.xp - a.xp);
    leaderboard.forEach((entry, index) => {
      entry.leaderboard_position = index + 1;
    });
    
    return leaderboard;
  };

  const leaderboard = generateLeaderboard();

  return (
    <div className="min-h-screen pt-20">
      {/* 🔝 TOP BAR */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/60 backdrop-blur-md border-b border-white/10">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between gap-6">
          {/* Player Info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-800">
              <Image
                src={characterImages[user.character]}
                alt={user.character}
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
            <div>
              <p className="text-sm font-bold">{user.name}</p>
              <p className="text-xs text-gray-400 capitalize">
                {user.character}
              </p>
            </div>
          </div>

          {/* Center Tabs */}
          <nav className="flex items-center gap-4 text-sm font-medium">
            <Link
              href="/dashboard"
              className="px-3 py-1.5 rounded-full text-gray-300 hover:text-white hover:bg-white/10 border border-transparent"
            >
              Dashboard
            </Link>
            <Link
              href="/leaderboard"
              className="px-3 py-1.5 rounded-full bg-white/10 text-white border border-white/20 shadow-sm"
            >
              Leaderboard
            </Link>
          </nav>

          {/* XP and Streak */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-yellow-400/90 text-black px-4 py-1.5 rounded-full font-bold shadow">
              ⭐ {user.xp} XP
            </div>
            <div className="flex items-center gap-2 bg-orange-500/90 text-white px-4 py-1.5 rounded-full font-bold shadow">
              🔥 {user.streak || 0} Day Streak
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={() => {
              localStorage.removeItem("finstinct-user");
              router.replace("/");
            }}
            className="text-sm text-red-400 hover:text-red-300"
          >
            Logout
          </button>
        </div>
      </div>

      {/* 🏆 Leaderboard Content */}
      <main className="max-w-3xl mx-auto px-6 mt-10">
        <h1 className="text-3xl font-black mb-6 text-center">Leaderboard</h1>
        <p className="text-sm text-gray-400 mb-6 text-center">
          See how you stack up against other Finstinct adventurers.
        </p>

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur">
          <div className="grid grid-cols-4 px-4 py-3 text-xs font-semibold text-gray-400 border-b border-white/10">
            <span>#</span>
            <span>Player</span>
            <span className="text-right">XP</span>
            <span className="text-right">Badge</span>
          </div>

          <ul>
            {leaderboard.length === 0 ? (
              <li className="px-4 py-8 text-center text-gray-400">
                No players yet. Be the first!
              </li>
            ) : (
              leaderboard.map((entry) => {
                const isCurrentUser = entry.name === user.name;
                return (
                  <li
                    key={entry.leaderboard_position}
                    className={`grid grid-cols-4 px-4 py-3 text-sm items-center ${
                      isCurrentUser
                        ? "bg-yellow-400/5 border-l-4 border-yellow-400"
                        : "border-l-4 border-transparent"
                    }`}
                  >
                    <span className="font-bold text-gray-200">
                      #{entry.leaderboard_position}
                    </span>
                    <span
                      className={`${
                        isCurrentUser ? "text-yellow-300 font-semibold" : "text-gray-200"
                      }`}
                    >
                      {isCurrentUser ? "You" : entry.name}
                    </span>
                    <span className="text-right text-gray-100">
                      {entry.xp} XP
                    </span>
                    <span className="text-right text-xs text-gray-300">
                      {entry.leaderboard_position === 1
                        ? "🥇 Champion"
                        : entry.leaderboard_position === 2
                        ? "🥈 Runner-up"
                        : entry.leaderboard_position === 3
                        ? "🥉 Third"
                        : "⭐ Player"}
                    </span>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      </main>
    </div>
  );
}
