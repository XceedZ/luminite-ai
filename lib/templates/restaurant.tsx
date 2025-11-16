// Modern Restaurant Template
// This is a reference template for AI to generate high-quality restaurant websites

"use client"

import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Navbar } from "@/components/navbar"
import {
  Clock, MapPin, Phone, Mail, Star, Award, Users, ChefHat,
  Calendar, ArrowRight, Check, Utensils, Wine, Coffee
} from "lucide-react"

export default function ModernRestaurant() {
  const menuCategories = [
    {
      name: "Starters",
      icon: Utensils,
      items: [
        { name: "Bruschetta", description: "Toasted bread with tomatoes, basil, and olive oil", price: "$12", featured: true },
        { name: "Calamari Fritti", description: "Crispy fried squid with lemon aioli", price: "$14" },
        { name: "Caprese Salad", description: "Fresh mozzarella, tomatoes, and basil", price: "$13" },
        { name: "Beef Carpaccio", description: "Thinly sliced beef with arugula and parmesan", price: "$16" }
      ]
    },
    {
      name: "Main Courses",
      icon: ChefHat,
      items: [
        { name: "Grilled Salmon", description: "Atlantic salmon with roasted vegetables", price: "$28", featured: true },
        { name: "Ribeye Steak", description: "Premium aged beef with herb butter", price: "$42" },
        { name: "Pasta Carbonara", description: "Classic Italian pasta with pancetta and egg", price: "$22" },
        { name: "Chicken Piccata", description: "Pan-seared chicken with lemon caper sauce", price: "$26" }
      ]
    },
    {
      name: "Desserts",
      icon: Coffee,
      items: [
        { name: "Tiramisu", description: "Classic Italian coffee-flavored dessert", price: "$10" },
        { name: "Panna Cotta", description: "Creamy vanilla custard with berry compote", price: "$9" },
        { name: "Chocolate Lava Cake", description: "Warm chocolate cake with vanilla ice cream", price: "$11", featured: true },
        { name: "Gelato Selection", description: "Assorted Italian ice cream flavors", price: "$8" }
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navbar
        logoText="Bella Vista"
        navItems={[
          { label: "Menu", href: "#menu" },
          { label: "About", href: "#about" },
          { label: "Gallery", href: "#gallery" },
          { label: "Contact", href: "#contact" }
        ]}
        rightContent={
          <Button size="sm" className="gap-2">
            <Calendar className="h-4 w-4" />
            Reserve Table
          </Button>
        }
      />

      {/* Hero Section */}
      <section className="relative h-[600px] sm:h-[700px] lg:h-[800px]">
        <div className="absolute inset-0">
          <img 
            src="https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg" 
            alt="Restaurant Interior" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30"></div>
        </div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="max-w-2xl text-white">
            <Badge className="mb-6 gap-1 bg-primary text-primary-foreground">
              <Award className="h-3 w-3" />
              Michelin Recommended
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl mb-6">
              Authentic Italian Cuisine
              <span className="block text-primary mt-2">In the Heart of the City</span>
            </h1>
            <p className="text-lg sm:text-xl mb-8 opacity-90">
              Experience the finest culinary journey with our carefully crafted menu
              featuring traditional Italian recipes and locally sourced ingredients.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="gap-2">
                View Menu <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 gap-2">
                <Calendar className="h-4 w-4" />
                Book a Table
              </Button>
            </div>
            <div className="mt-12 flex flex-wrap items-center gap-6 pt-6 border-t border-white/20">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-sm opacity-70">Opening Hours</div>
                  <div className="font-semibold">Tue-Sun: 11AM - 10PM</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-sm opacity-70">Reservations</div>
                  <div className="font-semibold">(555) 123-4567</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="py-16 border-y bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: Award, label: "Michelin Recommended", value: "2024" },
              { icon: ChefHat, label: "Expert Chefs", value: "15+" },
              { icon: Users, label: "Happy Customers", value: "10k+" },
              { icon: Star, label: "Average Rating", value: "4.9" }
            ].map((stat, index) => {
              const Icon = stat.icon
              return (
                <div key={index}>
                  <div className="inline-flex p-3 rounded-full bg-primary/10 mb-3">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-2xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="py-24 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Our Menu</h2>
            <p className="text-lg text-muted-foreground">
              Carefully curated dishes made with passion and the finest ingredients
            </p>
          </div>

          <div className="space-y-16">
            {menuCategories.map((category, categoryIndex) => {
              const Icon = category.icon
              return (
                <div key={categoryIndex}>
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold">{category.name}</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {category.items.map((item, itemIndex) => (
                      <Card key={itemIndex} className="hover:shadow-lg transition-shadow">
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-semibold text-lg">{item.name}</h4>
                                {item.featured && (
                                  <Badge className="gap-1">
                                    <Star className="h-3 w-3" />
                                    Chef's Special
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">{item.description}</p>
                            </div>
                            <span className="text-lg font-bold text-primary ml-4">{item.price}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-12 text-center">
            <Button size="lg" variant="outline" className="gap-2">
              View Full Menu <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section id="gallery" className="py-24 sm:py-32 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Gallery</h2>
            <p className="text-lg text-muted-foreground">
              A glimpse into our restaurant ambiance and culinary creations
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg",
              "https://images.pexels.com/photos/1310777/pexels-photo-1310777.jpeg",
              "https://images.pexels.com/photos/1579253/pexels-photo-1579253.jpeg",
              "https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg",
              "https://images.pexels.com/photos/2788792/pexels-photo-2788792.jpeg",
              "https://images.pexels.com/photos/1199957/pexels-photo-1199957.jpeg",
              "https://images.pexels.com/photos/3184192/pexels-photo-3184192.jpeg",
              "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg"
            ].map((image, index) => (
              <div key={index} className="aspect-square overflow-hidden rounded-lg">
                <img 
                  src={image} 
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About & Reservation */}
      <section id="about" className="py-24 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="secondary" className="mb-4">Our Story</Badge>
              <h2 className="text-3xl font-bold mb-6">
                Bringing Italy&apos;s Finest Flavors to Your Table
              </h2>
              <p className="text-muted-foreground mb-6">
                Since 2010, Bella Vista has been serving authentic Italian cuisine crafted with 
                passion and tradition. Our chefs bring years of experience from Italy&apos;s finest 
                kitchens, creating dishes that transport you to the heart of Italy.
              </p>
              <p className="text-muted-foreground mb-8">
                We believe in using only the freshest, locally sourced ingredients combined with 
                traditional Italian cooking techniques to create an unforgettable dining experience.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Authentic Italian recipes passed down through generations",
                  "Fresh, locally sourced ingredients",
                  "Extensive wine selection from Italian vineyards",
                  "Elegant ambiance perfect for any occasion"
                ].map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Reserve a Table</CardTitle>
                <CardDescription>Book your table for an unforgettable dining experience</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" placeholder="John Doe" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" type="tel" placeholder="(555) 123-4567" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">Date</Label>
                      <Input id="date" type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time">Time</Label>
                      <Input id="time" type="time" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="guests">Number of Guests</Label>
                    <Input id="guests" type="number" min="1" max="20" placeholder="2" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Special Requests (Optional)</Label>
                    <Input id="message" placeholder="Any dietary requirements or preferences" />
                  </div>
                  <Button className="w-full" size="lg">Confirm Reservation</Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-24 sm:py-32 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Visit Us</h2>
            <p className="text-lg text-muted-foreground">
              We&apos;d love to welcome you to Bella Vista
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: MapPin,
                title: "Address",
                content: "123 Main Street, Downtown\nCity, State 12345"
              },
              {
                icon: Phone,
                title: "Phone",
                content: "(555) 123-4567\nReservations & Inquiries"
              },
              {
                icon: Clock,
                title: "Hours",
                content: "Tue-Thu: 11AM - 9PM\nFri-Sun: 11AM - 10PM\nMonday: Closed"
              }
            ].map((info, index) => {
              const Icon = info.icon
              return (
                <Card key={index} className="text-center">
                  <CardContent className="pt-6">
                    <div className="inline-flex p-4 rounded-full bg-primary/10 mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{info.title}</h3>
                    <p className="text-sm text-muted-foreground whitespace-pre-line">{info.content}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Bella Vista</h3>
              <p className="text-muted-foreground mb-4">
                Authentic Italian cuisine in the heart of the city. 
                Experience tradition, taste, and excellence.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#menu" className="hover:text-foreground transition-colors">Menu</a></li>
                <li><a href="#about" className="hover:text-foreground transition-colors">About</a></li>
                <li><a href="#gallery" className="hover:text-foreground transition-colors">Gallery</a></li>
                <li><a href="#contact" className="hover:text-foreground transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <p className="text-sm text-muted-foreground mb-2">Follow us on social media</p>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" className="rounded-full">
                  <Mail className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full">
                  <Phone className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          <Separator className="mb-8" />
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2024 Bella Vista Restaurant. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
