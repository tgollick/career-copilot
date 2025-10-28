"use client"

import { TrendingUp, AlertCircle, RefreshCw } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "../ui/button"

type Distro = {
  label: string
  count: number
  color: string
  percentage: number
}

type Props = {}

const MatchQualityDistro = (props: Props) => {
  const [distroStats, setDistroStats] = useState<Distro[]>([])
  const [error, setError] = useState<null | string>(null)
  const [loading, setLoading] = useState<boolean>(true)

  const fetchDistro = async () => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/dashboard/distro")
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Failed to load distribution data")
      } else if (!data) {
        setError("No data found in response")
      } else {
        setDistroStats(data.distroData)
      }
    } catch (err) {
      setError("Network error. Please check your connection.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDistro()
  }, [])

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-muted animate-pulse" />
          <div className="space-y-2">
            <div className="h-5 bg-muted rounded w-32 animate-pulse" />
            <div className="h-4 bg-muted rounded w-24 animate-pulse" />
          </div>
        </div>

        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i}>
              <div className="flex items-center justify-between mb-2">
                <div className="h-4 bg-muted rounded w-20 animate-pulse" />
                <div className="h-4 bg-muted rounded w-8 animate-pulse" />
              </div>
              <div className="h-2 bg-muted rounded-full animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold">Match Distribution</h2>
            <p className="text-sm text-muted-foreground">Quality breakdown</p>
          </div>
        </div>

        <div className="bg-background border border-destructive/50 rounded-lg p-6">
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-destructive" />
            </div>
            <div>
              <h3 className="text-base font-semibold mb-1">Failed to Load Distribution</h3>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
            <Button onClick={fetchDistro} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-bold">Match Distribution</h2>
          <p className="text-sm text-muted-foreground">Quality breakdown</p>
        </div>
      </div>

      <div className="space-y-4">
        {distroStats.length > 0 ? (
          distroStats.map((item, i) => (
            <div key={i}>
              <div className="flex items-center justify-between mb-2 text-sm">
                <span className="text-muted-foreground">{item.label}</span>
                <span className="font-semibold">{item.count}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full ${item.color} rounded-full transition-all duration-500`}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">No distribution data available yet.</div>
        )}
      </div>
    </div>
  )
}

export default MatchQualityDistro
