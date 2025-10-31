"use client"

import { Award, Briefcase, FileCheck, Mail, AlertCircle, RefreshCw } from "lucide-react"
import { useEffect, useState } from "react"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import Link from "next/link"
import { useUser } from "@clerk/nextjs"

type Profile = {
  fullName: string
  email: string
  topSkills: string[]
}

type Props = {}

const ProfileTile = (props: Props) => {
  const { user } = useUser()

  const [userInfo, setUserInfo] = useState<Profile | null>(null)
  const [error, setError] = useState<null | string>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [userImageUrl, setUserImageUrl] = useState<string | null>(null)

  const getUserInfo = async () => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/dashboard/user")
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Failed to load user information")
      } else {
        setUserInfo({
          fullName: data.fullName,
          email: data.email,
          topSkills: data.topSkills,
        })
      }
    } catch (err) {
      setError("Network error. Please check your connection.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getUserInfo()
  }, [])

  useEffect(() => {
    if(!user) return;
    if(!user.hasImage) return;

    setUserImageUrl(user.imageUrl)
  }, [user])

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-6 sm:p-8 animate-pulse">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-muted" />
          <div className="flex-1 space-y-2">
            <div className="h-5 bg-muted rounded w-32" />
            <div className="h-4 bg-muted rounded w-40" />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="h-4 bg-muted rounded w-24 mb-3" />
            <div className="flex flex-wrap gap-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-6 bg-muted rounded-full w-20" />
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-border space-y-2">
            <div className="h-9 bg-muted rounded" />
            <div className="h-9 bg-muted rounded" />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-6 sm:p-8">
        <div className="bg-background border border-destructive/50 rounded-lg p-6">
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-destructive" />
            </div>
            <div>
              <h3 className="text-base font-semibold mb-1">Failed to Load Profile</h3>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
            <Button onClick={getUserInfo} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (!userInfo) return null

  return (
    <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 overflow-hidden rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-lg">
          {userImageUrl != null ? (
            <img
              src={userImageUrl}
              alt={`${userInfo.fullName} profile photo`}
            />
          ) : (
            <span>{userInfo.fullName.charAt(0)}</span>
          )}
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
    </div>
  )
}

export default ProfileTile
