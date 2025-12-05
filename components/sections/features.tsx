"use client";

import { Layers } from "lucide-react";
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import { AnimatedList } from "@/components/ui/animated-list";
import { Globe } from "@/components/ui/globe";
import {
  Terminal,
  TypingAnimation,
  AnimatedSpan,
} from "@/components/ui/terminal";
import { OrbitingCircles } from "@/components/ui/orbiting-circles";
import { cn } from "@/lib/utils";
import { useInView } from "@/hooks/use-in-view";
import type { FC, ReactNode } from "react";

// --- Definisi Tipe Data & Ikon ---

interface Task {
  name: string;
  description: string;
  icon: string;
  color: string;
  time: string;
}

interface Feature {
  Icon: React.ElementType;
  name: string;
  description: string;
  href: string;
  cta: string;
  className: string;
  background: ReactNode;
}

// Kumpulan ikon SVG untuk OrbitingCircles
const Icons = {
  notion: () => (
    <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6.017 4.313l55.333 -4.087c6.797 -0.583 8.543 -0.19 12.817 2.917l17.663 12.443c2.913 2.14 3.883 2.723 3.883 5.053v68.243c0 4.277 -1.553 6.807 -6.99 7.193L24.467 99.967c-4.08 0.193 -6.023 -0.39 -8.16 -3.113L3.3 79.94c-2.333 -3.113 -3.3 -5.443 -3.3 -8.167V11.113c0 -3.497 1.553 -6.413 6.017 -6.8z" fill="#ffffff" />
      <path d="M61.35 0.227l-55.333 4.087C1.553 4.7 0 7.617 0 11.113v60.66c0 2.723 0.967 5.053 3.3 8.167l13.007 16.913c2.137 2.723 4.08 3.307 8.16 3.113l64.257 -3.89c5.433 -0.387 6.99 -2.917 6.99 -7.193V20.64c0 -2.21 -0.873 -2.847 -3.443 -4.733L74.167 3.143c-4.273 -3.107 -6.02 -3.5 -12.817 -2.917zM25.92 19.523c-5.247 0.353 -6.437 0.433 -9.417 -1.99L8.927 11.507c-0.77 -0.78 -0.383 -1.753 1.557 -1.947l53.193 -3.887c4.467 -0.39 6.793 1.167 8.54 2.527l9.123 6.61c0.39 0.197 1.36 1.36 0.193 1.36l-54.933 3.307 -0.68 0.047zM19.803 88.3V30.367c0 -2.53 0.777 -3.697 3.103 -3.893L86 22.78c2.14 -0.193 3.107 1.167 3.107 3.693v57.547c0 2.53 -0.39 4.67 -3.883 4.863l-60.377 3.5c-3.493 0.193 -5.043 -0.97 -5.043 -4.083zm59.6 -54.827c0.387 1.75 0 3.5 -1.75 3.7l-2.91 0.577v42.773c-2.527 1.36 -4.853 2.137 -6.797 2.137 -3.107 0 -3.883 -0.973 -6.21 -3.887l-19.03 -29.94v28.967l6.02 1.363s0 3.5 -4.857 3.5l-13.39 0.777c-0.39 -0.78 0 -2.723 1.357 -3.11l3.497 -0.97v-38.3L30.48 40.667c-0.39 -1.75 0.58 -4.277 3.3 -4.473l14.367 -0.967 19.8 30.327v-26.83l-5.047 -0.58c-0.39 -2.143 1.163 -3.7 3.103 -3.89l13.4 -0.78z" fill="#000000" fillRule="evenodd" clipRule="evenodd" />
    </svg>
  ),
  openai: () => (
    <svg width="100" height="100" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="fill-black dark:fill-white">
      <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" />
    </svg>
  ),
};

// --- Komponen Latar Belakang Animasi ---

const TaskListBackground: FC = () => {
  let tasks: Task[] = [
    { name: "Review Q3 Budget", description: "Finance Dept.", time: "Due Today", icon: "📊", color: "#1E86FF" },
    { name: "Deploy new feature", description: "Engineering", time: "Due Tomorrow", icon: "🚀", color: "#00C9A7" },
    { name: "Plan marketing campaign", description: "Marketing", time: "Due in 3 days", icon: "📣", color: "#FFB800" },
    { name: "Update user docs", description: "Product Team", time: "Due in 1 week", icon: "📝", color: "#FF3D71" },
  ];
  tasks = Array.from({ length: 4 }, () => tasks).flat();
  const TaskNotification = ({ name, description, icon, color, time }: Task) => (<figure className={cn("relative w-full cursor-pointer overflow-hidden rounded-lg p-2", "bg-white/5 [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05)]", "transform-gpu dark:bg-transparent dark:[border:1px_solid_rgba(255,255,255,.1)]")}> <div className="flex items-center gap-2"> <div className="flex size-8 items-center justify-center rounded-lg" style={{ backgroundColor: color }}><span className="text-base">{icon}</span></div> <div className="flex flex-col overflow-hidden"> <figcaption className="flex items-center whitespace-pre text-xs font-medium dark:text-white"><span className="truncate">{name}</span><span className="mx-1">·</span><span className="text-xs text-gray-500">{time}</span></figcaption> <p className="text-xs font-normal dark:text-white/60">{description}</p> </div> </div> </figure>);
  return (<div className="absolute inset-x-0 top-6 h-full w-full px-4 [mask-image:linear-gradient(to_top,transparent_30%,#000_100%)]"> <AnimatedList> {tasks.map((item, idx) => (<TaskNotification {...item} key={idx} />))} </AnimatedList> </div>);
};

const AIGlobeBackground = () => (
  <div className="absolute inset-0 flex items-center justify-center [mask-image:linear-gradient(to_top,transparent_30%,#000_100%)]">
    <Globe className="top-0 transition-all duration-500 ease-out group-hover:scale-110" />
    <div className="pointer-events-none absolute inset-0 h-full bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
  </div>
);

const TerminalBackground = () => (
  <div className="absolute inset-x-0 top-4 h-full w-full origin-top scale-90 p-4 [mask-image:linear-gradient(to_top,transparent_30%,#000_100%)] transition-all duration-300 ease-out group-hover:scale-95">
    <Terminal>
      <TypingAnimation>{`> SHOW DATABASES;`}</TypingAnimation>
      <AnimatedSpan className="text-green-500">✔ knowledge_base</AnimatedSpan>
      <AnimatedSpan className="text-green-500">✔ user_data</AnimatedSpan>
      <TypingAnimation>{`> USE knowledge_base;`}</TypingAnimation>
      <AnimatedSpan className="text-muted-foreground">Database changed</AnimatedSpan>
      <TypingAnimation>{`> SELECT title FROM articles LIMIT 3;`}</TypingAnimation>
      <AnimatedSpan className="text-cyan-500">- &quot;Intro to AI&quot;</AnimatedSpan>
      <AnimatedSpan className="text-cyan-500">- &quot;Advanced Task Management&quot;</AnimatedSpan>
      <AnimatedSpan className="text-cyan-500">- &quot;Team Collaboration Guide&quot;</AnimatedSpan>
    </Terminal>
  </div>
);

// Latar belakang untuk "Analytics & Insights" (diperbarui dengan OrbitingCircles)
const AnalyticsBackground = () => (
  <div className="absolute inset-0 flex h-full w-full items-center justify-center [mask-image:linear-gradient(to_top,transparent_30%,#000_100%)]">
    <OrbitingCircles
      className="size-10 border-none bg-transparent"
      duration={20}
      delay={20}
      radius={40}
    >
      <Icons.notion />
    </OrbitingCircles>
    <OrbitingCircles
      className="size-10 border-none bg-transparent"
      duration={20}
      delay={10}
      radius={40}
    >
      <Icons.openai />
    </OrbitingCircles>
  </div>
);


// --- Komponen Utama ---
export function FeaturesSection() {
  const features: Feature[] = [
    {
      Icon: "div",
      name: "Smart Task Management",
      description:
        "Organize, prioritize, and track tasks with intelligent automation.",
      href: "#",
      cta: "Learn more",
      className: "col-span-3 lg:col-span-1",
      background: <TaskListBackground />,
    },
    {
      Icon: "div",
      name: "AI-Powered Intelligence",
      description:
        "Leverage AI to automate tasks, suggest priorities, and provide insights.",
      href: "#",
      cta: "Learn more",
      className: "col-span-3 lg:col-span-2",
      background: <AIGlobeBackground />,
    },
    {
      Icon: "div",
      name: "Knowledge Database",
      description:
        "Build and access your organization's knowledge base seamlessly.",
      href: "#",
      cta: "Learn more",
      className: "col-span-3 lg:col-span-2",
      background: <TerminalBackground />,
    },
    {
      Icon: "div",
      name: "Analytics & Insights",
      description:
        "Gain actionable insights with comprehensive analytics and tracking.",
      href: "#",
      cta: "Learn more",
      className: "col-span-3 lg:col-span-1",
      background: <AnalyticsBackground />, // <-- Diperbarui di sini
    },
  ];

  const { ref: sectionRef, isInView } = useInView<HTMLElement>({ threshold: 0.1 });

  return (
    <section ref={sectionRef} id="features" className="relative w-full overflow-hidden px-4 py-32 md:px-8">
      {/* Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden"></div>

      <div className="relative mx-auto max-w-7xl z-10">
        {/* Section Header */}
        <div className="mb-16 flex flex-col items-center text-center">
          <div
            className={`scroll-animate pop-in mb-4 inline-flex items-center rounded-full border border-primary/30 bg-primary/10 backdrop-blur-sm px-4 py-1.5 text-sm font-medium text-primary ${isInView ? 'in-view' : ''}`}
          >
            <Layers className="mr-2 size-4" />
            Features
          </div>
          <h2
            className={`scroll-animate slide-fade-up anim-delay-100 mb-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl ${isInView ? 'in-view' : ''}`}
          >
            Everything you need to
            <br />
            <span className="text-primary">boost productivity</span>
          </h2>
          <p
            className={`scroll-animate slide-fade-up-small anim-delay-200 max-w-2xl text-lg text-muted-foreground md:text-xl leading-relaxed ${isInView ? 'in-view' : ''}`}
          >
            Luminite AI combines powerful task management with cutting-edge AI
            technology to help you work smarter and achieve more.
          </p>
        </div>

        {/* Bento Grid */}
        <div>
          <BentoGrid>
            {features.map((feature, idx) => (
              <BentoCard
                key={idx}
                {...feature}
                className={cn(
                  feature.className,
                  "bento-card scroll-animate card-fade-scale",
                  isInView ? 'in-view' : ''
                )}
                style={{ animationDelay: `${0.3 + idx * 0.15}s` }}
              />
            ))}
          </BentoGrid>
        </div>
      </div>
    </section>
  );
}
