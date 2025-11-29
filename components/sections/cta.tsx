"use client";

import { useEffect, useRef } from "react";
import { Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * CTA Section Component
 * Final call-to-action section with shimmer button
 * @author AlexanderA
 */
export function CTASection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !headerRef.current || !titleRef.current || !descriptionRef.current) return;

    // Dynamic import GSAP untuk code splitting
    Promise.all([
      import("gsap"),
      import("gsap/ScrollTrigger"),
    ]).then(([gsapModule, scrollTriggerModule]) => {
      const gsap = gsapModule.default;
      const ScrollTrigger = scrollTriggerModule.default;
      
      if (typeof window !== "undefined") {
        gsap.registerPlugin(ScrollTrigger);
        gsap.config({ nullTargetWarn: false });
      }

      const ctx = gsap.context(() => {
      // Animate header badge dengan optimasi
      const badgeElement = headerRef.current?.querySelector(".badge");
      if (badgeElement) {
        gsap.fromTo(
          badgeElement,
          {
            opacity: 0,
            scale: 0.8,
            y: -20,
            force3D: true,
          },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.6,
            ease: "back.out(1.7)",
            force3D: true,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
              markers: false,
              invalidateOnRefresh: false,
            },
          }
        );
      }

      // Animate title dengan optimasi
      gsap.fromTo(
        titleRef.current,
        {
          opacity: 0,
          y: 50,
          force3D: true,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          force3D: true,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
            markers: false,
            invalidateOnRefresh: false,
          },
        }
      );

      // Animate description dengan optimasi
      gsap.fromTo(
        descriptionRef.current,
        {
          opacity: 0,
          y: 30,
          force3D: true,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          delay: 0.2,
          force3D: true,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
            markers: false,
            invalidateOnRefresh: false,
          },
        }
      );

      // Animate buttons dengan optimasi
      if (buttonsRef.current) {
        gsap.fromTo(
          buttonsRef.current,
          {
            opacity: 0,
            y: 30,
            force3D: true,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            delay: 0.4,
            force3D: true,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 70%",
              toggleActions: "play none none reverse",
              markers: false,
              invalidateOnRefresh: false,
            },
          }
        );
      }

      // Animate info items dengan optimasi
      if (infoRef.current) {
        gsap.fromTo(
          infoRef.current.querySelectorAll(".info-item"),
          {
            opacity: 0,
            x: -20,
            force3D: true,
          },
          {
            opacity: 1,
            x: 0,
            duration: 0.6,
            ease: "power2.out",
            stagger: 0.1,
            delay: 0.6,
            force3D: true,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 65%",
              toggleActions: "play none none reverse",
              markers: false,
              invalidateOnRefresh: false,
            },
          }
        );
      }

      // Parallax background dengan optimasi scrub
      if (backgroundRef.current) {
        gsap.to(backgroundRef.current, {
          y: -80,
          force3D: true,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
            markers: false,
            invalidateOnRefresh: false,
          },
        });
      }
      }, sectionRef);

      return () => ctx.revert();
    });
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full overflow-hidden px-4 py-32 md:px-8">
      {/* Animated Background */}
      <div ref={backgroundRef} className="absolute inset-0 -z-10 overflow-hidden">
      </div>

      <div className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden z-10">
        {/* CTA Content */}
        <div className="relative z-10 flex flex-col items-center text-center">
          {/* Badge */}
          <div ref={headerRef} className="badge mb-6 inline-flex items-center rounded-full border border-primary/30 bg-primary/10 backdrop-blur-sm px-4 py-1.5 text-sm font-medium text-primary">
            <Rocket className="mr-2 size-4" />
            Start Your Journey
          </div>

          {/* Headline */}
          <h2 ref={titleRef} className="mb-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl">
            Ready to transform
            <br />
            <span className="text-primary">your productivity?</span>
          </h2>

          {/* Description */}
          <p ref={descriptionRef} className="mb-8 max-w-2xl text-lg text-muted-foreground md:text-xl leading-relaxed">
            Join thousands of teams already using Luminite AI to streamline
            their workflows and boost productivity with intelligent task
            management.
          </p>

          {/* CTA Buttons */}
          <div ref={buttonsRef} className="mb-8 flex flex-col gap-4 sm:flex-row">
            <Button
              className="shadow-2xl hover:scale-105 transition-transform bg-primary text-primary-foreground hover:bg-primary/90"
              size="lg"
              onClick={() => window.open('https://luminite-ai.vercel.app', '_blank')}
            >
              Get Started - It&apos;s Free
            </Button>
          </div>

          {/* Additional Info */}
          <div ref={infoRef} className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="info-item flex items-center gap-2">
              <svg
                className="size-5 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Free 14-day trial</span>
            </div>
            <div className="info-item flex items-center gap-2">
              <svg
                className="size-5 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>No credit card required</span>
            </div>
            <div className="info-item flex items-center gap-2">
              <svg
                className="size-5 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

