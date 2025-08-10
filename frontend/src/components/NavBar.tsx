"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Correct hook for client-side navigation
// import { getSession, signOut } from "next-auth/react";

// Import Button from your shadcn/ui components
import { Button } from "@/components/ui/button";

// Icons
import {
  PenTool,
  Sparkles,
  Menu as MenuIcon,
  X as XIcon,
  UserCircle,
  LayoutDashboard,
  Compass,
  LogIn, // Icon for login button
  LogOut, // Icon for sign-out
} from "lucide-react";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(true);
  const [isLoading, setIsLoading] = useState(false); // State to handle initial auth check
  const router = useRouter();

  useEffect(() => {
    // Check session on component mount
    // (async () => {
    //   const session = await getSession();
    //   if (session?.user) {
    //     console.log("User is authorized:", session.user);
    //     setIsAuthorized(true);
    //   } else {
    //     setIsAuthorized(false);
    //   }
    //   setIsLoading(false); // Stop loading once check is complete
    // })();
    setIsAuthorized(true)
    setIsLoading(false)
  }, []);
  // Links for authorized users
  const navLinks = [
    { href: "/explore", label: "Explore", icon: <Compass className="w-5 h-5 mr-2" /> },
    { href: "/upload", label: "Upload", icon: <LayoutDashboard className="w-5 h-5 mr-2" /> },
  ];

  const handleSignOut = async () => {
    // await signOut({ callbackUrl: '/' }); // Sign out and redirect to homepage
  };

  return (
    <nav className="bg-white/70 backdrop-blur-md shadow-sm sticky top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 group" aria-label="Homepage">
              <div className="relative">
                <PenTool className="w-7 h-7 text-blue-600 group-hover:text-blue-700 transition-colors" />
                <Sparkles className="w-3 h-3 text-purple-500 absolute -top-1 -right-1 animate-pulse group-hover:text-purple-600 transition-colors" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:opacity-80 transition-opacity">
                BlogAI
              </h1>
            </Link>
          </div>

          {/* Desktop Nav links & User Profile */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoading ? (
              <div className="h-8 w-24 animate-pulse bg-gray-200 rounded-md"></div>
            ) : isAuthorized ? (
              <>
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center"
                  >
                    {link.icon}
                    {link.label}
                  </Link>
                ))}
                <button
                  onClick={() => router.push('/profile/anand-maharana')}
                  className="p-1 rounded-full text-gray-600 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  aria-label="User Profile"
                >
                  <UserCircle className="h-7 w-7" />
                </button>
              </>
            ) : (
              <Button asChild className="bg-blue-600 hover:bg-blue-700 shadow-md transition-all hover:shadow-lg">
                <Link href="/sign-in">
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </Link>
              </Button>
            )}
          </div>

          {/* === Mobile View: Menu Button OR Sign In Button === */}
          <div className="md:hidden flex items-center">
            {isLoading ? (
              // --- Mobile Skeleton Loader ---
              <div className="h-8 w-8 animate-pulse bg-gray-200 rounded-md"></div>
            ) : isAuthorized ? (
              // --- Authorized: Show Menu Button ---
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-all"
                aria-controls="mobile-menu"
                aria-expanded={isMobileMenuOpen}
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                  <XIcon className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            ) : (
              // --- Unauthorized: Show Sign In Button Directly ---
              <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700 shadow-sm">
                <Link href="/signin">
                  Sign In
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel - Only renders if user is authorized AND menu is open */}
      {isAuthorized && isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 inset-x-0 bg-white/95 backdrop-blur-md shadow-xl z-40 border-t border-gray-200" id="mobile-menu">
          <>
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex px-3 py-2 rounded-md text-base font-medium transition-colors items-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.icon} {link.label}
                </Link>
              ))}
            </div>
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center justify-between px-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0"><UserCircle className="h-10 w-10 text-gray-600" /></div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">Your Name</div>
                    <div className="text-sm font-medium text-gray-500">your.email@example.com</div>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={handleSignOut} aria-label="Sign Out">
                  <LogOut className="h-6 w-6 text-gray-600" />
                </Button>
              </div>
            </div>
          </>
        </div>
      )}
    </nav>
  );
}