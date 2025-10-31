import { CheckCircle2, MapPin, Sparkles, TrendingUp } from 'lucide-react'
import React from 'react'
import DeleteCVButton from './DeleteCVButton';
import { MatchJobsButton } from '../MatchJobsButton';
import { Badge } from "../ui/badge"

type Props = {
  hasMatches: boolean;
  hasAnalysis: boolean;
  existingSimilarities: any[];
}

const JobMatches = (props: Props) => {
  return (
    <div className="group relative bg-card border border-border rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-accent/10">
            <TrendingUp className="w-6 h-6 text-accent" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold">Job Matching</h2>
        </div>

        {props.hasMatches ? (
          <div className="space-y-6">
            <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
              <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
              <div>
                <p className="font-semibold text-green-500">Jobs Successfully Matched</p>
                <p className="text-sm text-muted-foreground">
                  Your top {props.existingSimilarities.length} job matches are ready
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-accent" />
                Top Matches
              </h3>
              <div className="space-y-3">
                {props.existingSimilarities.map((sim, index) => (
                  <div
                    key={sim.id}
                    className="group/item flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-muted/50 border border-border rounded-xl hover:bg-muted/80 hover:border-primary/50 transition-all duration-200"
                  >
                    <div className="flex items-start gap-3 flex-1">
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary font-bold text-sm flex-shrink-0">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-foreground group-hover/item:text-primary transition-colors line-clamp-1">
                          {sim.job.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                          <MapPin className="w-3.5 h-3.5" />
                          <span className="line-clamp-1">{sim.job.company.name}</span>
                        </div>
                      </div>
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-gradient-to-r from-primary to-accent text-white border-0 font-semibold px-4 py-1.5 whitespace-nowrap"
                    >
                      {sim.matchQuality}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-muted/30 border border-border rounded-xl">
              <p className="text-sm text-muted-foreground">
                <strong>Note:</strong> To recalculate your matches, delete your current CV and upload a new one.
              </p>
            </div>

            <DeleteCVButton />
          </div>
        ) : (
          <div className="space-y-6 w-full">
            <p className="text-muted-foreground">
              {props.hasAnalysis
                ? "Click the button below to match your CV against our database of available jobs. Our AI-powered algorithm will find the best opportunities for you."
                : "Please upload and analyze your CV first to unlock personalized job matching."}
            </p>

            <MatchJobsButton />

            {!props.hasAnalysis && (
              <div className="p-4 bg-muted/30 border border-border rounded-xl">
                <p className="text-sm text-muted-foreground">
                  <strong>Getting Started:</strong> Upload your CV to begin receiving personalized job
                  recommendations based on your skills and experience.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default JobMatches
