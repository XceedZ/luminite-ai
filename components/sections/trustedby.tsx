"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import {
  ScrollVelocityContainer,
  ScrollVelocityRow,
} from "@/components/ui/scroll-based-velocity";
import type { FC } from "react";

// Mendefinisikan tipe untuk objek logo
interface Logo {
  name: string;
  url: string;
}

// Mendefinisikan tipe untuk props komponen LogoItem
interface LogoItemProps {
  name: string;
  url: string;
  className?: string;
}

// Memberikan tipe pada array logos
const logos: Logo[] = [
  { name: "Google Cloud", url: "https://cdn.worldvectorlogo.com/logos/google-cloud-1.svg" },
  { name: "Notion", url: "https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png" },
  { name: "Microsoft Azure", url: "https://cdn.worldvectorlogo.com/logos/microsoft-azure-2.svg" },
  { name: "Slack", url: "https://cdn.worldvectorlogo.com/logos/slack-new-logo.svg" },
  { name: "Figma", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Figma-logo.svg/120px-Figma-logo.svg.png" },
  { name: "AWS", url: "https://cdn.worldvectorlogo.com/logos/amazon-web-services-2.svg" },
  { name: "Atlassian", url: "https://cdn.worldvectorlogo.com/logos/atlassian.svg" },
  { name: "Gitlab", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/GitLab_logo.svg/2560px-GitLab_logo.svg.png" },
];

// Membagi logo menjadi dua baris
const firstRow: Logo[] = logos.slice(0, logos.length / 2);
const secondRow: Logo[] = logos.slice(logos.length / 2);

// Memberikan tipe pada props komponen LogoItem
const LogoItem: FC<LogoItemProps> = ({ url, name, className }) => (
  <div className={cn("flex-shrink-0 w-40 mx-6 logo-item fade-in-scale", className)}>
    <img
      src={url}
      alt={name}
      className="w-full h-12 object-contain filter grayscale hover:grayscale-0 transition-all duration-300 hover:scale-110"
    />
  </div>
);

// Memberikan tipe pada komponen utama
export const TrustedBy: FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // CSS-based scroll animations using Intersection Observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Add visible class to trigger animations
            const animatedElements = entry.target.querySelectorAll('.fade-in-up, .fade-in-scale');
            animatedElements.forEach((el) => {
              el.classList.add("visible");
            });
            // Also add to the entry target if it has animation classes
            if (entry.target.classList.contains('fade-in-up') || entry.target.classList.contains('fade-in-scale')) {
              entry.target.classList.add("visible");
            }
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -100px 0px" }
    );

    // Observe section for scroll animations
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    // Parallax effect for background
    const handleScroll = () => {
      if (backgroundRef.current && sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const scrollProgress = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / (window.innerHeight + rect.height)));
        backgroundRef.current.style.transform = `translateY(${scrollProgress * -100}px)`;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full overflow-hidden px-4 py-32 md:px-8">
      {/* Animated Background */}
      <div ref={backgroundRef} className="absolute inset-0 -z-10 overflow-hidden">
        {/* Floating Particles */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="particle absolute w-2 h-2 bg-white/20 rounded-full blur-sm"
            style={{
              left: `${10 + i * 12}%`,
              top: `${20 + i * 8}%`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto text-center relative z-10">
        <h2
          ref={titleRef}
          className="text-lg font-semibold text-muted-foreground tracking-wider uppercase mb-16 fade-in-up"
          style={{ animationDelay: "0.2s" }}
        >
          Trusted by the world&apos;s best companies
        </h2>

        <ScrollVelocityContainer className="space-y-8">
          <ScrollVelocityRow baseVelocity={-2}>
            {[...firstRow, ...firstRow].map((logo, index) => (
              <LogoItem key={index} url={logo.url} name={logo.name} />
            ))}
          </ScrollVelocityRow>

          <ScrollVelocityRow baseVelocity={2}>
            {[...secondRow, ...secondRow].map((logo, index) => (
              <LogoItem key={index} url={logo.url} name={logo.name} />
            ))}
          </ScrollVelocityRow>
        </ScrollVelocityContainer>
      </div>
    </section>
  );
};