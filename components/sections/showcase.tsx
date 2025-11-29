"use client";

import { cn } from "@/lib/utils";
import { Marquee } from "@/components/ui/marquee";
import { Eye } from "lucide-react";
import type { FC } from "react";

// --- Data & Komponen untuk Marquee ---

const screenshots = [
  "/quick-create-2.png",
  "/quick-create-1.png",
  "/tasks.png",
  "/quick-create-1.png",
  "/quick-create-2.png",
  "/tasks.png",
];

// Data untuk 3 kolom di desktop
const firstRow = screenshots.slice(0, 2);
const secondRow = screenshots.slice(2, 4);
const thirdRow = screenshots.slice(4, 6);

const ImageCard: FC<{ imgSrc: string }> = ({ imgSrc }) => {
  return (
    // KUNCI PERBAIKAN #1: Lebar dibuat responsif.
    // w-[80vw] -> lebar 80% dari viewport di layar kecil.
    // max-w-sm -> lebar maksimum di layar kecil.
    // md:w-103 -> kembali ke lebar asli di layar medium ke atas.
    <div className="relative w-[80vw] max-w-sm cursor-pointer overflow-hidden rounded-xl border border-primary/10 p-2 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 mb-8 md:w-103">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imgSrc}
        alt="App screenshot"
        className="w-full h-auto object-cover rounded-lg"
      />
    </div>
  );
};

// --- Komponen Utama Seksi Showcase ---

export const ShowcaseSection: FC = () => {
  return (
    <section id="showcase" className="relative w-full overflow-hidden px-4 py-24">
      {/* Section Header */}
      <div className="container mx-auto max-w-7xl text-center">
        <div className="mb-12 flex flex-col items-center text-center">
          <div className="mb-4 inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary animate-in fade-in-50">
            <Eye className="mr-2 size-4" />
            Showcase
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl animate-in fade-in-50 slide-in-from-bottom-4 duration-700">
            See Luminite AI in Action
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground animate-in fade-in-50 slide-in-from-bottom-4 duration-700 delay-200">
            Explore the powerful and intuitive interface that will transform your
            workflow.
          </p>
        </div>
      </div>

      {/* Container untuk Marquee */}
      {/* Perspective hanya diterapkan di layar medium ke atas */}
      <div className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden md:[perspective:2000px]">
        
        {/* KUNCI PERBAIKAN #2: Marquee Versi Desktop (3 Kolom 3D) */}
        {/* 'hidden md:flex' -> Sembunyi di mobile, tampil sebagai flex di desktop */}
        <div
          className={cn(
            "hidden flex-row items-center justify-center gap-4 md:flex",
          )}
          style={{
            transform: "rotateY(20deg)",
            transformStyle: "preserve-3d",
          }}
        >
          <Marquee pauseOnHover vertical className="[--duration:20s]">
            {firstRow.map((imgSrc, idx) => (
              <ImageCard key={`desktop-1-${idx}`} imgSrc={imgSrc} />
            ))}
          </Marquee>
          <Marquee reverse pauseOnHover vertical className="[--duration:20s]">
            {secondRow.map((imgSrc, idx) => (
              <ImageCard key={`desktop-2-${idx}`} imgSrc={imgSrc} />
            ))}
          </Marquee>
          <Marquee pauseOnHover vertical className="[--duration:25s]">
            {thirdRow.map((imgSrc, idx) => (
              <ImageCard key={`desktop-3-${idx}`} imgSrc={imgSrc} />
            ))}
          </Marquee>
        </div>

        {/* KUNCI PERBAIKAN #3: Marquee Versi Mobile (1 Kolom Vertikal) */}
        {/* 'flex md:hidden' -> Tampil sebagai flex di mobile, sembunyi di desktop */}
        <div className="flex w-full items-center justify-center md:hidden">
          <Marquee pauseOnHover vertical className="[--duration:40s]">
            {/* Menggunakan semua gambar dalam satu kolom */}
            {screenshots.map((imgSrc, idx) => (
              <ImageCard key={`mobile-${idx}`} imgSrc={imgSrc} />
            ))}
          </Marquee>
        </div>

        {/* Gradient Overlays */}
        <div className="from-background pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b"></div>
        <div className="from-background pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t"></div>
      </div>
    </section>
  );
};