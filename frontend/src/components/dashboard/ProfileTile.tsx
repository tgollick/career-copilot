import { Award, Briefcase, FileCheck, Mail } from "lucide-react"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import Link from "next/link"

type Profile = {
  fullName: string
  email: string
  topSkills: string[]
  userImageUrl: string | null
}

type Props = {
  profile: Profile
}

const ProfileTile = (props: Props) => {
  return (
    <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 overflow-hidden rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-lg">
          {props.profile.userImageUrl != null ? (
            <img
              src={props.profile.userImageUrl}
              alt={`${props.profile.fullName} profile photo`}
            />
          ) : (
            <span>{props.profile.fullName.charAt(0)}</span>
          )}
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-bold">{props.profile.fullName}</h2>
          <p className="text-sm text-muted-foreground flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5" />
            {props.profile.email}
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
            {props.profile.topSkills.map((skill, i) => (
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
