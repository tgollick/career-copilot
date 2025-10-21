"use client";
import React, { useEffect, useState, useRef } from "react";
import JobTile from "./JobTile";
import { JobWithSimilarity } from "@/db/schema";
import { type PaginationInfo } from "@/lib/types";
import Pagination from "./Pagination";
import Filters from "./Filters";
import { Briefcase, Loader2 } from "lucide-react";

type Props = {
  isAuthed: boolean;
};

const JobBoard = (props: Props) => {
  const [jobs, setJobs] = useState<JobWithSimilarity[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 15,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [location, setLocation] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [minSalary, setMinSalary] = useState<number>(0);
  const [maxSalary, setMaxSalary] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const isFirstRender = useRef(true);

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

  useEffect(() => {
    fetchJobs(1);
  }, [])

  // Debounced effect - only fires 500ms after user stops typing
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

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

  return (
<div className="w-full">
      <Filters
        handleSearch={handleSearchTermChange}
        handleLocation={handleLocationChange}
        handleMinSalary={handleMinSalaryChange}
        handleMaxSalary={handleMaxSalaryChange}
      />

      {loading && (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
            <Loader2 className="h-12 w-12 text-primary animate-spin relative" />
          </div>
          <p className="text-sm font-medium text-muted-foreground">Finding your perfect matches...</p>
        </div>
      )}

      {!loading && (
        <>
          <div className="flex items-center gap-3 mb-6 px-4 py-3 bg-muted/50 rounded-lg border border-border/50">
            <div className="p-2 bg-primary/10 rounded-md">
              <Briefcase className="h-4 w-4 text-primary" />
            </div>
            <span className="text-sm font-medium">
              Showing{" "}
              <span className="text-foreground font-semibold">
                {(currentPage - 1) * pagination.itemsPerPage + 1}-
                {Math.min(currentPage * pagination.itemsPerPage, pagination.totalItems)}
              </span>{" "}
              of <span className="text-foreground font-semibold">{pagination.totalItems}</span> opportunities
            </span>
          </div>

          {/* Job Tiles */}
          <div className="space-y-4">
            {jobs.length > 0 ? (
              jobs.map((job) => <JobTile key={job.id} job={job} isAuthed={props.isAuthed} />)
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="bg-muted rounded-full p-6 mb-4">
                  <Briefcase className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No jobs found</h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  Try adjusting your filters or search terms to find more opportunities
                </p>
              </div>
            )}
          </div>

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
