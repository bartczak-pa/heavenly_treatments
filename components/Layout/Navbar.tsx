
'use client';

import React, { useState, useMemo, memo } from 'react';
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
import { categoryIconMap, type TreatmentCategory } from '@/lib/data/treatments';
import TreatmentCategoryLinks from '@/components/Layout/TreatmentCategoryLinks';
import { cn } from '@/lib/utils';

// --- Style Constants ---
const styles = {
  desktop: {
    categoryLink: "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
  },
  mobile: {
    categoryLink: "text-sm text-foreground hover:text-primary",
  },
} as const;

// --- Navigation Data ---
const navigationItems = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Me' },
  { href: '/contact', label: 'Contact' },
] as const;

// --- Types ---
interface ProcessedTreatmentCategory extends TreatmentCategory {
  IconComponent: React.ComponentType<{ className?: string }> | null;
}


interface MobileNavigationMenuProps {
  isTreatmentsOpen: boolean;
  setIsTreatmentsOpen: (open: boolean) => void;
  categories: TreatmentCategory[];
}

interface TreatmentDropdownContentProps {
  processedCategories: ProcessedTreatmentCategory[];
}

// --- Sub-Components ---
const TreatmentDropdownContent = memo<TreatmentDropdownContentProps>(({ processedCategories }) => (
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
    {processedCategories.map((category) => (
      <li key={category.id}>
        <NavigationMenuLink asChild>
          <Link
            href={`/treatments/${category.slug}`}
            className={styles.desktop.categoryLink}
          >
            <div className="flex items-center space-x-3">
              {category.IconComponent && (
                <category.IconComponent className="h-4 w-4 flex-shrink-0 text-primary" />
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
));

TreatmentDropdownContent.displayName = 'TreatmentDropdownContent';

const DesktopNavigationLinks = memo(() => (
  <>
    {navigationItems.map((item) => (
      <NavigationMenuItem key={item.href}>
        <NavigationMenuLink asChild className={cn(navigationMenuTriggerStyle(), "bg-transparent transition-all duration-200 ease-out hover:text-primary hover:bg-primary/10 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all after:duration-300 hover:after:w-full")}>
          <Link href={item.href}>
            {item.label}
          </Link>
        </NavigationMenuLink>
      </NavigationMenuItem>
    ))}
  </>
));

DesktopNavigationLinks.displayName = 'DesktopNavigationLinks';

const MobileNavigationLinks = memo(() => (
  <>
    {navigationItems.map((item) => (
      <Link
        key={item.href}
        href={item.href}
        className="text-sm font-medium transition-colors hover:text-primary"
      >
        {item.label}
      </Link>
    ))}
  </>
));

MobileNavigationLinks.displayName = 'MobileNavigationLinks';

const MobileNavigationMenu = memo<MobileNavigationMenuProps>(({
  isTreatmentsOpen,
  setIsTreatmentsOpen,
  categories
}) => (
  <div className="flex flex-col space-y-3 mt-4 pl-4 pr-4">
    <MobileNavigationLinks />

    <Collapsible
      open={isTreatmentsOpen}
      onOpenChange={setIsTreatmentsOpen}
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
            aria-label="Toggle treatment categories"
          >
            {isTreatmentsOpen ? (
              <ChevronDown className="h-4 w-4" aria-hidden="true" />
            ) : (
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            )}
          </Button>
        </CollapsibleTrigger>
      </div>

      <CollapsibleContent>
        <div className="flex flex-col space-y-2 pl-4 pt-2">
          <Link href="/treatments" className={styles.mobile.categoryLink}>
            All Treatments
          </Link>
          <TreatmentCategoryLinks
            categories={categories}
            showIcon={true}
            baseLinkClasses={styles.mobile.categoryLink}
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
));

MobileNavigationMenu.displayName = 'MobileNavigationMenu';

interface NavbarProps {
  categories: TreatmentCategory[];
}

export default function Navbar({ categories }: NavbarProps) {
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
   * - Optimized performance with memoization
   *
   * @component
   * @example
   * ```tsx
   * <Navbar categories={categories} />
   * ```
   *
   * @returns {JSX.Element} A responsive navigation bar
   */
  const [isMobileTreatmentsOpen, setIsMobileTreatmentsOpen] = useState(false);

  // Memoize processed treatment categories to prevent unnecessary re-renders
  const processedCategories = useMemo<ProcessedTreatmentCategory[]>(() =>
    categories.map((category) => ({
      ...category,
      IconComponent: category.iconName ? categoryIconMap[category.iconName] : null,
    })), [categories]);

  return (
    <header className="w-full border-b bg-secondary/15 backdrop-blur supports-[backdrop-filter]:bg-secondary/15 z-40">
      {/* Desktop Layout - Flexbox with proper spacing */}
      <div className="hidden lg:flex items-center justify-between h-16 w-full px-4 sm:px-6 lg:px-8">
        {/* Left Navigation - Fixed width container */}
        <div className="flex items-center w-80">
          <nav aria-label="Primary">
            <NavigationMenu className="relative z-50">
              <NavigationMenuList className="flex items-center space-x-2">
                <DesktopNavigationLinks />
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent">Treatments</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <TreatmentDropdownContent processedCategories={processedCategories} />
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </nav>
        </div>

        {/* Centered Logo - Flex grow with center alignment */}
        <div className="flex-1 flex items-center justify-center px-8">
          <Link href="/" className="flex items-center space-x-2 transition-all duration-300 ease-out hover:scale-105 hover:drop-shadow-md">
            <span className="text-xl font-bold font-serif text-primary truncate">Heavenly Treatments with Hayleybell</span>
          </Link>
        </div>

        {/* Right Navigation - Fixed width container */}
        <div className="flex items-center justify-end w-32">
          <Button variant="default" size="lg" asChild>
            <Link href="/treatments">
              Book Now
            </Link>
          </Button>
        </div>
      </div>

      {/* Mobile/Tablet Layout - True Full Width */}
      <div className="flex lg:hidden items-center justify-between h-16 w-full px-4 sm:px-6">
        {/* Centered Logo */}
        <div className="flex-1 flex justify-center">
          <Link href="/" className="flex items-center space-x-2 transition-all duration-300 ease-out hover:scale-105 hover:drop-shadow-md">
            <span className="text-lg sm:text-2xl font-bold font-serif text-primary">Heavenly Treatments with Hayleybell</span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Toggle main menu">
                <Menu className="h-5 w-5" aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] z-50 bg-secondary ">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <MobileNavigationMenu
                isTreatmentsOpen={isMobileTreatmentsOpen}
                setIsTreatmentsOpen={setIsMobileTreatmentsOpen}
                categories={categories}
              />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}