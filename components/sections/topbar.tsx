"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export function TopBar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuItemsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  // GSAP Animation untuk Mobile Menu
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const animateMobileMenu = async () => {
      const gsap = (await import('gsap')).default;
      
      if (isMobileMenuOpen) {
        // Animate menu items
        const items = mobileMenuItemsRef.current?.children;
        if (items) {
          gsap.fromTo(
            Array.from(items),
            {
              opacity: 0,
              y: 20,
            },
            {
              opacity: 1,
              y: 0,
              duration: 0.4,
              stagger: 0.1,
              ease: "power3.out",
            }
          );
        }
      }
    };

    animateMobileMenu();
  }, [isMobileMenuOpen]);

  const handleNavClick = (sectionId: string) => {
    setIsMobileMenuOpen(false);
    setTimeout(() => {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          "bg-transparent backdrop-blur-xl",
          isScrolled && "border-b border-border/50"
        )}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <img 
                src="/logo.svg" 
                alt="Luminite AI Logo" 
                className="w-6 h-6 sm:w-8 sm:h-8 brightness-0 dark:invert"
              />
              <span className="text-lg sm:text-xl font-bold text-foreground">
                Luminite
              </span>
              <Badge variant="secondary" className="text-xs">
                AI
              </Badge>
            </div>

            {/* Navigation - Desktop */}
            <nav className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Features
              </a>
              <a
                href="#qna"
                className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('qna')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                FAQ
              </a>
              <a
                href="#testimonials"
                className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('testimonials')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Testimonials
              </a>
              <a
                href="#pricing"
                className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Pricing
              </a>
            </nav>

            {/* CTA Buttons - Desktop */}
            <div className="hidden md:flex items-center space-x-3">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-foreground hover:text-foreground/70"
                onClick={() => router.push('/auth')}
              >
                Sign In
              </Button>
              <Button
                size="sm"
                className="bg-white text-black hover:bg-gray-100 border-0"
                onClick={() => window.open('https://luminite-ai.vercel.app', '_blank')}
              >
                Get Started
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-foreground hover:text-foreground/80"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <svg 
                viewBox="0 0 28 28" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
              >
                <path 
                  d="M4 7C4 6.44771 4.44772 6 5 6H24C24.5523 6 25 6.44771 25 7C25 7.55229 24.5523 8 24 8H5C4.44772 8 4 7.55229 4 7Z" 
                  fill="currentColor"
                />
                <path 
                  d="M4 13.9998C4 13.4475 4.44772 12.9997 5 12.9997L16 13C16.5523 13 17 13.4477 17 14C17 14.5523 16.5523 15 16 15L5 14.9998C4.44772 14.9998 4 14.552 4 13.9998Z" 
                  fill="currentColor"
                />
                <path 
                  d="M5 19.9998C4.44772 19.9998 4 20.4475 4 20.9998C4 21.552 4.44772 21.9997 5 21.9997H22C22.5523 21.9997 23 21.552 23 20.9998C23 20.4475 22.5523 19.9998 22 19.9998H5Z" 
                  fill="currentColor"
                />
              </svg>
              <span className="sr-only">Open menu</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Menu - Fullscreen */}
      <div
        ref={mobileMenuRef}
        className={cn(
          "fixed inset-0 z-[60] bg-background/95 backdrop-blur-xl",
          "transition-transform duration-300 ease-in-out",
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-end p-4 border-b border-border/50">
            <Button
              variant="ghost"
              size="icon"
              className="text-foreground hover:text-foreground/80"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close menu</span>
            </Button>
          </div>

          {/* Mobile Menu Content */}
          <nav ref={mobileMenuItemsRef} className="flex-1 flex flex-col justify-center px-8 py-12 space-y-8">
            <a
              href="#features"
              className="text-2xl font-semibold text-foreground/70 hover:text-foreground transition-colors"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('features');
              }}
            >
              Features
            </a>
            <a
              href="#qna"
              className="text-2xl font-semibold text-foreground/70 hover:text-foreground transition-colors"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('qna');
              }}
            >
              FAQ
            </a>
            <a
              href="#testimonials"
              className="text-2xl font-semibold text-foreground/70 hover:text-foreground transition-colors"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('testimonials');
              }}
            >
              Testimonials
            </a>
            <a
              href="#pricing"
              className="text-2xl font-semibold text-foreground/70 hover:text-foreground transition-colors"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('pricing');
              }}
            >
              Pricing
            </a>

            {/* Mobile CTA Buttons */}
            <div className="pt-8 space-y-4 border-t border-border/50 mt-8">
              <Button
                variant="outline"
                className="w-full justify-center h-12 text-base"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  router.push('/auth');
                }}
              >
                Sign In
              </Button>
              <Button
                className="w-full justify-center h-12 text-base bg-white text-black hover:bg-gray-100 border-0"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  window.open('https://luminite-ai.vercel.app', '_blank');
                }}
              >
                Get Started
              </Button>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}
