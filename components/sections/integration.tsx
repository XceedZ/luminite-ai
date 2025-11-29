"use client";

import React, { useEffect, useRef } from "react";
import { AnimatedBeam } from "@/components/ui/animated-beam";
import { cn } from "@/lib/utils";
import { Workflow } from "lucide-react";
import { MagicCard } from "@/components/ui/magic-card";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// URL Logo Aplikasi
const logos = {
  openai: "https://logo.clearbit.com/openai.com",
  notion: "https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png",
  slack: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Slack_icon_2019.svg/2048px-Slack_icon_2019.svg.png",
  figma: "https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/dark/aws.png",
  github: "https://upload.wikimedia.org/wikipedia/commons/3/35/GitLab_icon.svg",
};

// Komponen Circle tidak perlu diubah
const Circle = React.forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode }
>(({ className, children }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "z-10 flex size-12 items-center justify-center rounded-full border-2 border-border bg-background p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]",
        className
      )}
    >
      {children}
    </div>
  );
});
Circle.displayName = "Circle";

export function IntegrationSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  
  const div1Ref = useRef<HTMLDivElement>(null);
  const div2Ref = useRef<HTMLDivElement>(null);
  const div3Ref = useRef<HTMLDivElement>(null);
  const div4Ref = useRef<HTMLDivElement>(null);
  const div5Ref = useRef<HTMLDivElement>(null);
  const div6Ref = useRef<HTMLDivElement>(null);
  const div7Ref = useRef<HTMLDivElement>(null);

  const integrationCards = [
    { iconUrl: logos.notion, title: "Knowledge Base", description: "Connect your Notion pages and databases seamlessly." },
    { iconUrl: logos.slack, title: "Team Collaboration", description: "Integrate with Slack for better team coordination." },
    { iconUrl: logos.github, title: "Developer Workflow", description: "Connect with GitHub to sync issues and project status." },
  ];

  const circleRefs = [div1Ref, div2Ref, div3Ref, div4Ref, div5Ref, div6Ref, div7Ref];

  useEffect(() => {
    if (!sectionRef.current || !headerRef.current || !titleRef.current || !descriptionRef.current || !containerRef.current) return;

    // Optimasi global GSAP
    if (typeof window !== "undefined") {
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

      // Animate circles dengan optimasi dan cleanup event listeners
      const hoverHandlers: Array<{ element: HTMLElement; enter: () => void; leave: () => void }> = [];
      
      circleRefs.forEach((ref, index) => {
        if (ref.current) {
          gsap.fromTo(
            ref.current,
            {
              opacity: 0,
              scale: 0,
              rotation: -180,
              force3D: true,
            },
            {
              opacity: 1,
              scale: 1,
              rotation: 0,
              duration: 0.8,
              ease: "back.out(1.7)",
              delay: index * 0.1,
              force3D: true,
              scrollTrigger: {
                trigger: containerRef.current,
                start: "top 80%",
                toggleActions: "play none none reverse",
                markers: false,
                invalidateOnRefresh: false,
              },
            }
          );

          // Hover animation dengan optimasi
          const enterHandler = () => {
            gsap.to(ref.current, {
              scale: 1.2,
              rotation: 360,
              duration: 0.5,
              ease: "power2.out",
              force3D: true,
            });
          };

          const leaveHandler = () => {
            gsap.to(ref.current, {
              scale: 1,
              rotation: 0,
              duration: 0.5,
              ease: "power2.out",
              force3D: true,
            });
          };

          ref.current.addEventListener("mouseenter", enterHandler);
          ref.current.addEventListener("mouseleave", leaveHandler);
          
          hoverHandlers.push({
            element: ref.current,
            enter: enterHandler,
            leave: leaveHandler,
          });
        }
      });

      // Animate container dengan optimasi
      gsap.fromTo(
        containerRef.current,
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
            trigger: containerRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
            markers: false,
            invalidateOnRefresh: false,
          },
        }
      );

      // Animate integration cards dengan optimasi
      if (cardsRef.current) {
        gsap.fromTo(
          cardsRef.current.querySelectorAll(".integration-card"),
          {
            opacity: 0,
            scale: 0.9,
            y: 50,
            force3D: true,
          },
            {
              opacity: 1,
              scale: 1,
              y: 0,
              duration: 0.8,
              ease: "power3.out",
              stagger: 0.15,
            force3D: true,
            scrollTrigger: {
                trigger: cardsRef.current,
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

      // Cleanup function untuk event listeners
    return () => {
        hoverHandlers.forEach(({ element, enter, leave }) => {
          element.removeEventListener("mouseenter", enter);
          element.removeEventListener("mouseleave", leave);
        });
    };
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="integration" className="relative w-full overflow-hidden px-4 py-32 md:px-8">
      {/* Animated Background */}
      <div ref={backgroundRef} className="absolute inset-0 -z-10 overflow-hidden">
      </div>

      <div className="relative mx-auto max-w-7xl z-10">
        {/* Section Header */}
        <div ref={headerRef} className="mb-16 flex flex-col items-center text-center">
          <div className="badge mb-4 inline-flex items-center rounded-full border border-primary/30 bg-primary/10 backdrop-blur-sm px-4 py-1.5 text-sm font-medium text-primary">
            <Workflow className="mr-2 size-4" />
            Integrations
          </div>
          
          <h2 ref={titleRef} className="mb-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl">
            Seamlessly connects
            <br />
            <span className="text-primary">all your tools</span>
          </h2>
          
          <p ref={descriptionRef} className="max-w-2xl text-lg text-muted-foreground md:text-xl leading-relaxed">
            Luminite AI integrates with your favorite tools and databases,
            creating a unified workspace powered by AI.
          </p>
        </div>

        {/* Animated Beams Visualization */}
        <div
          className="relative mx-auto flex h-[400px] w-full max-w-4xl items-center justify-center overflow-hidden rounded-2xl border border-primary/20 bg-primary/5 p-10 md:shadow-2xl backdrop-blur-md"
          ref={containerRef}
        >
          <div className="flex size-full flex-col items-stretch justify-between gap-10">
            <div className="flex flex-row items-center justify-between">
              <Circle ref={div1Ref}><img src={logos.notion} alt="Notion" className="size-full" /></Circle>
              <Circle ref={div5Ref}><img src={logos.figma} alt="Figma" className="size-full" /></Circle>
            </div>
            <div className="flex flex-row items-center justify-between">
              <Circle ref={div2Ref}><img src={logos.slack} alt="Slack" className="size-full" /></Circle>
              <Circle ref={div4Ref} className="size-16"><img src={logos.openai} alt="OpenAI" className="size-full filter invert" /></Circle>
              <Circle ref={div6Ref}><img src={logos.github} alt="GitHub" className="size-full" /></Circle>
            </div>
            <div className="flex flex-row items-center justify-between">
              <Circle ref={div3Ref}><img src={logos.notion} alt="Notion" className="size-full" /></Circle>
              <Circle ref={div7Ref}><img src={logos.slack} alt="Slack" className="size-full" /></Circle>
            </div>
          </div>

          {/* Animated Beams */}
          <AnimatedBeam containerRef={containerRef} fromRef={div1Ref} toRef={div4Ref} curvature={-75} endYOffset={-10} />
          <AnimatedBeam containerRef={containerRef} fromRef={div2Ref} toRef={div4Ref} />
          <AnimatedBeam containerRef={containerRef} fromRef={div3Ref} toRef={div4Ref} curvature={75} endYOffset={10} />
          <AnimatedBeam containerRef={containerRef} fromRef={div5Ref} toRef={div4Ref} curvature={-75} reverse endYOffset={-10} />
          <AnimatedBeam containerRef={containerRef} fromRef={div6Ref} toRef={div4Ref} reverse />
          <AnimatedBeam containerRef={containerRef} fromRef={div7Ref} toRef={div4Ref} curvature={75} reverse endYOffset={10} />
        </div>

        {/* Integration Cards */}
        <div ref={cardsRef} className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {integrationCards.map((item, idx) => (
            <MagicCard key={idx} className="integration-card group p-6 transition-all duration-300 hover:scale-105">
              <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10 mb-4 transition-transform group-hover:scale-110">
                <img src={item.iconUrl} alt={`${item.title} logo`} className="size-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </MagicCard>
          ))}
        </div>
      </div>
    </section>
  );
}

