"use client";

import React, { useState } from "react";
import { JobWithSimilarity } from "@/db/schema";
import { CoverLetterDocument } from "./CoverLetterDocument";
import { pdf } from "@react-pdf/renderer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge"
import { Banknote, ExternalLink, FileText, Loader2, MapPin, Sparkles } from "lucide-react";

type Props = {
  job: JobWithSimilarity;
  isAuthed: boolean;
};

const JobTile = (props: Props) => {
  const [loading, setLoading] = useState<boolean>(false);

  const getMatchStyles = (matchQuality: string | null) => {
    switch (matchQuality) {
      case "Excellent Match":
        return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30 shadow-emerald-500/10"
      case "Strong Match":
        return "bg-blue-500/15 text-blue-400 border-blue-500/30 shadow-blue-500/10"
      case "Good Match":
        return "bg-violet-500/15 text-violet-400 border-violet-500/30 shadow-violet-500/10"
      case "Moderate Match":
        return "bg-amber-500/15 text-amber-400 border-amber-500/30 shadow-amber-500/10"
      case "Weak Match":
        return "bg-orange-500/15 text-orange-400 border-orange-500/30 shadow-orange-500/10"
      case "No Match":
        return "bg-red-500/15 text-red-400 border-red-500/30 shadow-red-500/10"
      default:
        return "bg-muted text-muted-foreground border-border"
    }
  }

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
      <div className="group bg-card border border-border/50 rounded-xl p-6 shadow-lg hover:shadow-xl hover:border-primary/30 transition-all duration-300 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

      <div className="relative space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <h2 className="text-2xl font-bold text-foreground leading-tight group-hover:text-primary transition-colors">
              {props.job.title}
            </h2>
            <p className="text-base font-medium text-muted-foreground">Job Name 1</p>
          </div>

          <Badge
            variant="outline"
            className={`${getMatchStyles(matchQuality)} shrink-0 px-4 py-2 font-bold text-base shadow-lg flex items-center gap-2`}
          >
            <Sparkles className="h-4 w-4" />
            {similarity}%
          </Badge>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{props.job.description}</p>

        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-2 bg-secondary/80 px-4 py-2 rounded-lg border border-border/50">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">{props.job.location}</span>
          </div>

          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-lg border border-primary/20">
            <Banknote className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">
              £{props.job.salaryMin?.toLocaleString("en-GB")} - £{props.job.salaryMax?.toLocaleString("en-GB")}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-4">
          <Button
            disabled={!props.isAuthed}
            onClick={() => window.open("https://google.com")}
            className="gap-2 font-semibold shadow-lg hover:shadow-xl transition-shadow"
            size="lg"
          >
            Apply Now
            <ExternalLink className="h-4 w-4" />
          </Button>

          {props.isAuthed && (
            <Button
              disabled={loading}
              onClick={async (e) => {
                e.preventDefault()
                setLoading(true)
                const data = await getCoverLetter(props.job)
                if (data) {
                  openCoverLetterPDF(
                    data.coverLetter,
                    props.job.title,
                    data.companyName,
                    data.candidateName,
                    data.candidateContact,
                  )
                }
                setLoading(false)
              }}
              variant="secondary"
              className="gap-2 font-semibold shadow-md hover:shadow-lg transition-shadow"
              size="lg"
            >
              {loading ? (
                <>
                  Generating
                  <Loader2 className="h-4 w-4 animate-spin" />
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4" />
                  Generate Cover Letter
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobTile;
