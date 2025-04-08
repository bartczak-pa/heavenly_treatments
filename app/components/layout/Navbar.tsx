// components/layout/Navbar.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/app/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuContent,
  navigationMenuTriggerStyle,
} from "@/app/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/app/components/ui/sheet";
import { Menu } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-16 items-center">
        {/* Left Navigation Menu - Desktop */}
        <div className="hidden lg:flex items-center space-x-6">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Home
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/about" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    About Me
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Treatments</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4">
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                          href="/treatments"
                        >
                          <div className="mb-2 mt-4 text-lg font-medium">
                            All Treatments
                          </div>
                          <p className="text-sm leading-tight text-muted-foreground">
                            Explore our full range of treatments and find the perfect one for you.
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          href="/treatments/facial"
                        >
                          <div className="text-sm font-medium leading-none">Facial Treatments</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Rejuvenate your skin with our specialized facial treatments.
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          href="/treatments/massage"
                        >
                          <div className="text-sm font-medium leading-none">Massage Therapy</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Relax and unwind with our therapeutic massage services.
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          href="/treatments/body"
                        >
                          <div className="text-sm font-medium leading-none">Body Treatments</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Experience our luxurious body treatments and therapies.
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          href="/treatments/waxing"
                        >
                          <div className="text-sm font-medium leading-none">Waxing Services</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Professional waxing services for smooth, hair-free skin.
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          href="/treatments/nails"
                        >
                          <div className="text-sm font-medium leading-none">Nail Care</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Pamper your hands and feet with our nail care services.
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/contact" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Contact
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Centered Logo */}
        <div className="flex-1 flex justify-center">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">Heavenly Treatments with Hayleybell</span>
          </Link>
        </div>

        {/* Book Now Button - Desktop */}
        <div className="hidden lg:flex items-center">
          <Link href="/book">
            <Button variant="default" size="sm">
              Book Now
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col space-y-3 mt-4">
                <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
                  Home
                </Link>
                <Link href="/about" className="text-sm font-medium transition-colors hover:text-primary">
                  About Me
                </Link>
                <div className="flex flex-col space-y-2">
                  <Link href="/treatments" className="text-sm font-medium transition-colors hover:text-primary">
                    Treatments
                  </Link>
                  <div className="flex flex-col space-y-2 pl-4">
                    <Link href="/treatments" className="text-sm text-muted-foreground hover:text-primary">
                      All Treatments
                    </Link>
                    <Link href="/treatments/facial" className="text-sm text-muted-foreground hover:text-primary">
                      Facial Treatments
                    </Link>
                    <Link href="/treatments/massage" className="text-sm text-muted-foreground hover:text-primary">
                      Massage Therapy
                    </Link>
                    <Link href="/treatments/body" className="text-sm text-muted-foreground hover:text-primary">
                      Body Treatments
                    </Link>
                    <Link href="/treatments/waxing" className="text-sm text-muted-foreground hover:text-primary">
                      Waxing Services
                    </Link>
                    <Link href="/treatments/nails" className="text-sm text-muted-foreground hover:text-primary">
                      Nail Care
                    </Link>
                  </div>
                </div>
                <Link href="/contact" className="text-sm font-medium transition-colors hover:text-primary">
                  Contact
                </Link>
                <div className="pt-4">
                  <Link href="/book">
                    <Button variant="default" className="w-full">
                      Book Now
                    </Button>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}