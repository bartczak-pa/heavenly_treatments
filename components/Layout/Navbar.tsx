
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuContent,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Menu, ChevronRight, ChevronDown } from 'lucide-react';
import { treatmentCategories, categoryIconMap } from '@/lib/data/treatments';
import TreatmentCategoryLinks from '@/components/Layout/TreatmentCategoryLinks';
import { cn } from '@/lib/utils';

// --- Link Style Constants ---
const desktopCategoryLinkClasses: string = "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground";
const mobileCategoryLinkClasses: string = "text-sm text-foreground hover:text-primary";
// ---------------------------

export default function Navbar() {
  /**
   * Navbar Component
   * 
   * A responsive navigation bar component that provides:
   * - Desktop navigation with dropdown menus
   * - Mobile navigation with a collapsible sheet
   * - Treatment category navigation in both desktop and mobile views
   * 
   * Features:
   * - Responsive design with mobile-first approach
   * - Integration with TreatmentCategoryLinks component
   * - Uses Radix UI components for accessibility
   * 
   * @component
   * @example
   * ```tsx
   * <Navbar />
   * ```
   * 
   * @returns {JSX.Element} A responsive navigation bar
   */
  const [isMobileTreatmentsOpen, setIsMobileTreatmentsOpen] = useState(false);

  return (
    <header className="w-full border-b bg-secondary/15 backdrop-blur supports-[backdrop-filter]:bg-secondary/15 sticky z-40">
      <nav className="container flex h-16 items-center">
        
        {/* Left Navigation Menu - Desktop */}
        <div className="hidden lg:flex items-center space-x-6">
          <NavigationMenu className="relative z-50 pl-2">
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/" legacyBehavior passHref>
                  <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "bg-transparent")}>
                    Home
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/about" legacyBehavior passHref>
                  <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "bg-transparent")}>
                    About Me
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent">Treatments</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 bg-secondary/15">
                    <li className="row-span-2 md:row-span-3">
                      <NavigationMenuLink asChild>
                        <Link
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-secondary/50 to-secondary p-6 no-underline outline-none focus:shadow-md"
                          href="/treatments"
                        >
                          <div className="mb-2 mt-4 text-lg font-medium text-secondary-foreground">
                            All Treatments
                          </div>
                          <p className="text-sm leading-tight text-secondary-foreground/80">
                            Explore my full range of treatments.
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    {treatmentCategories.map((category) => {
                      const IconComponent = category.iconName ? categoryIconMap[category.iconName] : null;
                      return (
                        <li key={category.id}>
                          <NavigationMenuLink asChild>
                            <Link
                              href={`/treatments/${category.slug}`}
                              className={desktopCategoryLinkClasses}
                            >
                              <div className="flex items-center space-x-3">
                                {IconComponent && <IconComponent className="h-4 w-4 flex-shrink-0 text-primary" />}
                                <div className="text-sm font-medium leading-none">{category.name}</div>
                              </div>
                              {category.shortDescription && (
                                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1">
                                  {category.shortDescription}
                                </p>
                              )}
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      );
                    })}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/contact" legacyBehavior passHref>
                  <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "bg-transparent")}>
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
            <span className="text-xl font-bold font-serif text-primary">Heavenly Treatments with Hayleybell</span>
          </Link>
        </div>

        {/* Book Now Button - Desktop */}
        <div className="hidden lg:flex items-center">
          <Button variant="default" size="lg" asChild>
            <Link href="/treatments">
              Book Now
            </Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Toggle main menu">
                <Menu className="h-5 w-5" aria-hidden="true" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] z-50 bg-secondary ">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col space-y-3 mt-4 pl-4 pr-4">
                <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
                  Home
                </Link>
                <Link href="/about" className="text-sm font-medium transition-colors hover:text-primary">
                  About Me
                </Link>

                <Collapsible
                  open={isMobileTreatmentsOpen}
                  onOpenChange={setIsMobileTreatmentsOpen}
                >
                  <div className="flex items-center">
                     <Link href="/treatments" className="text-sm font-medium transition-colors hover:text-primary">
                       Treatments
                     </Link>
                     <CollapsibleTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="w-9 p-0 ml-2" 
                          aria-expanded={isMobileTreatmentsOpen}
                          aria-label="Toggle treatment categories"
                        >
                          {isMobileTreatmentsOpen ? (
                            <ChevronDown className="h-4 w-4" aria-hidden="true" />
                          ) : (
                            <ChevronRight className="h-4 w-4" aria-hidden="true" />
                          )}
                          <span className="sr-only">Toggle Treatments</span>
                        </Button>
                      </CollapsibleTrigger>
                  </div>

                  <CollapsibleContent>
                    <div className="flex flex-col space-y-2 pl-4 pt-2">
                      <Link href="/treatments" className={mobileCategoryLinkClasses}>
                        All Treatments
                      </Link>
                      <TreatmentCategoryLinks 
                        categories={treatmentCategories} 
                        showIcon={true}
                        baseLinkClasses={mobileCategoryLinkClasses}
                        textClasses="text-secondary-foreground hover:text-primary"
                        iconClasses="h-4 w-4 flex-shrink-0 text-primary pr-0.5"
                      />
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                <Link href="/contact" className="text-sm font-medium transition-colors hover:text-primary">
                  Contact
                </Link>
                <div className="pt-4">
                  <Button variant="default" className="w-full" asChild>
                    <Link href="/treatments">
                      Book Now
                    </Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}