"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
  label: string
  href: string
}

interface NavbarProps {
  logo?: React.ReactNode
  logoImg?: string
  logoText?: string
  navItems?: NavItem[]
  rightContent?: React.ReactNode
  className?: string
}

export function Navbar({ 
  logo, 
  logoImg,
  logoText = "Logo",
  navItems = [],
  rightContent,
  className 
}: NavbarProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <header className={cn("sticky top-0 z-50 w-full border-b bg-background", className)}>
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            {logo || (logoImg ? (
              <img 
                src={logoImg} 
                alt={logoText || "Logo"} 
                className="h-8 w-8 rounded-lg object-cover"
              />
            ) : (
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">
                  {logoText.charAt(0).toUpperCase()}
                </span>
              </div>
            ))}
            {logoText && !logo && (
              <span className="text-xl font-bold">{logoText}</span>
            )}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-200 relative group"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full"></span>
              </a>
            ))}
          </div>

          {/* Right Content (Desktop) */}
          <div className="hidden md:flex items-center gap-4">
            {rightContent}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            {rightContent && (
              <div className="flex items-center gap-2">
                {rightContent}
              </div>
            )}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col gap-4 mt-8">
                  {/* Mobile Logo */}
                  <div className="flex items-center gap-2 pb-4 border-b">
                    {logo || (logoImg ? (
                      <img 
                        src={logoImg} 
                        alt={logoText || "Logo"} 
                        className="h-8 w-8 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                        <span className="text-primary-foreground font-bold text-lg">
                          {logoText.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    ))}
                    {logoText && !logo && (
                      <span className="text-xl font-bold">{logoText}</span>
                    )}
                  </div>

                  {/* Mobile Navigation */}
                  <nav className="flex flex-col gap-2">
                    {navItems.map((item) => (
                      <a
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200 rounded-md px-3 py-2 -mx-3"
                      >
                        {item.label}
                      </a>
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  )
}

