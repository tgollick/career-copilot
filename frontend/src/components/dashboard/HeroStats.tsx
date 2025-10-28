"use client"

import { Briefcase, FileCheck, Target, TrendingUp, AlertCircle, RefreshCw } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "../ui/button"

type Statistic = {
  totalMatches: number
  averageMatchQuality: number
  cvStatus: string
  activeJobs: number
}

type Props = {}

const HeroStats = (props: Props) => {
  const [statistics, setStatistics] = useState<Statistic | null>(null)
  const [error, setError] = useState<null | string>(null)
  const [loading, setLoading] = useState<boolean>(true)

  const getStatistics = async () => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/dashboard/stats")
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Failed to load statistics")
      } else {
        setStatistics(data)
      }
    } catch (err) {
      setError("Network error. Please check your connection.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getStatistics()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-4 sm:p-6 animate-pulse">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-muted" />
              <div className="h-4 bg-muted rounded w-24" />
            </div>
            <div className="h-10 bg-muted rounded w-20" />
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:gap-6 mb-8 sm:mb-12">
        <div className="bg-card border border-destructive/50 rounded-xl p-6 sm:p-8">
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-destructive" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-1">Failed to Load Statistics</h3>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
            <Button onClick={getStatistics} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
      <div className="bg-card border border-border rounded-xl p-4 sm:p-6 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground">Total Matches</p>
        </div>
        <p className="text-3xl sm:text-4xl font-bold">{statistics?.totalMatches}</p>
      </div>

      <div className="bg-card border border-border rounded-xl p-4 sm:p-6 hover:border-accent/50 transition-all hover:shadow-lg hover:shadow-accent/5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-accent" />
          </div>
          <p className="text-sm text-muted-foreground">Avg. Match</p>
        </div>
        <p className="text-3xl sm:text-4xl font-bold">{statistics?.averageMatchQuality}%</p>
      </div>

      <div className="bg-card border border-border rounded-xl p-4 sm:p-6 hover:border-emerald-500/50 transition-all hover:shadow-lg hover:shadow-emerald-500/5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
            <FileCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-sm text-muted-foreground">CV Status</p>
        </div>
        <p className="text-xl sm:text-2xl font-bold capitalize">{statistics?.cvStatus}</p>
      </div>

      <div className="bg-card border border-border rounded-xl p-4 sm:p-6 hover:border-blue-500/50 transition-all hover:shadow-lg hover:shadow-blue-500/5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <Target className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-sm text-muted-foreground">Active Jobs</p>
        </div>
        <p className="text-3xl sm:text-4xl font-bold">{statistics?.activeJobs}</p>
      </div>
    </div>
  )
}

export default HeroStats
