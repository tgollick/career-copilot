import React from "react";
import { type Job } from "@/db/schema";

type Props = {
  job: Job;
  isAuthed: boolean;
};

const JobTile = (props: Props) => {
  return (
    <div className="bg-neutral-900 p-4 rounded-md flex flex-col mb-4">
      <div className="flex gap-10">
        <div className="w-full">
          <h2 className="text-lg font-bold">{props.job.title}</h2>
          <p className="text-sm mb-4 italic">{props.job.description}</p>
        </div>

        <div className="flex flex-col w-fit p-3 rounded-full items-center bg-emerald-950 text-green-500 gap-0 text-center aspect-square h-full">
          <p className="font-bold mb-[-5px]">99%</p>
          <p className="text-xs font-bold">Match</p>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <p className="bg-neutral-800 px-4 py-2 rounded-sm">
          <span className="font-bold">Salary:</span> £
          {props.job.salaryMin?.toLocaleString("en-GB")} - £
          {props.job.salaryMax?.toLocaleString("en-GB")}
        </p>
        <div>
          <button
            disabled={!props.isAuthed}
            onClick={() => window.open("https://google.com")}
            className={`w-fit bg-blue-500 text-white px-4 py-2 rounded-sm mr-2 ${
              props.isAuthed
                ? "hover:cursor-pointer"
                : "opacity-20 hover:cursor-not-allowed"
            }`}
          >
            Apply Now
          </button>
          {props.isAuthed && (
            <button className="w-fit bg-gray-700 text-white px-4 py-2 hover:cursor-pointer rounded-sm">
              Generate Cover Letter
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobTile;
