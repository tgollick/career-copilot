"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cvAnalyses, users } from "@/db/schema"
import { db } from "@/lib"
import { auth } from "@clerk/nextjs/server"
import { eq } from "drizzle-orm"
import {
  Briefcase,
  TrendingUp,
  FileCheck,
  Target,
  MapPin,
  DollarSign,
  ExternalLink,
  FileText,
  Mail,
  Award,
  Clock,
  Sparkles,
  Loader2,
  Loader,
} from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

// Mock data for dashboard
const mockStats = {
  totalMatches: 47,
  averageMatchQuality: 78,
  cvStatus: "analyzed",
  activeJobs: 156,
}

const mockTopMatches = [
  {
    id: 1,
    title: "Senior Full Stack Developer",
    company: "TechCorp Solutions",
    location: "London, UK",
    salary: "£70,000 - £90,000",
    matchQuality: 94,
    matchLabel: "Excellent Match",
    postedDate: "2 days ago",
  },
  {
    id: 2,
    title: "Machine Learning Engineer",
    company: "AI Innovations Ltd",
    location: "Remote",
    salary: "£80,000 - £100,000",
    matchQuality: 89,
    matchLabel: "Excellent Match",
    postedDate: "1 week ago",
  },
  {
    id: 3,
    title: "Python Backend Developer",
    company: "DataFlow Systems",
    location: "Manchester, UK",
    salary: "£55,000 - £70,000",
    matchQuality: 85,
    matchLabel: "Good Match",
    postedDate: "3 days ago",
  },
  {
    id: 4,
    title: "DevOps Engineer",
    company: "CloudScale Inc",
    location: "Bristol, UK",
    salary: "£60,000 - £80,000",
    matchQuality: 81,
    matchLabel: "Good Match",
    postedDate: "5 days ago",
  },
  {
    id: 5,
    title: "React Developer",
    company: "Frontend Masters",
    location: "Remote",
    salary: "£50,000 - £65,000",
    matchQuality: 76,
    matchLabel: "Good Match",
    postedDate: "1 week ago",
  },
]

const mockRecentJobs = [
  {
    id: 6,
    title: "Junior Python Developer",
    company: "StartupHub",
    location: "London, UK",
    salary: "£30,000 - £40,000",
    postedDate: "1 hour ago",
  },
  {
    id: 7,
    title: "Data Scientist",
    company: "Analytics Pro",
    location: "Edinburgh, UK",
    salary: "£65,000 - £85,000",
    postedDate: "3 hours ago",
  },
  {
    id: 8,
    title: "Cloud Architect",
    company: "Enterprise Solutions",
    location: "Remote",
    salary: "£90,000 - £120,000",
    postedDate: "5 hours ago",
  },
  {
    id: 9,
    title: "Frontend Engineer",
    company: "Design Systems Co",
    location: "Birmingham, UK",
    salary: "£45,000 - £60,000",
    postedDate: "8 hours ago",
  },
  {
    id: 10,
    title: "QA Automation Engineer",
    company: "TestLab Solutions",
    location: "Leeds, UK",
    salary: "£40,000 - £55,000",
    postedDate: "12 hours ago",
  },
]

const mockProfile = {
  name: "John Developer",
  email: "john.developer@example.com",
  topSkills: ["Python", "React", "TypeScript", "Machine Learning", "AWS"],
}

// Info needed:
// Profile info:
type Profile = {
  fullName: string,
  email: string,
  topSkills: string[],
}

// Statistical info:
type Statistic = {
  totalMatches: number,
  averageMatchQuality: number,
  cvStatus: string, 
  activeJobs: number,
}

// Top 5 newest jobs:
type Job = {
  id: number,
  title: string,
  company: string,
  location: string,
  salary: string,
  postedDate: Date,
}

// Top 5 best matching jobs (IN SAME TYPE FORMAT!)
type MatchedJob = {
  id: number,
  title: string,
  company: string,
  location: string, 
  salary: string,
  matchQuality: number,
  matchLabel: string, 
  postedDate: string,
}

const getMatchQualityColor = (quality: number) => {
  if (quality >= 85) return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
  if (quality >= 70) return "bg-blue-500/10 text-blue-400 border-blue-500/30"
  if (quality >= 55) return "bg-amber-500/10 text-amber-400 border-amber-500/30"
  return "bg-slate-500/10 text-slate-400 border-slate-500/30"
}

export default function DashboardPage() {
  const [userInfo, setUserInfo] = useState<Profile | null>(null)
  const [statistics, setStatistics] = useState<Statistic | null>(null)
  const [newestJobs, setNewestJobs] = useState<Job | null>(null)
  const [bestMatchedJobs, setBestMatchedJobs] = useState<MatchedJob | null>(null)
  const [error, setError] = useState<string | null>(null)

  const getUserInfo = async () => {
    const res = await fetch("/api/dashboard/user");
    const data = await res.json();

    if(!res.ok) {
      setError(data.error);
    } else {
      setUserInfo({
        fullName: data.fullName,
        email: data.email,
        topSkills: data.topSkills,
      })
    }
  }

  const getStatistics = async () => {
    const res = await fetch("/api/dashboard/stats");
    const data = await res.json();

    if(!res.ok) {
      setError(data.error)
    } else {
      setStatistics({
        ...data
      })
    }
  }

  const getNewestJobs = async () => {
  }

  const getMatchedJobs = async () => {

  }

  useEffect(() => {
    getUserInfo();
    getStatistics();
  }, [])

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

        {/* Hero Stats */}
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

        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            {/* Top Matches */}
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
                {mockTopMatches.map((job) => (
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
                ))}
              </div>

              <Button asChild variant="outline" className="w-full mt-4 sm:hidden bg-transparent">
                <Link href="/jobs">
                  View All Jobs
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>

            {/* Recent Opportunities */}
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
                {mockRecentJobs.map((job) => (
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
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 sm:space-y-8">
            {/* Profile Summary */}
            <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-6 sm:p-8">
              {!userInfo ? (
                <div className="flex flex-col items-center justify-center gap-2">
                    <Loader />
                    <p>Loading User Info...</p>
                </div>
                ) : (
              <>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-lg">
                    {userInfo.fullName.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold">{userInfo.fullName}</h2>
                    <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5" />
                      {userInfo.email}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <Award className="w-4 h-4 text-primary" />
                      Top Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {userInfo.topSkills.map((skill, i) => (
                        <Badge key={i} variant="secondary" className="bg-primary/5 text-primary border-primary/20">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border space-y-2">
                    <Button asChild variant="outline" className="w-full bg-transparent" size="sm">
                      <Link href="/profile">
                        <FileCheck className="w-4 h-4 mr-2" />
                        View Profile
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full bg-transparent" size="sm">
                      <Link href="/jobs">
                        <Briefcase className="w-4 h-4 mr-2" />
                        Browse Jobs
                      </Link>
                    </Button>
                  </div>
                </div>
              </>
            )}
            </div>

            {/* Match Quality Distribution */}
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
                {[
                  { label: "Excellent (85%+)", count: 12, color: "bg-emerald-500", percentage: 26 },
                  { label: "Good (70-84%)", count: 18, color: "bg-blue-500", percentage: 38 },
                  { label: "Fair (55-69%)", count: 14, color: "bg-amber-500", percentage: 30 },
                  { label: "Weak (<55%)", count: 3, color: "bg-slate-500", percentage: 6 },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-2 text-sm">
                      <span className="text-muted-foreground">{item.label}</span>
                      <span className="font-semibold">{item.count}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.percentage}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
