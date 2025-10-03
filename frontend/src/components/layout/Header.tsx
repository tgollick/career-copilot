import Link from "next/link";
import React from "react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

// type Props = {}

const Header = () => {
  return (
    <header className="flex items-center justify-between py-4 px-8 fixed w-full h-fit z-50">
      {/* Header Title */}
      <Link href="/">
        <p className="text-2xl fontbold">Career Co-Pilot 🚁</p>
      </Link>

      {/* Nav and User Avatar/button that shows if authenticated */}
      <SignedIn>
        <div className="flex items-center gap-4">
          <nav className="flex items-center gap-4">
            <Link prefetch={false} href="/dashboard">
              Dashboard
            </Link>
            <Link prefetch={false} href="/jobs">
              Jobs
            </Link>
            <Link prefetch={false} href="/applications">
              Applications
            </Link>
            <Link prefetch={false} href="/profile">
              Profile
            </Link>
          </nav>

          <UserButton />
        </div>
      </SignedIn>

      {/* Login or Sign up button from Clerk if user is not authenticated*/}
      <SignedOut>
        <div>
          <SignInButton>
            <button className="hover:cursor-pointer">Sign In</button>
          </SignInButton>
          <SignUpButton>
            <button className="bg-purple-500 text-ceramic-white rounded-full font-medium text-sm sm:text-base h-8 sm:h-10 px-2 sm:px-4 cursor-pointer ml-4">
              Sign Up
            </button>
          </SignUpButton>
        </div>
      </SignedOut>
    </header>
  );
};

export default Header;
