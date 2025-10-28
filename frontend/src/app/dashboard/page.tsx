import HeroStats from "@/components/dashboard/HeroStats"
import JobInformation from "@/components/dashboard/JobInformation"
import MatchQualityDistro from "@/components/dashboard/MatchQualityDistro"
import ProfileTile from "@/components/dashboard/ProfileTile"

import {
  Target,
} from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="relative min-h-screen bg-background">
      {/* Fixed gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Target className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">Dashboard</h1>
          </div>
          <p className="text-base sm:text-lg text-muted-foreground">
            Your personalized job matching overview and insights
          </p>
        </div>

        {/* Hero stats for jobs, cv analysis, average similarity score etc. */}
        <HeroStats />

        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            {/* Job Information (best matches, new posted jobs)*/}
            <JobInformation />
          </div>

          {/* Sidebar */}
          <div className="space-y-6 sm:space-y-8">
            {/* Profile Summary */}
            <ProfileTile />

            {/* Match Quality Distribution */}
            <MatchQualityDistro />
          </div>
        </div>
      </div>
    </div>
  )
}
