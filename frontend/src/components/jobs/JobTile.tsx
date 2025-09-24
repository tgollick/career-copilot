import React from "react";

type Props = {
  job: object;
};

const JobTile = (props: Props) => {
  return (
    <div className="bg-neutral-900 p-4 rounded-md flex flex-col mb-4">
      <h2 className="text-lg font-bold">{props.job.title}</h2>
      <p className="text-sm mb-2 italic">{props.job.description}</p>
      <div className="flex items-end justify-between">
        <p className="text-right">
          Salary: £{props.job.salaryMin} - £{props.job.salaryMax}
        </p>
        <button className="w-fit bg-blue-500 text-white px-4 py-2 hover:cursor-pointer rounded-sm">
          Apply Now
        </button>
      </div>
    </div>
  );
};

export default JobTile;
