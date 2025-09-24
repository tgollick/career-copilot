"use client";
import React from "react";
import JobTile from "./JobTile";

type Props = {
  initialJobs: object[];
};

const JobBoard = (props: Props) => {
  return (
    <div>
      {props.initialJobs.map((job, i) => (
        <JobTile key={i} job={job} />
      ))}
    </div>
  );
};

export default JobBoard;
