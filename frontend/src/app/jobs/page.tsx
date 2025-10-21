import JobBoard from "@/components/jobs/JobBoard";
import { Job, jobs, JobWithSimilarity } from "@/db/schema";
import { db } from "@/lib";
import { auth } from "@clerk/nextjs/server";
import React from "react";
// type Props = {}

const JobsPage = async () => {
  const { isAuthenticated } = await auth();

  return (
    <div className="w-full min-h-screen px-4 sm:px-8 py-24 sm:py-28">
      <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none -z-10" />

      <div className="relative w-full max-w-6xl mx-auto">
        <div className="mb-12 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">AI-Powered Matching</span>
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold mb-4 text-balance bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
            Find Your Perfect Role
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
            Our intelligent algorithm analyzes your profile to surface the most relevant opportunities
          </p>
        </div>

        <JobBoard isAuthed={isAuthenticated} />
      </div>
    </div>
  );
};

export default JobsPage;
