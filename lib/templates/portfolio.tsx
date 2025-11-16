// Modern Portfolio Template
// This is a reference template for AI to generate high-quality portfolio websites

"use client"

import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Navbar } from "@/components/navbar"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { 
  Mail, Github, Linkedin, Twitter, 
  ExternalLink, Star, Award, Users, Briefcase,
  ArrowRight, Code, Palette, Layout, Check
} from "lucide-react"

export default function ModernPortfolio() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navbar
        logoText="John Doe"
        navItems={[
          { label: "Work", href: "#work" },
          { label: "About", href: "#about" },
          { label: "Services", href: "#services" },
          { label: "Testimonials", href: "#testimonials" },
          { label: "Contact", href: "#contact" }
        ]}
        rightContent={<Button size="sm">Hire Me</Button>}
      />

      {/* Hero Section */}
      <section className="py-20 sm:py-32 lg:py-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-8 flex justify-center">
              <Avatar className="h-32 w-32 border-4 border-primary/20">
                <AvatarImage src="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg" />
                <AvatarFallback className="text-4xl">JD</AvatarFallback>
              </Avatar>
            </div>
            <Badge variant="secondary" className="mb-6">Available for Freelance</Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              Creative Designer &<br />Full-Stack Developer
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground sm:text-xl max-w-2xl mx-auto">
              I craft beautiful digital experiences that combine elegant design and clean code 
              to create meaningful products that users love and businesses need.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Button size="lg" className="gap-2">
                View My Work <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline">Download Resume</Button>
            </div>
            
            {/* Social Links */}
            <div className="mt-10 flex items-center justify-center gap-4">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Github className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Linkedin className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Mail className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 text-center">
            <div>
              <div className="text-4xl font-bold text-primary">150+</div>
              <div className="mt-2 text-sm text-muted-foreground">Projects Completed</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary">50+</div>
              <div className="mt-2 text-sm text-muted-foreground">Happy Clients</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary">5+</div>
              <div className="mt-2 text-sm text-muted-foreground">Years Experience</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary">15+</div>
              <div className="mt-2 text-sm text-muted-foreground">Awards Won</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Work Section */}
      <section id="work" className="py-24 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Featured Projects</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              A curated selection of my recent work showcasing various skills and technologies
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "E-Commerce Platform",
                description: "Modern e-commerce solution with seamless checkout experience and real-time inventory management",
                tags: ["React", "Next.js", "TypeScript", "Stripe"],
                image: "https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg",
                featured: true,
                stats: { users: "10k+", rating: "4.8" }
              },
              {
                title: "SaaS Dashboard",
                description: "Analytics dashboard with real-time data visualization, custom reports, and team collaboration",
                tags: ["React", "Tailwind", "Chart.js", "Node.js"],
                image: "https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg",
                featured: true,
                stats: { users: "5k+", rating: "4.9" }
              },
              {
                title: "Mobile App Design",
                description: "Complete UI/UX design system for fitness tracking mobile application with 50+ screens",
                tags: ["Figma", "Design System", "Prototyping"],
                image: "https://images.pexels.com/photos/887751/pexels-photo-887751.jpeg",
                stats: { users: "20k+", rating: "4.7" }
              },
              {
                title: "Brand Identity System",
                description: "Complete brand identity design including logo, color palette, typography, and brand guidelines",
                tags: ["Branding", "Logo Design", "Identity"],
                image: "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg",
                stats: { clients: "15+", rating: "5.0" }
              },
              {
                title: "Marketing Landing Page",
                description: "High-converting landing page for SaaS product launch with A/B testing and analytics",
                tags: ["Next.js", "Framer Motion", "SEO"],
                image: "https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg",
                stats: { conversion: "35%", rating: "4.8" }
              },
              {
                title: "Social Media Platform",
                description: "Full-stack social platform with real-time chat, posts, stories, and user authentication",
                tags: ["Full Stack", "Socket.io", "PostgreSQL"],
                image: "https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg",
                featured: true,
                stats: { users: "50k+", rating: "4.6" }
              }
            ].map((project, index) => (
              <Card key={index} className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="aspect-video overflow-hidden relative">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {project.featured && (
                    <Badge className="absolute top-4 right-4 gap-1">
                      <Star className="h-3 w-3" /> Featured
                    </Badge>
                  )}
                </div>
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="group-hover:text-primary transition-colors">
                      {project.title}
                    </CardTitle>
                    <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <CardDescription className="line-clamp-2">{project.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, tagIndex) => (
                      <Badge key={tagIndex} variant="secondary" className="text-xs">{tag}</Badge>
                    ))}
                  </div>
                  {project.stats && (
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>{project.stats.users || project.stats.clients || project.stats.conversion}</span>
                      </div>
                      {project.stats.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-current text-yellow-500" />
                          <span>{project.stats.rating}</span>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button variant="outline" size="lg" className="gap-2">
              View All Projects <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 sm:py-32 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">What I Do</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Comprehensive digital services to bring your ideas to life
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Code,
                title: "Web Development",
                description: "Building fast, responsive, and scalable web applications using modern technologies like React, Next.js, and TypeScript.",
                features: ["Responsive Design", "Performance Optimization", "SEO Friendly", "Cross-Browser Compatible"]
              },
              {
                icon: Palette,
                title: "UI/UX Design",
                description: "Creating intuitive and beautiful user interfaces that provide exceptional user experiences and drive engagement.",
                features: ["User Research", "Wireframing", "Prototyping", "Design Systems"]
              },
              {
                icon: Layout,
                title: "Brand Identity",
                description: "Developing comprehensive brand identities that tell your story and connect with your audience authentically.",
                features: ["Logo Design", "Color Palette", "Typography", "Brand Guidelines"]
              }
            ].map((service, index) => (
              <Card key={index} className="hover:border-primary transition-colors">
                <CardHeader>
                  <div className="mb-4 inline-flex p-3 rounded-lg bg-primary/10 w-fit">
                    <service.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{service.title}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="relative">
              <div className="aspect-square overflow-hidden rounded-2xl">
                <img 
                  src="https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg" 
                  alt="About Me" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-primary text-primary-foreground p-6 rounded-xl shadow-lg">
                <div className="text-3xl font-bold">5+</div>
                <div className="text-sm">Years of Experience</div>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <Badge variant="secondary" className="mb-4">About Me</Badge>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                  Turning Ideas Into Reality Through Design & Code
                </h2>
                <p className="text-muted-foreground text-lg">
                  I&apos;m a passionate designer and developer with over 5 years of experience 
                  creating digital products that make a difference. I specialize in building 
                  beautiful, functional interfaces that users love.
                </p>
              </div>
              <p className="text-muted-foreground">
                My approach combines creative design thinking with technical expertise to deliver 
                solutions that are both visually appealing and highly performant. I believe in 
                clean code, pixel-perfect designs, and seamless user experiences.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Award className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold">Award Winner</div>
                    <div className="text-sm text-muted-foreground">15+ Design Awards</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Briefcase className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold">Professional</div>
                    <div className="text-sm text-muted-foreground">150+ Projects</div>
                  </div>
                </div>
              </div>
              <div className="pt-4">
                <Button size="lg" className="gap-2">
                  Learn More About Me <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-24 sm:py-32 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Skills & Expertise</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Technologies and tools I use to bring ideas to life
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                category: "Frontend Development",
                skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Vue.js", "JavaScript"]
              },
              {
                category: "Backend Development",
                skills: ["Node.js", "PostgreSQL", "MongoDB", "REST APIs", "GraphQL", "Redis"]
              },
              {
                category: "Design & Tools",
                skills: ["Figma", "Adobe XD", "Photoshop", "Illustrator", "Git", "VS Code"]
              }
            ].map((group, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{group.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {group.skills.map((skill, skillIndex) => (
                      <Badge key={skillIndex} variant="secondary">{skill}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Client Testimonials</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              What my clients say about working with me
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                quote: "John delivered exceptional work on our e-commerce platform. The attention to detail and user experience is outstanding. Highly recommended!",
                author: "Sarah Johnson",
                role: "CEO at TechCorp",
                avatar: "SJ",
                rating: 5
              },
              {
                quote: "Working with John was a pleasure. He understood our vision perfectly and delivered a product that exceeded our expectations.",
                author: "Michael Chen",
                role: "Founder of StartupXYZ",
                avatar: "MC",
                rating: 5
              },
              {
                quote: "Professional, creative, and reliable. John transformed our outdated website into a modern, conversion-focused design.",
                author: "Emily Rodriguez",
                role: "Marketing Director",
                avatar: "ER",
                rating: 5
              }
            ].map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current text-yellow-500" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6">
                    &quot;{testimonial.quote}&quot;
                  </p>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{testimonial.avatar}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold">{testimonial.author}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 sm:py-32 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Let&apos;s Work Together</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Have a project in mind? I&apos;d love to hear from you. Let&apos;s create something amazing together.
              </p>
            </div>
            
            <Card>
              <CardContent className="pt-6">
                <form className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" placeholder="John Doe" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="john@example.com" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" placeholder="Project inquiry" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea 
                      id="message" 
                      placeholder="Tell me about your project..." 
                      className="min-h-32"
                    />
                  </div>
                  <Button size="lg" className="w-full">Send Message</Button>
                </form>
              </CardContent>
            </Card>
            
            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
              <Card className="text-center">
                <CardContent className="pt-6">
                  <Mail className="h-6 w-6 mx-auto mb-3 text-primary" />
                  <div className="font-semibold mb-1">Email</div>
                  <div className="text-sm text-muted-foreground">john@example.com</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <Github className="h-6 w-6 mx-auto mb-3 text-primary" />
                  <div className="font-semibold mb-1">GitHub</div>
                  <div className="text-sm text-muted-foreground">@johndoe</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <Linkedin className="h-6 w-6 mx-auto mb-3 text-primary" />
                  <div className="font-semibold mb-1">LinkedIn</div>
                  <div className="text-sm text-muted-foreground">/in/johndoe</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
              <div className="md:col-span-2">
                <h3 className="text-xl font-bold mb-4">John Doe</h3>
                <p className="text-muted-foreground mb-4">
                  Creative Designer & Full-Stack Developer passionate about building 
                  beautiful digital experiences.
                </p>
                <div className="flex gap-3">
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Github className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Linkedin className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Twitter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><a href="#work" className="hover:text-foreground transition-colors">Work</a></li>
                  <li><a href="#about" className="hover:text-foreground transition-colors">About</a></li>
                  <li><a href="#services" className="hover:text-foreground transition-colors">Services</a></li>
                  <li><a href="#contact" className="hover:text-foreground transition-colors">Contact</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Services</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>Web Development</li>
                  <li>UI/UX Design</li>
                  <li>Brand Identity</li>
                  <li>Consulting</li>
                </ul>
              </div>
            </div>
            <Separator />
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
              <p>© 2024 John Doe. All rights reserved.</p>
              <div className="flex gap-6">
                <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
