"use client";
import React, { useEffect, useState } from "react";
import JobTile from "./JobTile";
import { type Job } from "@/db/schema";
import { type PaginationInfo } from "@/lib/types";
import Pagination from "./Pagination";
import { SpinnerCircularSplit } from "spinners-react";

type Props = {
  initialJobs: Job[];
  isAuthed: boolean;
};

const JobBoard = (props: Props) => {
  const [jobs, setJobs] = useState<Job[]>(props.initialJobs);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalItems: props.initialJobs.length,
    itemsPerPage: 15,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [loading, setLoading] = useState(false);

  const fetchJobs = async (page: number) => {
    try {
      setLoading(true);

      const response = await fetch(`/api/jobs?page=${page}&limit=15`);
      const data = await response.json();

      setJobs(data.jobs);
      setPagination(data.pagination);
      setCurrentPage(page);

      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {
      console.error("Error fetching jobs: ", e);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    fetchJobs(page);
  };

  useEffect(() => {
    fetchJobs(1);
  }, []);

  return (
    <div className="w-full">
      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <SpinnerCircularSplit
            size={50}
            thickness={180}
            speed={78}
            color="#36ad47"
            secondaryColor="rgba(0, 0, 0, 0.44)"
          />
        </div>
      )}

      {/* Jobs List */}
      {!loading && (
        <>
          {/* Results Summary */}
          <div className="mb-4 text-sm text-neutral-400">
            Showing {(currentPage - 1) * pagination.itemsPerPage + 1}-
            {Math.min(
              currentPage * pagination.itemsPerPage,
              pagination.totalItems
            )}{" "}
            of {pagination.totalItems} jobs
          </div>

          {/* Job Tiles */}
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <JobTile key={job.id} job={job} isAuthed={props.isAuthed} />
            ))
          ) : (
            <div className="text-center py-20 text-neutral-500">
              No jobs found
            </div>
          )}

          {/* Pagination Controls */}
          <Pagination
            currentPage={currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
            isLoading={loading}
          />
        </>
      )}
    </div>
  );
};

export default JobBoard;
