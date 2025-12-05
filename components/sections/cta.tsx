"use client";

import { Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useInView } from "@/hooks/use-in-view";

/**
 * CTA Section Component
 * Final call-to-action section with shimmer button
 * @author AlexanderA
 */
export function CTASection() {
  const { ref: sectionRef, isInView } = useInView<HTMLElement>({ threshold: 0.1 });

  return (
    <section ref={sectionRef} className="relative w-full overflow-hidden px-4 py-32 md:px-8">
      {/* Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden"></div>

      <div className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden z-10">
        {/* CTA Content */}
        <div className="relative z-10 flex flex-col items-center text-center">
          {/* Badge */}
          <div
            className={`scroll-animate pop-in mb-6 inline-flex items-center rounded-full border border-primary/30 bg-primary/10 backdrop-blur-sm px-4 py-1.5 text-sm font-medium text-primary ${isInView ? 'in-view' : ''}`}
          >
            <Rocket className="mr-2 size-4" />
            Start Your Journey
          </div>

          {/* Headline */}
          <h2
            className={`scroll-animate slide-fade-up anim-delay-100 mb-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl ${isInView ? 'in-view' : ''}`}
          >
            Ready to transform
            <br />
            <span className="text-primary">your productivity?</span>
          </h2>

          {/* Description */}
          <p
            className={`scroll-animate slide-fade-up-small anim-delay-200 mb-8 max-w-2xl text-lg text-muted-foreground md:text-xl leading-relaxed ${isInView ? 'in-view' : ''}`}
          >
            Join thousands of teams already using Luminite AI to streamline
            their workflows and boost productivity with intelligent task
            management.
          </p>

          {/* CTA Buttons */}
          <div
            className={`scroll-animate slide-fade-up-small anim-delay-300 mb-8 flex flex-col gap-4 sm:flex-row ${isInView ? 'in-view' : ''}`}
          >
            <Button
              className="shadow-2xl hover:scale-105 transition-transform bg-primary text-primary-foreground hover:bg-primary/90"
              size="lg"
              onClick={() => window.open('https://luminite-ai.vercel.app', '_blank')}
            >
              Get Started - It&apos;s Free
            </Button>
          </div>

          {/* Additional Info */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className={`scroll-animate slide-fade-left anim-delay-400 flex items-center gap-2 ${isInView ? 'in-view' : ''}`}>
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
            <div className={`scroll-animate slide-fade-left anim-delay-500 flex items-center gap-2 ${isInView ? 'in-view' : ''}`}>
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
            <div className={`scroll-animate slide-fade-left anim-delay-600 flex items-center gap-2 ${isInView ? 'in-view' : ''}`}>
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
