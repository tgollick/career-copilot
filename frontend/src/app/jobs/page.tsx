import JobBoard from "@/components/jobs/JobBoard";
import { Job, jobs, JobWithSimilarity } from "@/db/schema";
import { db } from "@/lib";
import { auth } from "@clerk/nextjs/server";
import React from "react";
// type Props = {}

const JobsPage = async () => {
  const { isAuthenticated } = await auth();

  return (
    <div className="w-full flex items-center justify-center px-8">
      <div className="w-full h-fit max-w-3xl flex flex-col items-center justify-center mt-32">
        <p className="text-8xl mb-4">🏢</p>

        <h1 className="text-6xl font-bold mb-6">Jobs Page</h1>

        <p className="text-lg italic mb-6">
          Welcome to the Career Co-Pilot Jobs Page!
        </p>

        <JobBoard isAuthed={isAuthenticated} />
      </div>
    </div>
  );
};

export default JobsPage;
