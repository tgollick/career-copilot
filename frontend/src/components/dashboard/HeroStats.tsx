import { Briefcase, FileCheck, Target, TrendingUp } from "lucide-react"

type Statistic = {
  totalMatches: number
  averageMatchQuality: number
  cvStatus: string
  activeJobs: number
}

type Props = {
  statistics: Statistic
}

const HeroStats = async (props: Props) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
      <div className="bg-card border border-border rounded-xl p-4 sm:p-6 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground">Total Matches</p>
        </div>
        <p className="text-3xl sm:text-4xl font-bold">{props.statistics?.totalMatches}</p>
      </div>

      <div className="bg-card border border-border rounded-xl p-4 sm:p-6 hover:border-accent/50 transition-all hover:shadow-lg hover:shadow-accent/5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-accent" />
          </div>
          <p className="text-sm text-muted-foreground">Avg. Match</p>
        </div>
        <p className="text-3xl sm:text-4xl font-bold">{props.statistics?.averageMatchQuality}%</p>
      </div>

      <div className="bg-card border border-border rounded-xl p-4 sm:p-6 hover:border-emerald-500/50 transition-all hover:shadow-lg hover:shadow-emerald-500/5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
            <FileCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-sm text-muted-foreground">CV Status</p>
        </div>
        <p className="text-xl sm:text-2xl font-bold capitalize">{props.statistics?.cvStatus}</p>
      </div>

      <div className="bg-card border border-border rounded-xl p-4 sm:p-6 hover:border-blue-500/50 transition-all hover:shadow-lg hover:shadow-blue-500/5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <Target className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-sm text-muted-foreground">Active Jobs</p>
        </div>
        <p className="text-3xl sm:text-4xl font-bold">{props.statistics?.activeJobs}</p>
      </div>
    </div>
  )
}

export default HeroStats
