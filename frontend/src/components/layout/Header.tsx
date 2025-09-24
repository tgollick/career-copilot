import Link from "next/link";
import React from "react";

// type Props = {}

const Header = () => {
  return (
    <div>
      <p>Career Co-Pilot 🚁</p>

      {/* Nav that shows if authenticated */}
      <nav>
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/jobs">Jobs</Link>
        <Link href="/applications">Applications</Link>
        <Link href="/profile">Profile</Link>
      </nav>
    </div>
  );
};

export default Header;
