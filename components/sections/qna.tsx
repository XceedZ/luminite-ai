"use client";

import { HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useInView } from "@/hooks/use-in-view";

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
  const { ref: sectionRef, isInView } = useInView<HTMLElement>({ threshold: 0.1 });

  return (
    <section ref={sectionRef} id="qna" className="relative w-full overflow-hidden px-4 py-32 md:px-8">
      {/* Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden"></div>

      <div className="relative mx-auto max-w-4xl z-10">
        {/* Section Header */}
        <div className="mb-16 flex flex-col items-center text-center">
          <div
            className={`scroll-animate pop-in mb-4 inline-flex items-center rounded-full border border-primary/30 bg-primary/10 backdrop-blur-sm px-4 py-1.5 text-sm font-medium text-primary ${isInView ? 'in-view' : ''}`}
          >
            <HelpCircle className="mr-2 size-4" />
            FAQ
          </div>
          <h2
            className={`scroll-animate slide-fade-up anim-delay-100 mb-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl ${isInView ? 'in-view' : ''}`}
          >
            Frequently Asked
            <br />
            <span className="text-primary">Questions</span>
          </h2>
          <p
            className={`scroll-animate slide-fade-up-small anim-delay-200 max-w-2xl text-lg text-muted-foreground md:text-xl leading-relaxed ${isInView ? 'in-view' : ''}`}
          >
            Find answers to common questions about Luminite AI and how it can help transform your productivity.
          </p>
        </div>

        {/* Accordion */}
        <div>
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className={`scroll-animate slide-fade-up-small rounded-xl border border-primary/20 bg-primary/5 backdrop-blur-sm transition-all hover:bg-primary/10 hover:border-primary/30 data-[state=open]:bg-primary/10 data-[state=open]:border-primary/30 ${isInView ? 'in-view' : ''}`}
                style={{ animationDelay: `${0.3 + index * 0.1}s` }}
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
