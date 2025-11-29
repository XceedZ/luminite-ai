"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { TopBar } from "@/components/sections/topbar";
import { HeroSection } from "@/components/sections/hero";
import { TrustedBy } from "@/components/sections/trustedby";
import { FeaturesSection } from "@/components/sections/features";
import { QNASection } from "@/components/sections/qna";
import { TestimonialsSection } from "@/components/sections/testimonials";
import { PricingSection } from "@/components/sections/pricing";
import { CTASection } from "@/components/sections/cta";
import { Footer } from "@/components/sections/footer";
import { useAuthStore } from "@/app/auth/store/auth.store";
import { isAuthenticated } from "@/utils/local-storage";

/**
 * Luminite AI Landing Page
 * Main landing page showcasing Luminite AI features and capabilities
 * Redirects to dashboard if user is already logged in
 * @author AlexanderA
 */
export default function Home() {
  const router = useRouter();
  const { isAuthenticated: isAuthFromStore } = useAuthStore();

  useEffect(() => {
    // Check if user is authenticated (from store or localStorage)
    const hasAuth = isAuthFromStore || isAuthenticated();
    
    if (hasAuth) {
      // Redirect to dashboard if already logged in
      window.location.href = '/dashboard';
    }
  }, [router, isAuthFromStore]);

  return (
    <>
      {/* Global Grid Background */}
      <div 
        className="fixed inset-0 -z-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />
      
      {/* Global Glowing Orbs - menyatu dengan semua section */}
      <div className="fixed inset-0 -z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] left-[15%] w-96 h-96 rounded-full blur-3xl orb-1 orb-delay-0" />
        <div className="absolute top-[30%] right-[20%] w-80 h-80 rounded-full blur-3xl orb-2 orb-delay-1" />
        <div className="absolute bottom-[20%] left-[25%] w-72 h-72 rounded-full blur-3xl orb-3 orb-delay-2" />
        <div className="absolute bottom-[40%] right-[15%] w-96 h-96 rounded-full blur-3xl orb-4 orb-delay-0-5" />
        <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl orb-5 orb-delay-1-5" />
        <div className="absolute top-[15%] right-[40%] w-80 h-80 rounded-full blur-3xl orb-6 orb-delay-0-3" />
      </div>
      
      <TopBar />
      <main className="flex min-h-screen flex-col relative z-10">
        <HeroSection />
        <TrustedBy />
        <FeaturesSection />
        <QNASection />
        <TestimonialsSection />
        <PricingSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
