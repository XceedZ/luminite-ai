"use client";

import { useEffect, useRef } from "react";
import { CheckCircle2, ArrowRight, CreditCard, Rocket, Zap, Building2 } from "lucide-react";
import { MagicCard } from "@/components/ui/magic-card";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/language-provider";
import type { FC } from "react";

// Tipe data untuk props
interface PricingCardProps {
  planName: string;
  planKey: string;
  price: string;
  priceDescription: string;
  description: string;
  features: string[];
  buttonText: string;
  isFeatured?: boolean;
  icon: FC<{ className?: string }>;
  gradientFrom?: string;
  gradientTo?: string;
  t: (key: string) => string;
}

const PricingCard: FC<PricingCardProps> = ({
  planName,
  price,
  priceDescription,
  description,
  features,
  buttonText,
  isFeatured = false,
  icon: Icon,
  gradientFrom = "#9E7AFF",
  gradientTo = "#FE8BBB",
}) => (
  <div className="pricing-card h-full">
    <MagicCard
      className="h-full rounded-xl p-8 transition-all duration-300 hover:scale-[1.02]"
      gradientFrom={gradientFrom}
      gradientTo={gradientTo}
    >
      <div className="flex h-full flex-col min-h-[480px]">
        {/* Header with Icon */}
        <div className="flex items-center gap-3 mb-4">
          <div className={cn(
            "flex h-12 w-12 items-center justify-center rounded-xl shadow-sm",
            isFeatured
              ? "bg-gradient-to-br from-purple-500/20 via-purple-500/10 to-purple-500/5"
              : "bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5"
          )}>
            <Icon className={cn("h-6 w-6", isFeatured ? "text-purple-500" : "text-primary")} />
          </div>
          <h3 className="text-2xl font-semibold text-foreground">{planName}</h3>
        </div>

        <p className="text-sm text-muted-foreground mb-6">{description}</p>

        {/* Price */}
        <div className="mb-8">
          <span className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            {price}
          </span>
          <span className="ml-1 text-sm text-muted-foreground">
            {priceDescription}
          </span>
        </div>

        {/* Features */}
        <ul className="flex-grow space-y-4 mb-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <CheckCircle2 className={cn("h-5 w-5 flex-shrink-0 mt-0.5", isFeatured ? "text-purple-500" : "text-primary")} />
              <span className="text-sm text-muted-foreground">{feature}</span>
            </li>
          ))}
        </ul>

        {/* CTA Button */}
        {isFeatured ? (
          <RainbowButton className="w-full group">
            <span className="flex items-center justify-center gap-2">
              {buttonText}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </RainbowButton>
        ) : (
          <Button
            variant="outline"
            size="lg"
            className="w-full group border-foreground/20 hover:bg-foreground/5"
          >
            <span className="flex items-center justify-center gap-2">
              {buttonText}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Button>
        )}
      </div>
    </MagicCard>
  </div>
);

// --- PricingSection ---
export const PricingSection: FC = () => {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);

  const plans: Omit<PricingCardProps, 't'>[] = [
    {
      planName: t("pricingFreePlan") || "Free",
      planKey: "free",
      price: "$0",
      priceDescription: t("pricingPerMonth") || "/ month",
      description: t("pricingFreeDesc") || "Perfect for individuals exploring AI-powered tools.",
      features: [
        t("pricingFreeFeature1") || "5 AI generations per day",
        t("pricingFreeFeature2") || "Basic document editing",
        t("pricingFreeFeature3") || "Simple diagrams",
        t("pricingFreeFeature4") || "Community support",
        t("pricingFreeFeature5") || "1 active project",
      ],
      buttonText: t("pricingFreeButton") || "Start for Free",
      icon: Rocket,
      gradientFrom: "#666666",
      gradientTo: "#444444",
    },
    {
      planName: t("pricingProPlan") || "Pro",
      planKey: "pro",
      price: "$15",
      priceDescription: t("pricingPerMonth") || "/ month",
      description: t("pricingProDesc") || "For professionals who need more power and features.",
      features: [
        t("pricingProFeature1") || "Unlimited AI generations",
        t("pricingProFeature2") || "Advanced document editing",
        t("pricingProFeature3") || "Complex diagrams & flowcharts",
        t("pricingProFeature4") || "Priority email support",
        t("pricingProFeature5") || "Unlimited projects",
        t("pricingProFeature6") || "Export to PDF/PNG",
        t("pricingProFeature7") || "Team collaboration",
      ],
      buttonText: t("pricingProButton") || "Upgrade to Pro",
      isFeatured: true,
      icon: Zap,
      gradientFrom: "#A855F7",
      gradientTo: "#7C3AED",
    },
    {
      planName: t("pricingEnterprisePlan") || "Enterprise",
      planKey: "enterprise",
      price: t("pricingCustom") || "Custom",
      priceDescription: "",
      description: t("pricingEnterpriseDesc") || "For large organizations with custom needs.",
      features: [
        t("pricingEnterpriseFeature1") || "Everything in Pro, plus:",
        t("pricingEnterpriseFeature2") || "Dedicated account manager",
        t("pricingEnterpriseFeature3") || "Single Sign-On (SSO)",
        t("pricingEnterpriseFeature4") || "Custom integrations",
        t("pricingEnterpriseFeature5") || "Advanced security & SLA",
        t("pricingEnterpriseFeature6") || "On-premise deployment",
      ],
      buttonText: t("pricingEnterpriseButton") || "Contact Sales",
      icon: Building2,
      gradientFrom: "#666666",
      gradientTo: "#444444",
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const animatedElements = entry.target.querySelectorAll('.fade-in-up, .fade-in-scale');
            animatedElements.forEach((el) => {
              el.classList.add("visible");
            });
            if (entry.target.classList.contains('fade-in-up') || entry.target.classList.contains('fade-in-scale')) {
              entry.target.classList.add("visible");
            }
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -100px 0px" }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    const handleScroll = () => {
      if (backgroundRef.current && sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const scrollProgress = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / (window.innerHeight + rect.height)));
        backgroundRef.current.style.transform = `translateY(${scrollProgress * -80}px)`;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="pricing"
      className="relative w-full overflow-hidden px-4 py-24 md:px-8"
    >
      {/* Animated Background */}
      <div ref={backgroundRef} className="absolute inset-0 -z-10 overflow-hidden" />

      <div className="relative mx-auto max-w-7xl z-10">
        {/* Header */}
        <div className="mb-16 flex flex-col items-center text-center">
          <div className="badge mb-4 inline-flex items-center rounded-full border border-primary/30 bg-primary/10 backdrop-blur-sm px-4 py-1.5 text-sm font-medium text-primary fade-in-scale" style={{ animationDelay: "0.1s" }}>
            <CreditCard className="mr-2 size-4" />
            {t("pricing")}
          </div>
          <h2 className="mb-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl fade-in-up" style={{ animationDelay: "0.2s" }}>
            {t("pricingTitle")}
          </h2>
          <p className="max-w-2xl text-lg text-muted-foreground md:text-xl leading-relaxed fade-in-up" style={{ animationDelay: "0.4s" }}>
            {t("pricingSubtitle")}
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 items-stretch gap-8 pt-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {plans.map((plan, index) => (
            <div key={plan.planKey} className="fade-in-up" style={{ animationDelay: `${0.6 + index * 0.15}s` }}>
              <PricingCard {...plan} t={t} />
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-16 text-center fade-in-up" style={{ animationDelay: "1s" }}>
          <p className="text-muted-foreground">
            {t("pricingFooter")}
          </p>
        </div>
      </div>
    </section>
  );
};
