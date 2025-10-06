"use client";
import React, { useEffect, useState } from "react";
import JobTile from "./JobTile";
import { type Job } from "@/db/schema";
import { type PaginationInfo } from "@/lib/types";
import Pagination from "./Pagination";
import { SpinnerCircularSplit } from "spinners-react";
import Filters from "./Filters";

type Props = {
  initialJobs: Job[];
  isAuthed: boolean;
};

// TO DO 
// - Fix pagination page count when filters are added
// - Fix no. result displayed at top (again pagniation component related me thinks)
// - Get claude to give it all a once over

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
  const [location, setLocation] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [minSalary, setMinSalary] = useState<number>(0);
  const [maxSalary, setMaxSalary] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const fetchJobs = async (
    page: number,
    filters?: {
      location?: string;
      searchTerm?: string;
      minSalary?: number;
      maxSalary?: number;
    }
  ) => {
    try {
      setLoading(true);
      
      // Build query string
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "15",
      });
      
      if (filters?.location) params.append("location", filters.location);
      if (filters?.searchTerm) params.append("searchTerm", filters.searchTerm);
      if (filters?.minSalary) params.append("minSalary", filters.minSalary.toString());
      if (filters?.maxSalary) params.append("maxSalary", filters.maxSalary.toString());
      
      const response = await fetch(`/api/jobs?${params.toString()}`);
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

  // Debounced effect - only fires 500ms after user stops typing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchJobs(1, { location, searchTerm, minSalary, maxSalary });
    }, 1000); // 500ms delay (adjust as needed)

    // Cleanup function - cancels the previous timeout
    return () => clearTimeout(timeoutId);
  }, [location, searchTerm, minSalary, maxSalary]);

  // Handlers now just update state (no API calls)
  const handleLocationChange = (newLocation: string) => {
    setLocation(newLocation);
  };

  const handleSearchTermChange = (newSearchTerm: string) => {
    setSearchTerm(newSearchTerm);
  };

  const handleMinSalaryChange = (newMinSalary: number) => {
    setMinSalary(newMinSalary);
  };

  const handleMaxSalaryChange = (newMaxSalary: number) => {
    setMaxSalary(newMaxSalary);
  };

  const handlePageChange = (page: number) => {
    fetchJobs(page, { location, searchTerm, minSalary, maxSalary });
  };

  useEffect(() => {
    fetchJobs(1);
  }, []);

  return (
    <div className="w-full">
      <Filters handleSearch={handleSearchTermChange} handleLocation={handleLocationChange} handleMinSalary={handleMinSalaryChange} handleMaxSalary={handleMaxSalaryChange}/>

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
