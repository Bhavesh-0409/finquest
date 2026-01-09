"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import FlashCard from "./components/FlashCard";
import Level1Game from "@/components/Level1";
import Level3Game from "@/components/Level3";
import Level4Game from "@/components/Level4";
import { level1FlashCards } from "./data";

export default function LevelPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const currentLevel = parseInt(params.id);
  const nextLevel = currentLevel + 1;

  // Determine which game to show based on level
  const getGameComponent = () => {
    if (currentLevel === 1) {
      return <Level1Game />;
    } else if (currentLevel === 3) {
      return <Level3Game />;
    } else if (currentLevel === 4) {
      return <Level4Game />;
    }
    return <p className="p-6">Level coming soon.</p>;
  };

  // For level 3, show game directly (no slides)
  if (params.id === "3") {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-sky-900 text-white flex flex-col items-center px-4 py-10">
        <div className="w-full max-w-4xl space-y-8">
          <header className="text-center space-y-2">
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-300/80">
              Level 3
            </p>
            <h1 className="text-3xl md:text-4xl font-bold">Save or Invest?</h1>
            <p className="text-sm md:text-base text-slate-300">
              Practice making smart financial decisions with real-life scenarios.
            </p>
          </header>

          <section className="space-y-6">
            {getGameComponent()}
          </section>

          <section className="flex justify-center pt-4">
            <Link
              href={`/level/${nextLevel}`}
              className="rounded-full bg-emerald-500 px-6 py-3 text-base font-bold text-slate-950 hover:bg-emerald-400 transition-colors shadow-lg hover:shadow-xl"
            >
              Next Level →
            </Link>
          </section>
        </div>
      </main>
    );
  }

  // For Level 4, show game directly
  if (params.id === "4") {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-sky-900 text-white flex flex-col items-center px-4 py-10">
        <div className="w-full max-w-4xl space-y-8">
          <header className="text-center space-y-2">
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-300/80">
              Level 4
            </p>
            <h1 className="text-3xl md:text-4xl font-bold">Unlocking Growth</h1>
            <p className="text-sm md:text-base text-slate-300">
              Understand the relationship between risk and return.
            </p>
          </header>

          <section className="space-y-6">
            {getGameComponent()}
          </section>

          <section className="flex justify-center pt-4">
            <Link
              href={`/level/${nextLevel}`}
              className="rounded-full bg-emerald-500 px-6 py-3 text-base font-bold text-slate-950 hover:bg-emerald-400 transition-colors shadow-lg hover:shadow-xl"
            >
              Next Level →
            </Link>
          </section>
        </div>
      </main>
    );
  }

  if (params.id !== "1") {
    return <p className="p-6">Level coming soon.</p>;
  }

  const [currentIndex, setCurrentIndex] = useState(0);
  const totalSlides = level1FlashCards.length;
  const currentSlide = level1FlashCards[currentIndex];
  const isLastSlide = currentIndex === totalSlides - 1;
  const [mode, setMode] = useState<"slides" | "game">("slides");

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNext = () => {
    if (isLastSlide) {
      setMode("game");
      return;
    }

    setCurrentIndex((prev) => (prev < totalSlides - 1 ? prev + 1 : prev));
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-sky-900 text-white flex flex-col items-center px-4 py-10">
      <div className="w-full max-w-4xl space-y-8">
        {mode === "slides" && (
          <>
            <header className="text-center space-y-2">
              <p className="text-xs uppercase tracking-[0.2em] text-sky-300/80">
                Level 1
              </p>
              <h1 className="text-3xl md:text-4xl font-bold">
                Budgeting Basics – Visual Walkthrough
              </h1>
              <p className="text-sm md:text-base text-slate-300">
                Move through each slide to see how budgeting changes the story of your money.
              </p>
            </header>

            <section className="flex justify-center">
              <FlashCard
                title={currentSlide.title}
                content={currentSlide.content}
                image={currentSlide.image}
              />
            </section>

            <section className="flex flex-col items-center gap-3">
              <div className="flex items-center gap-4">
                <button
                  onClick={handlePrevious}
                  disabled={currentIndex === 0}
                  className="rounded-full bg-slate-800 px-4 py-2 text-sm font-medium text-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                <span className="text-sm text-slate-200">
                  Slide {currentIndex + 1} of {totalSlides}
                </span>

                <button
                  onClick={handleNext}
                  className="rounded-full bg-emerald-400 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-emerald-300 transition-colors"
                >
                  {isLastSlide ? "Start Mini Game" : "Next"}
                </button>
              </div>
            </section>
          </>
        )}

        {mode === "game" && (
          <>
            <header className="text-center space-y-2">
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-300/80">
                Level {currentLevel}
              </p>
              <h1 className="text-3xl md:text-4xl font-bold">Mini Game</h1>
              <p className="text-sm md:text-base text-slate-300">
                Practice what you learned with this quick interactive game.
              </p>
            </header>

            <section className="space-y-6">
              <Level1Game />
            </section>

            <section className="flex justify-center pt-4">
              <Link
                href={`/level/${nextLevel}`}
                className="rounded-full bg-emerald-500 px-6 py-3 text-base font-bold text-slate-950 hover:bg-emerald-400 transition-colors shadow-lg hover:shadow-xl"
              >
                Next Level →
              </Link>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
