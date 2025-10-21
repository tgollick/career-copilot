import Link from "next/link";
import React from "react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { Button } from "@/components/ui/button"

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        {/* Logo/Brand */}
        <Link href="/" className="group flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/20 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-primary/30">
            <svg className="h-5 w-5 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Career Co-Pilot
          </span>
        </Link>

        {/* Navigation - Signed In */}
        <SignedIn>
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-1">
              <Link
                prefetch={false}
                href="/dashboard"
                className="px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-accent/50 rounded-lg"
              >
                Dashboard
              </Link>
              <Link
                prefetch={false}
                href="/jobs"
                className="px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-accent/50 rounded-lg"
              >
                Jobs
              </Link>
              <Link
                prefetch={false}
                href="/profile"
                className="px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-accent/50 rounded-lg"
              >
                Profile
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "h-9 w-9 ring-2 ring-border hover:ring-primary transition-all",
                  },
                }}
              />
            </div>
          </div>
        </SignedIn>

        {/* Auth Buttons - Signed Out */}
        <SignedOut>
          <div className="flex items-center gap-3">
            <SignInButton>
              <Button variant="ghost" className="text-sm font-medium hover:bg-accent/50">
                Sign In
              </Button>
            </SignInButton>
            <SignUpButton>
              <Button className="text-sm font-medium bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity shadow-lg shadow-primary/20">
                Sign Up
              </Button>
            </SignUpButton>
          </div>
        </SignedOut>
      </div>
    </header>
  );
};

export default Header;
