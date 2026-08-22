"use client";

import { useState, useEffect } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import Sidebar from "@/components/sidebar";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import PageLoader from "@/components/page-loader";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isMobile = useIsMobile();

  // Load sidebar state from localStorage on mount
  useEffect(() => {
    try {
      const savedState = localStorage.getItem('sidebarCollapsed');
      if (savedState !== null && !isMobile) {
        setIsSidebarCollapsed(JSON.parse(savedState));
      }
      
      // On mobile, always start collapsed
      if (isMobile) {
        setIsSidebarCollapsed(true);
        setMobileMenuOpen(false);
      }
      
      // Always ensure sidebar is visible on mount (except login)
      if (pathname !== "/login") {
        setIsSidebarVisible(true);
      }
    } catch (error) {
      console.error('Error loading sidebar state:', error);
    }
  }, [pathname, isMobile]);

  // Save sidebar state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('sidebarCollapsed', JSON.stringify(isSidebarCollapsed));
    } catch (error) {
      console.error('Error saving sidebar state:', error);
    }
  }, [isSidebarCollapsed]);

  // Simulate loading for better UX
  useEffect(() => {
    // Fast loading for subsequent navigation
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Ensure sidebar is visible after page load (except login)
      if (pathname !== "/login") {
        setIsSidebarVisible(true);
      }
    }, pathname === "/login" ? 100 : 300);
    return () => clearTimeout(timer);
  }, [pathname]);

  // Close mobile menu on route change
  useEffect(() => {
    if (isMobile) {
      setMobileMenuOpen(false);
    }
  }, [pathname, isMobile]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobile && mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen, isMobile]);

  // Handle sidebar toggle
  const toggleSidebar = () => {
    if (isMobile) {
      setMobileMenuOpen(prev => !prev);
    } else {
      setIsSidebarCollapsed(prev => !prev);
    }
  };

  // Handle sidebar auto-expand state
  const handleSidebarExpandChange = (expanded: boolean) => {
    setIsSidebarExpanded(expanded);
  };

  // Force sidebar to render except for login page
  const shouldRenderSidebar = pathname !== "/login";

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="clinical-shell min-h-screen bg-background font-sans antialiased">
        {isLoading ? (
          <PageLoader />
        ) : (
          <div className="flex h-screen overflow-hidden">
            {/* Mobile Menu Button */}
            {shouldRenderSidebar && isMobile && (
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "fixed top-4 left-4 z-50 tap-target",
                  "bg-background/95 backdrop-blur-lg border border-border/50",
                  "shadow-lg hover:shadow-xl transition-all"
                )}
                onClick={toggleSidebar}
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </Button>
            )}

            {/* Mobile Overlay */}
            {isMobile && mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
                onClick={() => setMobileMenuOpen(false)}
              />
            )}

            {/* Sidebar */}
            {shouldRenderSidebar && isSidebarVisible && (
              <div className={cn(
                isMobile && "fixed inset-y-0 left-0 z-50",
                isMobile && !mobileMenuOpen && "-translate-x-full",
                isMobile && "transition-transform duration-300 ease-in-out"
              )}>
                <Sidebar
                  collapsed={isMobile ? false : isSidebarCollapsed}
                  toggleCollapsed={toggleSidebar}
                  className={cn(
                    "h-screen",
                    !isMobile && "fixed left-0 top-0 z-50"
                  )}
                  onExpandChange={handleSidebarExpandChange}
                />
              </div>
            )}
            
            {/* Main content area */}
            <main
              className={cn(
                "flex-1 overflow-y-auto h-screen transition-all duration-300 ease-in-out bg-muted/10",
                // Desktop margins
                !isMobile && shouldRenderSidebar && !isSidebarCollapsed && isSidebarVisible && "ml-[260px]",
                !isMobile && shouldRenderSidebar && isSidebarCollapsed && isSidebarVisible && "ml-[70px]",
                // Mobile - no left margin, add top padding for menu button
                isMobile && shouldRenderSidebar && "pt-16",
                // Responsive padding
                isMobile ? "p-4" : "p-6 md:p-8"
              )}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={pathname}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className={cn(
                    "h-full w-full",
                    !isMobile && "max-w-7xl mx-auto"
                  )}
                >
                  {children}
                </motion.div>
              </AnimatePresence>
            </main>
          </div>
        )}
      </div>
    </ThemeProvider>
  );
}
