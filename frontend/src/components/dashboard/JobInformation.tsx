import { Clock, DollarSign, ExternalLink, MapPin, Sparkles }  from "lucide-react"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import Link from "next/link"
import { BestJobs, NewestJobs } from "@/db/schema"

const daysAgo = (jobDate: Date): number => {
  const today = new Date();

  const diffMs = today.getTime() - jobDate.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  return diffDays
}

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

type Props = {
  bestMatchedJobs: BestJobs[];
  newestJobs: NewestJobs[];
}

const JobInformation = (props: Props) => {
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
          {props.bestMatchedJobs.length == 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No job matches found! Head to <span className="font-bold">PROFILE</span> to generate similarities.
            </div>
          ) : (
            props.bestMatchedJobs.map((sim) => (
                <div
                  key={sim.job.id}
                  className="bg-background border border-border rounded-lg sm:rounded-xl p-4 sm:p-6 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5 group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-2">
                        <h3 className="text-lg sm:text-xl font-semibold group-hover:text-primary transition-colors w-full">
                          {sim.job.title}
                        </h3>
                        <Badge className={`${getMatchStyles(sim.matchQuality)} border font-semibold shrink-0`}>
                          {sim.matchQuality}
                        </Badge>
                      </div>
                      <p className="text-sm sm:text-base text-muted-foreground mb-3">{sim.job.company.name}</p>
                      <div className="flex flex-wrap gap-3 text-xs sm:text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4" />
                          {sim.job.location}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <DollarSign className="w-4 h-4" />
                          {`${sim.job.salaryMin} - ${sim.job.salaryMax}`}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4" />
                          {sim.job.postedAt.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
            ))
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
          {props.newestJobs.length == 0 ? (
            <div className="text-center py-8 text-muted-foreground">No recent jobs available.</div>
          ) : (
            props.newestJobs.map((job) => (
              <div
                key={job.id}
                className="bg-background border border-border rounded-lg p-4 hover:border-accent/50 transition-all hover:shadow-md hover:shadow-accent/5 group"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="text-base sm:text-lg font-semibold group-hover:text-accent transition-colors">
                    {job.title}
                  </h3>
                  <Badge variant="secondary" className="text-xs shrink-0">
                    {`Posted ${
                      daysAgo(job.postedAt!) === 0
                        ? "today"
                        : daysAgo(job.postedAt!) === 1
                        ? "1 day ago"
                        : `${daysAgo(job.postedAt!)} days ago`
                    }`}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{job.company.name}</p>
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    {job.location}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5" />
                    {job.salaryCurrency}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  )
}

export default JobInformation
