// Modern Blog Template
// This is a reference template for AI to generate high-quality blog websites

"use client"

import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Navbar } from "@/components/navbar"
import {
  Calendar, Clock, User, ArrowRight, Search, Mail,
  Tag, TrendingUp, Heart, MessageCircle, Share2, Bookmark,
  ChevronRight, Eye, Twitter, Facebook, Linkedin
} from "lucide-react"

export default function ModernBlog() {
  const posts = [
    {
      title: "Getting Started with React 19",
      excerpt: "Learn the fundamentals of React 19 and build your first application with this comprehensive guide covering hooks, components, and state management.",
      category: "Tutorial",
      image: "https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg",
      author: "Sarah Johnson",
      date: "Mar 14, 2024",
      readTime: "8 min",
      views: "2.4k",
      likes: 156,
      featured: false
    },
    {
      title: "Modern CSS Techniques",
      excerpt: "Explore advanced CSS features including Grid, Flexbox, and custom properties to create responsive and maintainable stylesheets.",
      category: "Design",
      image: "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg",
      author: "Mike Chen",
      date: "Mar 13, 2024",
      readTime: "6 min",
      views: "1.8k",
      likes: 203,
      featured: true
    },
    {
      title: "TypeScript Best Practices",
      excerpt: "Master TypeScript with these proven best practices and patterns that will make your code more maintainable and type-safe.",
      category: "Development",
      image: "https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg",
      author: "Emily Rodriguez",
      date: "Mar 12, 2024",
      readTime: "10 min",
      views: "3.1k",
      likes: 287,
      featured: false
    },
    {
      title: "Building Scalable APIs",
      excerpt: "Learn how to design and implement RESTful APIs that scale with your application using Node.js and best practices.",
      category: "Backend",
      image: "https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg",
      author: "David Park",
      date: "Mar 11, 2024",
      readTime: "12 min",
      views: "2.7k",
      likes: 189,
      featured: false
    },
    {
      title: "UI/UX Design Principles",
      excerpt: "Essential design principles every developer should know to create intuitive and beautiful user interfaces.",
      category: "Design",
      image: "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg",
      author: "Lisa Wang",
      date: "Mar 10, 2024",
      readTime: "7 min",
      views: "1.9k",
      likes: 234,
      featured: false
    },
    {
      title: "Performance Optimization Tips",
      excerpt: "Boost your website's performance with these proven optimization techniques and best practices for faster load times.",
      category: "Performance",
      image: "https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg",
      author: "Tom Anderson",
      date: "Mar 9, 2024",
      readTime: "9 min",
      views: "2.2k",
      likes: 178,
      featured: true
    }
  ]

  const categories = [
    { name: "Tutorial", count: 24, color: "bg-blue-500" },
    { name: "Design", count: 18, color: "bg-purple-500" },
    { name: "Development", count: 32, color: "bg-green-500" },
    { name: "Backend", count: 15, color: "bg-orange-500" },
    { name: "Performance", count: 12, color: "bg-red-500" }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navbar
        logoText="DevBlog"
        navItems={[
          { label: "Articles", href: "#posts" },
          { label: "Categories", href: "#categories" },
          { label: "About", href: "#about" },
          { label: "Newsletter", href: "#newsletter" }
        ]}
        rightContent={
          <>
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
            <Button size="sm" className="gap-2">
              <Mail className="h-4 w-4" />
              Subscribe
            </Button>
          </>
        }
      />

      {/* Hero Section */}
      <section className="py-20 sm:py-32 lg:py-40 border-b bg-gradient-to-b from-muted/50 to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-6 gap-1">
              <TrendingUp className="h-3 w-3" />
              Trending Topics
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl mb-6">
              Stories, Insights & Ideas
            </h1>
            <p className="text-lg leading-8 text-muted-foreground sm:text-xl">
              Discover in-depth articles, tutorials, and thoughts on design, development, 
              and technology from our community of expert writers
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  type="search" 
                  placeholder="Search articles..." 
                  className="pl-10 h-12"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold">Featured Article</h2>
          </div>
          <Card className="overflow-hidden border-2 hover:shadow-2xl transition-shadow">
            <div className="grid lg:grid-cols-2">
              <div className="aspect-video lg:aspect-auto overflow-hidden">
                <img 
                  src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg" 
                  alt="Featured Post"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-6">
                  <Badge className="gap-1">
                    <TrendingUp className="h-3 w-3" />
                    Featured
                  </Badge>
                  <Badge variant="secondary">Development</Badge>
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    5 min read
                  </span>
                </div>
                <CardTitle className="text-3xl lg:text-4xl mb-4">
                  The Future of Web Development in 2024
                </CardTitle>
                <CardDescription className="text-base mb-6">
                  Exploring the latest trends and technologies shaping the future of web development,
                  from AI integration to modern frameworks, server components, and the evolution of 
                  developer tools that are transforming how we build for the web.
                </CardDescription>
                <div className="flex items-center gap-4 mb-6">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">John Doe</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      March 15, 2024
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-sm text-muted-foreground mb-6">
                  <span className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    5.2k views
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="h-4 w-4" />
                    324 likes
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="h-4 w-4" />
                    48 comments
                  </span>
                </div>
                <Button size="lg" className="gap-2 w-fit">
                  Read Article <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Posts Grid with Sidebar */}
      <section id="posts" className="py-24 sm:py-32 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-8">
              <div className="mb-8">
                <h2 className="text-3xl font-bold">Recent Articles</h2>
                <p className="text-muted-foreground mt-2">Latest posts from our writers</p>
              </div>
              
              <div className="space-y-8">
                {posts.map((post, index) => (
                  <Card key={index} className="overflow-hidden hover:shadow-lg transition-all">
                    <div className="grid sm:grid-cols-3">
                      <div className="aspect-video sm:aspect-auto overflow-hidden">
                        <img 
                          src={post.image} 
                          alt={post.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="sm:col-span-2 p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant="secondary">{post.category}</Badge>
                          {post.featured && (
                            <Badge className="gap-1">
                              <TrendingUp className="h-3 w-3" />
                              Trending
                            </Badge>
                          )}
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {post.readTime}
                          </span>
                        </div>
                        <CardTitle className="text-xl mb-3 hover:text-primary transition-colors cursor-pointer">
                          {post.title}
                        </CardTitle>
                        <CardDescription className="mb-4 line-clamp-2">
                          {post.excerpt}
                        </CardDescription>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="text-xs">
                                {post.author.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div className="text-sm">
                              <p className="font-semibold">{post.author}</p>
                              <p className="text-muted-foreground text-xs">{post.date}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {post.views}
                            </span>
                            <span className="flex items-center gap-1">
                              <Heart className="h-3 w-3" />
                              {post.likes}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <div className="mt-12 text-center">
                <Button variant="outline" size="lg" className="gap-2">
                  Load More Articles <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-4 space-y-8">
              {/* Categories */}
              <Card id="categories">
                <CardHeader>
                  <CardTitle>Categories</CardTitle>
                  <CardDescription>Browse by topic</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {categories.map((category, index) => (
                      <button
                        key={index}
                        className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors text-left"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`h-2 w-2 rounded-full ${category.color}`}></div>
                          <span className="font-medium">{category.name}</span>
                        </div>
                        <Badge variant="secondary">{category.count}</Badge>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Popular Posts */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Popular Posts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {posts.slice(0, 4).map((post, index) => (
                      <div key={index} className="space-y-2">
                        <h4 className="font-semibold text-sm hover:text-primary transition-colors cursor-pointer line-clamp-2">
                          {post.title}
                        </h4>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {post.views}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="h-3 w-3" />
                            {post.likes}
                          </span>
                        </div>
                        {index < 3 && <Separator className="mt-4" />}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Newsletter */}
              <Card id="newsletter" className="bg-primary text-primary-foreground">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="inline-flex p-3 rounded-lg bg-primary-foreground/10">
                      <Mail className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold mb-2">Subscribe to Newsletter</h3>
                      <p className="text-sm text-primary-foreground/80">
                        Get the latest articles and insights delivered to your inbox weekly
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Input 
                        type="email" 
                        placeholder="Your email address" 
                        className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50"
                      />
                      <Button variant="secondary" className="w-full">
                        Subscribe Now
                      </Button>
                    </div>
                    <p className="text-xs text-primary-foreground/60">
                      Join 5,000+ developers. Unsubscribe anytime.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Tags */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Tag className="h-5 w-5" />
                    Popular Tags
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {["React", "JavaScript", "TypeScript", "CSS", "Node.js", "Next.js", "UI/UX", "Web Dev", "Performance", "API", "Database", "Security"].map((tag, index) => (
                      <Badge key={index} variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </aside>
          </div>
        </div>
      </section>

      {/* About/Author Section */}
      <section id="about" className="py-24 sm:py-32 border-t">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold mb-4">About This Blog</h2>
            <p className="text-lg text-muted-foreground mb-8">
              A community-driven platform sharing knowledge, experiences, and insights about 
              modern web development, design, and technology. Written by developers, for developers.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button variant="outline" size="icon">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Linkedin className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <h3 className="text-xl font-bold mb-4">DevBlog</h3>
              <p className="text-muted-foreground mb-4">
                Sharing knowledge and insights about web development, 
                design, and technology.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#posts" className="hover:text-foreground transition-colors">Articles</a></li>
                <li><a href="#categories" className="hover:text-foreground transition-colors">Categories</a></li>
                <li><a href="#about" className="hover:text-foreground transition-colors">About</a></li>
                <li><a href="#newsletter" className="hover:text-foreground transition-colors">Newsletter</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Categories</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {categories.slice(0, 4).map((cat, index) => (
                  <li key={index}>
                    <a href="#" className="hover:text-foreground transition-colors">{cat.name}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <Separator className="mb-8" />
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>© 2024 DevBlog. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="hover:text-foreground transition-colors">RSS Feed</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
