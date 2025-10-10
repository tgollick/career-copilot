"use client";

import React, { useState } from "react";
import { JobWithSimilarity, type Job } from "@/db/schema";
import { SpinnerCircularSplit } from "spinners-react";
import { CoverLetterDocument } from "./CoverLetterDocument";
import { pdf } from "@react-pdf/renderer";

type Props = {
  job: JobWithSimilarity;
  isAuthed: boolean;
};

const JobTile = (props: Props) => {
  const [loading, setLoading] = useState<boolean>(false);

  const getMatchStyles = (matchQuality: string | null) => {
    switch (matchQuality) {
      case "Excellent Match":
        return "bg-gradient-to-br from-green-400 to-emerald-500 text-white border-green-300 shadow-lg";
      case "Strong Match":
        return "bg-gradient-to-br from-blue-400 to-indigo-500 text-white border-blue-300 shadow-lg";
      case "Good Match":
        return "bg-gradient-to-br from-violet-400 to-purple-500 text-white border-violet-300 shadow-lg";
      case "Moderate Match":
        return "bg-gradient-to-br from-yellow-400 to-amber-500 text-white border-yellow-300 shadow-lg";
      case "Weak Match":
        return "bg-gradient-to-br from-orange-400 to-red-400 text-white border-orange-300 shadow-lg";
      case "No Match":
        return "bg-gradient-to-br from-red-400 to-rose-500 text-white border-red-300 shadow-lg";
      default:
        return "bg-gradient-to-br from-gray-400 to-slate-500 text-white border-gray-300 shadow-lg";
    }
  };

  const getCoverLetter = async (job: JobWithSimilarity) => {
    try {
      setLoading(true);

      const res = await fetch("/api/generate-cover-letter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ job }),
      });

      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }

      const data = await res.json();
      console.log("Generated cover letter:", data.coverLetter);

      return data;
    } catch (e) {
      console.error("Error generating cover letter:", e);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const openCoverLetterPDF = async (
    coverLetter: string,
    jobTitle: string,
    companyName: string,
    candidateName: string,
    candidateContact: string
  ) => {
    const doc = (
      <CoverLetterDocument
        coverLetter={coverLetter}
        jobTitle={jobTitle}
        companyName={companyName}
        candidateContact={candidateContact}
        candidateName={candidateName}
      />
    );
    const asPdf = pdf(doc);

    const blob = await asPdf.toBlob();
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  const similarity = props.job.similarity 
    ? Math.round(parseFloat(props.job.similarity) * 100) 
    : 0;
  const matchQuality = props.job.matchQuality ?? "Unknown";

  return (
    <div className="bg-neutral-900 p-4 rounded-md flex flex-col mb-4">
      <div className="flex gap-10">
        <div className="w-full">
          <h2 className="text-lg font-bold">{props.job.title}</h2>
          <p className="text-sm mb-4 italic">{props.job.description}</p>
        </div>

        <div 
          className={`flex flex-col justify-center items-center w-[110px] rounded-full border-2 p-4 text-center aspect-square h-fit ${getMatchStyles(matchQuality)}`}
        >
          <p className="text-2xl font-bold leading-none">{similarity}%</p>
          <p className="text-xs mt-1">{matchQuality}</p>
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
            <button
              disabled={loading}
              onClick={async (e) => {
                e.preventDefault();
                setLoading(true);
                const data = await getCoverLetter(props.job);
                if (data) {
                  openCoverLetterPDF(
                    data.coverLetter,
                    props.job.title,
                    data.companyName,
                    data.candidateName,
                    data.candidateContact
                  );
                }
                setLoading(false);
              }}
              className={`w-fit bg-gray-700 text-white px-4 py-2 rounded-sm ${
                loading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:cursor-pointer"
              }`}
            >
              {loading ? (
                <div className="flex flex-row items-center gap-2">
                  Generating{" "}
                  <SpinnerCircularSplit
                    size={20}
                    thickness={180}
                    speed={78}
                    color="#36ad47"
                    secondaryColor="rgba(0, 0, 0, 0.44)"
                  />
                </div>
              ) : (
                "Generate Cover Letter"
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobTile;
