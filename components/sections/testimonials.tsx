"use client";

import { Star, MessageCircle } from "lucide-react";
import { Marquee } from "@/components/ui/marquee";
import { useInView } from "@/hooks/use-in-view";

/**
 * Testimonials Section Component
 * Customer testimonials with marquee animation
 * @author AlexanderA
 */

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Product Manager",
    company: "TechFlow Inc.",
    content:
      "Luminite AI has completely transformed how our team manages projects. The AI suggestions are incredibly accurate and save us hours every week.",
    rating: 5,
    avatar: "SC",
  },
  {
    name: "Michael Rodriguez",
    role: "CEO",
    company: "StartupX",
    content:
      "The knowledge base integration is a game-changer. Finally, all our information is accessible right where we need it.",
    rating: 5,
    avatar: "MR",
  },
  {
    name: "Emily Watson",
    role: "Engineering Lead",
    company: "DevCorp",
    content:
      "Best task management tool we've ever used. The AI-powered automation handles all the tedious work, letting us focus on what matters.",
    rating: 5,
    avatar: "EW",
  },
  {
    name: "James Kim",
    role: "Operations Director",
    company: "LogiTech Solutions",
    content:
      "Implementation was seamless, and the results were immediate. Our team productivity increased by 40% in the first month.",
    rating: 5,
    avatar: "JK",
  },
  {
    name: "Lisa Anderson",
    role: "Marketing Director",
    company: "GrowthLab",
    content:
      "The analytics features provide insights we never had before. It's like having a productivity consultant built into our workflow.",
    rating: 5,
    avatar: "LA",
  },
  {
    name: "David Park",
    role: "CTO",
    company: "CloudNine",
    content:
      "Security and integration capabilities are top-notch. It connects with all our existing tools without any issues.",
    rating: 5,
    avatar: "DP",
  },
];

const TestimonialCard = ({
  name,
  role,
  company,
  content,
  rating,
  avatar,
}: {
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatar: string;
}) => {
  return (
    <div className="testimonial-card group relative w-[350px] cursor-pointer overflow-hidden rounded-xl border border-primary/20 bg-primary/5 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:bg-primary/10 hover:border-primary/30 hover:shadow-xl hover:scale-105">
      {/* Rating Stars */}
      <div className="mb-4 flex gap-1">
        {Array.from({ length: rating }).map((_, i) => (
          <Star
            key={i}
            className="size-4 fill-yellow-500 text-yellow-500"
          />
        ))}
      </div>

      {/* Content */}
      <p className="mb-6 text-sm text-foreground leading-relaxed">{content}</p>

      {/* Author Info */}
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-full bg-primary font-semibold text-primary-foreground">
          {avatar}
        </div>
        <div>
          <div className="font-semibold text-foreground">{name}</div>
          <div className="text-xs text-muted-foreground">
            {role} at {company}
          </div>
        </div>
      </div>
    </div>
  );
};

export function TestimonialsSection() {
  const { ref: sectionRef, isInView } = useInView<HTMLElement>({ threshold: 0.1 });

  const firstRow = testimonials.slice(0, testimonials.length / 2);
  const secondRow = testimonials.slice(testimonials.length / 2);

  return (
    <section ref={sectionRef} id="testimonials" className="relative w-full overflow-hidden px-4 py-32 md:px-8">
      {/* Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden"></div>

      <div className="relative mx-auto max-w-7xl z-10">
        {/* Section Header */}
        <div className="mb-16 flex flex-col items-center text-center">
          <div
            className={`scroll-animate pop-in mb-4 inline-flex items-center rounded-full border border-primary/30 bg-primary/10 backdrop-blur-sm px-4 py-1.5 text-sm font-medium text-primary ${isInView ? 'in-view' : ''}`}
          >
            <MessageCircle className="mr-2 size-4" />
            Testimonials
          </div>
          <h2
            className={`scroll-animate slide-fade-up anim-delay-100 mb-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl ${isInView ? 'in-view' : ''}`}
          >
            Loved by teams
            <br />
            <span className="text-primary">around the world</span>
          </h2>
          <p
            className={`scroll-animate slide-fade-up-small anim-delay-200 max-w-2xl text-lg text-muted-foreground md:text-xl leading-relaxed ${isInView ? 'in-view' : ''}`}
          >
            See what our customers have to say about their experience with
            Luminite AI.
          </p>
        </div>

        {/* Marquee Testimonials */}
        <div
          className={`scroll-animate card-fade-scale anim-delay-300 relative flex flex-col gap-4 ${isInView ? 'in-view' : ''}`}
        >
          <Marquee pauseOnHover className="[--duration:40s]">
            {firstRow.map((testimonial, idx) => (
              <TestimonialCard key={idx} {...testimonial} />
            ))}
          </Marquee>
          <Marquee reverse pauseOnHover className="[--duration:40s]">
            {secondRow.map((testimonial, idx) => (
              <TestimonialCard key={idx} {...testimonial} />
            ))}
          </Marquee>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-background" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-background" />
        </div>
      </div>
    </section>
  );
}
