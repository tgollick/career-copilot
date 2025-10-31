"use client"

import { TrendingUp } from "lucide-react"

type Distro = {
  label: string
  count: number
  color: string
  percentage: number
}

type Props = {
  distro: Distro[]
}

const MatchQualityDistro = (props: Props) => {
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
        {props.distro.length > 0 ? (
          props.distro.map((item, i) => (
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
