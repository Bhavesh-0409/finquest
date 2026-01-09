"use client";

import Image from "next/image";

type FlashCardProps = {
  title: string;
  content: string;
  image: string;
};

export default function FlashCard({ title, content, image }: FlashCardProps) {
  return (
    <div className="w-full max-w-3xl rounded-2xl bg-white shadow-xl border border-slate-200 overflow-hidden">
      <div className="relative w-full h-56 md:h-72 bg-slate-100">
        <Image
          src={image}
          alt={title}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 48rem"
        />
      </div>

      <div className="px-6 py-6 md:px-8 md:py-7 bg-gradient-to-b from-slate-50 to-slate-100">
        <h2 className="text-xl md:text-2xl font-semibold text-slate-900 mb-3">
          {title}
        </h2>
        <p className="text-sm md:text-base text-slate-700 leading-relaxed">
          {content}
        </p>
      </div>
    </div>
  );
}
