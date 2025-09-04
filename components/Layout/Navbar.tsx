
'use client';

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
import { treatmentCategories, categoryIconMap, type TreatmentCategory } from '@/lib/data/treatments';
import TreatmentCategoryLinks from './TreatmentCategoryLinks';
import { cn } from '@/lib/utils';

// --- TypeScript Interfaces ---
interface NavbarProps {
  className?: string;
}

interface NavigationItem {
  href: string;
  label: string;
}

interface CategoryWithIcon extends TreatmentCategory {
  IconComponent: React.ComponentType<{ className?: string }> | null;
}

// --- Navigation Configuration ---
const NAVIGATION_ITEMS: readonly NavigationItem[] = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Me' },
  { href: '/contact', label: 'Contact' }
] as const;

// --- Style Constants ---
const STYLES = {
  desktopCategoryLink: "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
  mobileCategoryLink: "text-sm hover:text-primary",
  focusRing: "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
} as const;

// --- Computed Constants ---
const categoriesWithIcons: CategoryWithIcon[] = treatmentCategories.map((category) => ({
  ...category,
  IconComponent: category.iconName ? categoryIconMap[category.iconName] : null,
}));

export default function Navbar({ className }: NavbarProps = {}) {
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
   * - Performance optimized with memoization and callbacks
   * - Full TypeScript support with proper interfaces
   *
   * @component
   * @example
   * ```tsx
   * <Navbar className="custom-navbar" />
   * ```
   *
   * @param {NavbarProps} props - Component properties
   * @returns {JSX.Element} A responsive navigation bar
   */
  const pathname = usePathname();
  const [isMobileTreatmentsOpen, setIsMobileTreatmentsOpen] = useState(false);

  // Callback to prevent unnecessary re-renders
  const handleMobileTreatmentsToggle = useCallback((open: boolean) => {
    setIsMobileTreatmentsOpen(open);
  }, []);

  // Helper function to determine active navigation state
  const isActivePage = useCallback((href: string) => {
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(href + '/');
  }, [pathname]);

  return (
    <>
      {/* Skip Navigation Link for Screen Readers */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded z-50"
      >
        Skip to main content
      </a>

      <header className={cn("w-full border-b bg-secondary/15 backdrop-blur supports-[backdrop-filter]:bg-secondary/15 relative z-40", className)}>
        <nav className="w-full flex h-16 items-center" aria-label="Main navigation">
          <div className="flex items-center w-full px-4 sm:px-6 lg:px-8">

        {/* Left Navigation Menu - Desktop */}
        <div className="hidden lg:flex items-center space-x-6 flex-1">
          <NavigationMenu className="relative z-50 pl-2">
            <NavigationMenuList>
              {NAVIGATION_ITEMS.map(({ href, label }) => (
                <NavigationMenuItem key={href}>
                  <NavigationMenuLink
                    asChild
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "bg-transparent",
                      STYLES.focusRing,
                      isActivePage(href) && "bg-accent text-accent-foreground"
                    )}
                    aria-current={isActivePage(href) ? "page" : undefined}
                  >
                    <Link href={href}>
                      {label}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
              <NavigationMenuItem>
                <NavigationMenuTrigger className={cn("bg-transparent", STYLES.focusRing)}>Treatments</NavigationMenuTrigger>
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
                    {categoriesWithIcons.map((category) => (
                      <li key={category.id}>
                        <NavigationMenuLink asChild>
                          <Link
                            href={`/treatments/${category.slug}`}
                            className={cn(STYLES.desktopCategoryLink, STYLES.focusRing)}
                          >
                            <div className="flex items-center space-x-3">
                              {category.IconComponent && (
                                <category.IconComponent className="h-4 w-4 flex-shrink-0 text-primary" aria-hidden="true" />
                              )}
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
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Centered Logo */}
        <div className="flex-1 flex justify-center">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-base sm:text-base md:text-lg lg:text-base xl:text-xl font-bold font-serif text-primary whitespace-nowrap">Heavenly Treatments with Hayleybell</span>
          </Link>
        </div>

        {/* Book Now Button - Desktop */}
        <div className="hidden lg:flex items-center justify-end flex-1">
          <Button variant="default" size="lg" asChild>
            <Link href="/treatments">
              Book Now
            </Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex lg:hidden ml-auto">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Toggle main menu">
                <Menu className="h-5 w-5" aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] z-50 bg-secondary border-l-0">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col space-y-3 mt-4 pl-4 pr-4">
                {NAVIGATION_ITEMS.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-primary",
                      STYLES.focusRing,
                      isActivePage(href) && "text-primary font-semibold"
                    )}
                    aria-current={isActivePage(href) ? "page" : undefined}
                  >
                    {label}
                  </Link>
                ))}

                <Collapsible
                  open={isMobileTreatmentsOpen}
                  onOpenChange={handleMobileTreatmentsToggle}
                >
                  <div className="flex items-center">
                     <Link
                       href="/treatments"
                       className={cn(
                         "text-sm font-medium transition-colors hover:text-primary",
                         STYLES.focusRing,
                         isActivePage("/treatments") && "text-primary font-semibold"
                       )}
                       aria-current={isActivePage("/treatments") ? "page" : undefined}
                     >
                       Treatments
                     </Link>
                     <CollapsibleTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={cn("w-9 p-0 ml-2", STYLES.focusRing)}
                          aria-label="Toggle treatment categories"
                        >
                          {isMobileTreatmentsOpen ? (
                            <ChevronDown className="h-4 w-4 text-primary" aria-hidden="true" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-primary" aria-hidden="true" />
                          )}
                        </Button>
                      </CollapsibleTrigger>
                  </div>

                  <CollapsibleContent>
                    <div className="flex flex-col space-y-2 pl-4 pt-2">
                      <Link
                        href="/treatments"
                        className={cn(
                          STYLES.mobileCategoryLink,
                          STYLES.focusRing,
                          isActivePage("/treatments") && "text-primary font-semibold"
                        )}
                        aria-current={isActivePage("/treatments") ? "page" : undefined}
                      >
                        All Treatments
                      </Link>
                      <TreatmentCategoryLinks
                        categories={treatmentCategories}
                        showIcon={true}
                        baseLinkClasses={cn(STYLES.mobileCategoryLink, STYLES.focusRing)}
                        textClasses="text-secondary-foreground hover:text-primary"
                        iconClasses="h-4 w-4 flex-shrink-0 text-primary pr-0.5"
                      />
                    </div>
                  </CollapsibleContent>
                </Collapsible>

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
          </div>
        </nav>
    </header>
    </>
  );
}