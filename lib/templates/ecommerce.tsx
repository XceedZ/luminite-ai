// Modern E-commerce Template
// This is a reference template for AI to generate high-quality e-commerce websites

"use client"

import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Navbar } from "@/components/navbar"
import {
  ShoppingCart, Heart, Star, Search, Filter, SlidersHorizontal,
  Check, Truck, Shield, Clock, ArrowRight, Tag, Package, Gift
} from "lucide-react"

export default function ModernEcommerce() {
  const products = [
    {
      name: "Premium Wireless Watch",
      price: 299,
      originalPrice: 399,
      image: "https://images.pexels.com/photos/277319/pexels-photo-277319.jpeg",
      badge: "Sale",
      rating: 4.8,
      reviews: 124,
      inStock: true
    },
    {
      name: "Noise-Cancelling Headphones",
      price: 199,
      image: "https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg",
      badge: "New",
      rating: 4.9,
      reviews: 89,
      inStock: true
    },
    {
      name: "Leather Laptop Backpack",
      price: 149,
      image: "https://images.pexels.com/photos/2905238/pexels-photo-2905238.jpeg",
      rating: 4.7,
      reviews: 203,
      inStock: true
    },
    {
      name: "Smart Fitness Tracker",
      price: 99,
      image: "https://images.pexels.com/photos/437036/pexels-photo-437036.jpeg",
      badge: "Bestseller",
      rating: 4.6,
      reviews: 567,
      inStock: true
    },
    {
      name: "Minimalist Sunglasses",
      price: 79,
      originalPrice: 120,
      image: "https://images.pexels.com/photos/701877/pexels-photo-701877.jpeg",
      badge: "Sale",
      rating: 4.5,
      reviews: 94,
      inStock: false
    },
    {
      name: "Designer Tote Bag",
      price: 189,
      image: "https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg",
      rating: 4.8,
      reviews: 156,
      inStock: true
    },
    {
      name: "Portable Bluetooth Speaker",
      price: 129,
      image: "https://images.pexels.com/photos/1279406/pexels-photo-1279406.jpeg",
      badge: "New",
      rating: 4.7,
      reviews: 234,
      inStock: true
    },
    {
      name: "Professional Camera Lens",
      price: 599,
      image: "https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg",
      rating: 4.9,
      reviews: 78,
      inStock: true
    }
  ]

  const categories = [
    { name: "Electronics", count: 234, icon: Package },
    { name: "Fashion", count: 156, icon: Tag },
    { name: "Home & Living", count: 89, icon: Gift },
    { name: "Sports", count: 67, icon: Heart }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navbar
        logoText="ShopHub"
        navItems={[
          { label: "Shop", href: "#products" },
          { label: "Collections", href: "#collections" },
          { label: "Deals", href: "#deals" },
          { label: "About", href: "#about" }
        ]}
        rightContent={
          <>
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Heart className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="sm" className="gap-2 relative">
              <ShoppingCart className="h-5 w-5" />
              <span className="hidden sm:inline">Cart</span>
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center">
                3
              </Badge>
            </Button>
          </>
        }
      />

      {/* Hero Section */}
      <section className="py-20 sm:py-32 lg:py-40 bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="secondary" className="mb-6 gap-1">
                <Tag className="h-3 w-3" />
                Spring Collection 2024
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl mb-6">
                Discover Your Perfect Style
              </h1>
              <p className="text-lg leading-8 text-muted-foreground sm:text-xl mb-8">
                Curated collection of premium products designed for modern living. 
                Quality meets affordability in every piece.
              </p>
              <div className="flex flex-wrap items-center gap-4 mb-8">
                <Button size="lg" className="gap-2">
                  Shop Now <ArrowRight className="h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline">View Collection</Button>
              </div>
              <div className="grid grid-cols-3 gap-6 pt-8 border-t">
                <div>
                  <div className="flex items-center gap-2 text-primary mb-1">
                    <Truck className="h-5 w-5" />
                    <span className="font-semibold">Free Shipping</span>
                  </div>
                  <p className="text-sm text-muted-foreground">On orders over $100</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-primary mb-1">
                    <Shield className="h-5 w-5" />
                    <span className="font-semibold">Secure Payment</span>
                  </div>
                  <p className="text-sm text-muted-foreground">100% protected</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-primary mb-1">
                    <Clock className="h-5 w-5" />
                    <span className="font-semibold">24/7 Support</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Always here to help</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden bg-muted">
                <img 
                  src="https://images.pexels.com/photos/1927769/pexels-photo-1927769.jpeg" 
                  alt="Hero"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-primary text-primary-foreground p-6 rounded-xl shadow-2xl">
                <div className="text-3xl font-bold">50%</div>
                <div className="text-sm">Off Selected Items</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="collections" className="py-16 border-y">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category, index) => {
              const Icon = category.icon
              return (
                <Card key={index} className="hover:shadow-lg transition-all cursor-pointer group">
                  <CardContent className="pt-6 text-center">
                    <div className="inline-flex p-4 rounded-full bg-primary/10 group-hover:bg-primary group-hover:text-primary-foreground transition-colors mb-4">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold mb-1">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">{category.count} products</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Products Grid with Filters */}
      <section id="products" className="py-24 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
            <div>
              <h2 className="text-3xl font-bold">Featured Products</h2>
              <p className="text-muted-foreground mt-2">Discover our handpicked collection</p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Input placeholder="Search products..." className="w-full sm:w-64" />
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product, index) => (
              <Card key={index} className="group overflow-hidden hover:shadow-xl transition-all">
                <div className="relative aspect-square overflow-hidden bg-muted">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {product.badge && (
                    <Badge className="absolute top-4 left-4">
                      {product.badge}
                    </Badge>
                  )}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="icon" variant="secondary" className="rounded-full">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                      <Badge variant="secondary">Out of Stock</Badge>
                    </div>
                  )}
                </div>
                <CardContent className="pt-4">
                  <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-1 mb-3">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-3 w-3 ${i < Math.floor(product.rating) ? 'fill-yellow-500 text-yellow-500' : 'text-muted'}`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      ({product.reviews})
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold">${product.price}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through ml-2">
                          ${product.originalPrice}
                        </span>
                      )}
                    </div>
                    <Button 
                      size="icon" 
                      className="rounded-full"
                      disabled={!product.inStock}
                    >
                      <ShoppingCart className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button size="lg" variant="outline" className="gap-2">
              Load More Products <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 sm:py-32 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                icon: Truck,
                title: "Free Shipping",
                description: "Free shipping on orders over $100"
              },
              {
                icon: Shield,
                title: "Secure Payment",
                description: "Your payment information is safe"
              },
              {
                icon: Clock,
                title: "24/7 Support",
                description: "Get help whenever you need it"
              },
              {
                icon: Gift,
                title: "Gift Cards",
                description: "Perfect gift for your loved ones"
              }
            ].map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex p-4 rounded-full bg-primary/10 mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 sm:py-32 border-t">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Subscribe to get special offers, free giveaways, and exclusive deals
            </p>
            <div className="flex gap-2 max-w-md mx-auto">
              <Input placeholder="Enter your email" type="email" className="flex-1" />
              <Button className="gap-2">
                Subscribe <ArrowRight className="h-4 w-4" />
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
              <h3 className="text-xl font-bold mb-4">ShopHub</h3>
              <p className="text-muted-foreground mb-4">
                Your one-stop destination for premium products at affordable prices.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Shop</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Collections</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Deals</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">FAQs</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Shipping</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Returns</a></li>
              </ul>
            </div>
          </div>
          <Separator className="mb-8" />
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>© 2024 ShopHub. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="hover:text-foreground transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
