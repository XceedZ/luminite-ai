"use client";

import { useEffect, useRef } from "react";
import { HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What is Luminite AI?",
    answer:
      "Luminite AI is an all-in-one AI-powered productivity platform that unifies multiple AI capabilities in a single application. It helps you manage tasks, access knowledge bases, and streamline your workflow with intelligent automation.",
  },
  {
    question: "How does Luminite AI integrate with other tools?",
    answer:
      "Luminite AI seamlessly integrates with popular tools like Notion, Slack, GitHub, and many others. You can connect your existing workflows and databases to create a unified workspace powered by AI.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes, security is our top priority. We use enterprise-grade encryption, follow industry best practices, and comply with major security standards. Your data is encrypted both in transit and at rest.",
  },
  {
    question: "Can I try Luminite AI for free?",
    answer:
      "Absolutely! We offer a free plan that includes up to 1,000 tasks, basic AI assistance, and community support. You can start using Luminite AI immediately without a credit card.",
  },
  {
    question: "What makes Luminite AI different from other task management tools?",
    answer:
      "Luminite AI combines powerful task management with cutting-edge AI technology. Unlike traditional tools, it provides intelligent automation, AI-powered insights, and seamless integration with multiple AI models, all in one unified platform.",
  },
  {
    question: "Do I need technical knowledge to use Luminite AI?",
    answer:
      "Not at all! Luminite AI is designed to be intuitive and user-friendly. The AI handles the complex work, so you can focus on what matters. Our interface is clean and easy to navigate for users of all technical levels.",
  },
];

export function QNASection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const accordionRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);

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

      // Animate accordion items dengan optimasi
      if (accordionRef.current) {
        gsap.fromTo(
          accordionRef.current.querySelectorAll("[data-slot='accordion-item']"),
          {
            opacity: 0,
            y: 30,
            force3D: true,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            stagger: 0.1,
            force3D: true,
            scrollTrigger: {
              trigger: accordionRef.current,
              start: "top 80%",
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
    <section ref={sectionRef} id="qna" className="relative w-full overflow-hidden px-4 py-32 md:px-8">
      {/* Animated Background */}
      <div ref={backgroundRef} className="absolute inset-0 -z-10 overflow-hidden">
      </div>

      <div className="relative mx-auto max-w-4xl z-10">
        {/* Section Header */}
        <div ref={headerRef} className="mb-16 flex flex-col items-center text-center">
          <div className="badge mb-4 inline-flex items-center rounded-full border border-primary/30 bg-primary/10 backdrop-blur-sm px-4 py-1.5 text-sm font-medium text-primary">
            <HelpCircle className="mr-2 size-4" />
            FAQ
          </div>
          <h2 ref={titleRef} className="mb-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl">
            Frequently Asked
            <br />
            <span className="text-primary">Questions</span>
          </h2>
          <p ref={descriptionRef} className="max-w-2xl text-lg text-muted-foreground md:text-xl leading-relaxed">
            Find answers to common questions about Luminite AI and how it can help transform your productivity.
          </p>
        </div>

        {/* Accordion */}
        <div ref={accordionRef}>
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="rounded-xl border border-primary/20 bg-primary/5 backdrop-blur-sm transition-all hover:bg-primary/10 hover:border-primary/30 data-[state=open]:bg-primary/10 data-[state=open]:border-primary/30"
              >
                <AccordionTrigger className="text-left text-lg font-semibold text-foreground hover:no-underline px-6 py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed px-6 pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}

