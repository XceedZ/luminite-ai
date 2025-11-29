"use client";

import { useEffect, useRef } from "react";
import { CheckCircle2, ArrowRight, CreditCard } from "lucide-react";
import { ShineBorder } from "@/components/ui/shine-border";
import { RippleButton } from "@/components/ui/ripple-button";
import { cn } from "@/lib/utils";
import type { FC } from "react";

// ==================================================================
// --- TEMA WARNA UNTUK PAKET UNGGULAN (FEATURED) ---
// Diperbarui menjadi gradien Ungu-Indigo untuk konsistensi
// ==================================================================
const featuredPlanTheme = {
  shineColor: "#A855F7", // Warna ungu untuk efek kilau
  badgeGradient: "from-purple-500 to-indigo-500",
  borderColor: "border-indigo-500", // Border solid yang cocok dengan gradien
  checkColor: "text-indigo-400",
  buttonClasses:
    "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg shadow-indigo-500/30 hover:opacity-90 transition-opacity",
};
// ==================================================================

// Tipe data untuk props
interface PricingCardProps {
  planName: string;
  price: string;
  priceDescription: string;
  description: string;
  features: string[];
  buttonText: string;
  isFeatured?: boolean;
}

const PricingCard: FC<PricingCardProps> = ({
  planName,
  price,
  priceDescription,
  description,
  features,
  buttonText,
  isFeatured = false,
}) => (
  <div className="pricing-card relative pt-8">
    {isFeatured && (
      <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 z-20">
      </div>
    )}

    <div
      className={cn(
        "relative h-full rounded-xl overflow-hidden bg-primary/5 p-8 shadow-lg backdrop-blur-sm",
        isFeatured ? featuredPlanTheme.borderColor : "border border-primary/20",
      )}
    >
      <ShineBorder
        className="absolute inset-0"
        shineColor={isFeatured ? featuredPlanTheme.shineColor : "#A0A0A0"}
      />

      <div className="flex h-full flex-col">
        <h3 className="text-2xl font-semibold text-foreground">{planName}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>

        <div className="mt-6">
          <span className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            {price}
          </span>
          <span className="ml-1 text-sm text-muted-foreground">
            {priceDescription}
          </span>
        </div>

        <ul className="mt-8 flex-grow space-y-4 text-muted-foreground">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-3">
              <CheckCircle2
                className={cn(
                  "h-5 w-5",
                  isFeatured ? featuredPlanTheme.checkColor : "text-indigo-400",
                )}
              />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>

        <RippleButton
          className={cn(
            "group relative z-10 mt-10 w-full rounded-lg px-6 py-3 text-center font-medium transition-all duration-300 overflow-hidden",
            isFeatured
              ? featuredPlanTheme.buttonClasses
              : "border border-foreground/20 bg-transparent text-foreground hover:bg-foreground/10",
          )}
          rippleColor={isFeatured ? "#ffffff" : featuredPlanTheme.shineColor}
        >
          <div className="flex items-center justify-center">
            {buttonText}
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </RippleButton>
      </div>
    </div>
  </div>
);

// --- PricingSection ---
export const PricingSection: FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const plans: PricingCardProps[] = [
    { planName: "Free", price: "$0", priceDescription: "/ month", description: "For individuals & hobbyists getting started.", features: ["Up to 1,000 tasks", "Basic AI assistance", "Community support", "2 active projects"], buttonText: "Start for Free" },
    { planName: "Pro", price: "$15", priceDescription: "/ user / month", description: "For professionals and teams needing more power.", features: ["Unlimited tasks", "Advanced AI assistance", "Priority email support", "Unlimited projects", "Team collaboration"], buttonText: "Upgrade to Pro", isFeatured: true },
    { planName: "Enterprise", price: "Custom", priceDescription: "", description: "For large organizations with custom needs.", features: ["Everything in Pro, plus:", "Dedicated account manager", "Single Sign-On (SSO)", "Custom integrations", "Advanced security"], buttonText: "Contact Sales" },
  ];

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
        backgroundRef.current.style.transform = `translateY(${scrollProgress * -80}px)`;
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
    <section
      ref={sectionRef}
      id="pricing"
      className="relative w-full overflow-hidden px-4 py-32 md:px-8"
    >
      {/* Animated Background */}
      <div ref={backgroundRef} className="absolute inset-0 -z-10 overflow-hidden">
      </div>

      <div className="relative mx-auto max-w-7xl z-10">
        <div ref={headerRef} className="mb-16 flex flex-col items-center text-center">
          <div className="badge mb-4 inline-flex items-center rounded-full border border-primary/30 bg-primary/10 backdrop-blur-sm px-4 py-1.5 text-sm font-medium text-primary fade-in-scale" style={{ animationDelay: "0.1s" }}>
            <CreditCard className="mr-2 size-4" />
            Pricing
          </div>
          <h2 ref={titleRef} className="mb-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl fade-in-up" style={{ animationDelay: "0.2s" }}>
            Choose the right plan for you
          </h2>
          <p ref={descriptionRef} className="max-w-2xl text-lg text-muted-foreground md:text-xl leading-relaxed fade-in-up" style={{ animationDelay: "0.4s" }}>
            Start for free, then upgrade as you grow. All plans include our powerful AI features.
          </p>
        </div>
        <div ref={cardsRef} className="grid grid-cols-1 items-stretch gap-8 pt-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {plans.map((plan, index) => (
            <div key={plan.planName} className="fade-in-up" style={{ animationDelay: `${0.6 + index * 0.15}s` }}>
              <PricingCard {...plan} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
