"use client"

import { Clock, DollarSign, ExternalLink, FileText, MapPin, Sparkles, AlertCircle, RefreshCw } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import Link from "next/link"

type Job = {
  id: number
  title: string
  company: string
  location: string
  salary: string
  postedDate: string
}

type MatchedJob = {
  id: number
  title: string
  company: string
  location: string
  salary: string
  matchQuality: number
  matchLabel: string
  postedDate: string
}

const getMatchQualityColor = (quality: number) => {
  if (quality >= 85) return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
  if (quality >= 70) return "bg-blue-500/10 text-blue-400 border-blue-500/30"
  if (quality >= 55) return "bg-amber-500/10 text-amber-400 border-amber-500/30"
  return "bg-slate-500/10 text-slate-400 border-slate-500/30"
}

type Props = {}

const JobInformation = (props: Props) => {
  const [newestJobs, setNewestJobs] = useState<Job[] | null>(null)
  const [bestMatchedJobs, setBestMatchedJobs] = useState<MatchedJob[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  const getJobs = async () => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/dashboard/jobs")
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Failed to load jobs")
      } else {
        setNewestJobs(data.newestJobs)
        setBestMatchedJobs(data.bestJobs)
      }
    } catch (err) {
      setError("Network error. Please check your connection.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getJobs()
  }, [])

  const JobCardSkeleton = () => (
    <div className="bg-background border border-border rounded-lg sm:rounded-xl p-4 sm:p-6 animate-pulse">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1 space-y-3">
          <div className="h-6 bg-muted rounded w-3/4" />
          <div className="h-4 bg-muted rounded w-1/2" />
          <div className="flex gap-3">
            <div className="h-4 bg-muted rounded w-24" />
            <div className="h-4 bg-muted rounded w-24" />
            <div className="h-4 bg-muted rounded w-24" />
          </div>
        </div>
        <div className="h-6 w-16 bg-muted rounded-full" />
      </div>
      <div className="flex gap-2">
        <div className="h-9 bg-muted rounded flex-1" />
        <div className="h-9 bg-muted rounded flex-1" />
      </div>
    </div>
  )

  const RecentJobSkeleton = () => (
    <div className="bg-background border border-border rounded-lg p-4 animate-pulse">
      <div className="space-y-2 mb-2">
        <div className="h-5 bg-muted rounded w-3/4" />
        <div className="h-4 bg-muted rounded w-1/2" />
      </div>
      <div className="flex gap-3">
        <div className="h-3 bg-muted rounded w-20" />
        <div className="h-3 bg-muted rounded w-20" />
      </div>
    </div>
  )

  const ErrorState = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
    <div className="bg-background border border-destructive/50 rounded-lg p-6">
      <div className="flex flex-col items-center justify-center gap-4 text-center">
        <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
          <AlertCircle className="w-6 h-6 text-destructive" />
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-1">Failed to Load Jobs</h3>
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>
        <Button onClick={onRetry} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Retry
        </Button>
      </div>
    </div>
  )

  return (
    <>
      <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">Your Top Matches</h2>
              <p className="text-sm text-muted-foreground">Best opportunities based on your profile</p>
            </div>
          </div>
          <Button asChild variant="outline" size="sm" className="hidden sm:flex bg-transparent">
            <Link href="/jobs">
              View All
              <ExternalLink className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>

        <div className="space-y-4">
          {loading ? (
            <>
              {[...Array(3)].map((_, i) => (
                <JobCardSkeleton key={i} />
              ))}
            </>
          ) : error ? (
            <ErrorState message={error} onRetry={getJobs} />
          ) : bestMatchedJobs && bestMatchedJobs.length > 0 ? (
            bestMatchedJobs.map((job) => (
              <div
                key={job.id}
                className="bg-background border border-border rounded-lg sm:rounded-xl p-4 sm:p-6 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5 group"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-2">
                      <h3 className="text-lg sm:text-xl font-semibold group-hover:text-primary transition-colors">
                        {job.title}
                      </h3>
                      <Badge className={`${getMatchQualityColor(job.matchQuality)} border font-semibold shrink-0`}>
                        {job.matchQuality}%
                      </Badge>
                    </div>
                    <p className="text-sm sm:text-base text-muted-foreground mb-3">{job.company}</p>
                    <div className="flex flex-wrap gap-3 text-xs sm:text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <DollarSign className="w-4 h-4" />
                        {job.salary}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        {job.postedDate}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button size="sm" className="w-full sm:w-auto group/btn">
                    Apply Now
                    <ExternalLink className="w-4 h-4 ml-2 group-hover/btn:translate-x-0.5 transition-transform" />
                  </Button>
                  <Button size="sm" variant="outline" className="w-full sm:w-auto bg-transparent">
                    <FileText className="w-4 h-4 mr-2" />
                    Generate Cover Letter
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No matched jobs found. Upload your CV to get started!
            </div>
          )}
        </div>

        <Button asChild variant="outline" className="w-full mt-4 sm:hidden bg-transparent">
          <Link href="/jobs">
            View All Jobs
            <ExternalLink className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </div>

      <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
            <Clock className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold">Recent Opportunities</h2>
            <p className="text-sm text-muted-foreground">Latest jobs posted to the platform</p>
          </div>
        </div>

        <div className="space-y-3">
          {loading ? (
            <>
              {[...Array(5)].map((_, i) => (
                <RecentJobSkeleton key={i} />
              ))}
            </>
          ) : error ? (
            <ErrorState message={error} onRetry={getJobs} />
          ) : newestJobs && newestJobs.length > 0 ? (
            newestJobs.map((job) => (
              <div
                key={job.id}
                className="bg-background border border-border rounded-lg p-4 hover:border-accent/50 transition-all hover:shadow-md hover:shadow-accent/5 group"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="text-base sm:text-lg font-semibold group-hover:text-accent transition-colors">
                    {job.title}
                  </h3>
                  <Badge variant="secondary" className="text-xs shrink-0">
                    {job.postedDate}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{job.company}</p>
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    {job.location}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5" />
                    {job.salary}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">No recent jobs available.</div>
          )}
        </div>
      </div>
    </>
  )
}

export default JobInformation
