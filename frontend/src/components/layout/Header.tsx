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
    <div className="flex items-center justify-between py-4 px-8 fixed w-full h-fit z-50">
      {/* Header Title */}
      <Link href="/">
        <p className="text-2xl fontbold">Career Co-Pilot 🚁</p>
      </Link>

      {/* Nav that shows if authenticated */}
      <nav className="flex items-center gap-4">
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/jobs">Jobs</Link>
        <Link href="/applications">Applications</Link>
        <Link href="/profile">Profile</Link>
      </nav>

      {/* Login or Sign up button from Clerk*/}
      <div>
        <SignedOut>
          <SignInButton>
            <button className="hover:cursor-pointer">Sign In</button>
          </SignInButton>
          <SignUpButton>
            <button className="bg-[#6c47ff] text-ceramic-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-2 sm:px-5 cursor-pointer ml-4">
              Sign Up
            </button>
          </SignUpButton>
        </SignedOut>

        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </div>
  );
};

export default Header;
