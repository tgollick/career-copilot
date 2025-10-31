import { PersonStanding } from 'lucide-react'
import React from 'react'

type Props = {}

const UserInfo = (props: Props) => {
  return (
    <div className="group relative bg-card border border-border rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10">
            <PersonStanding className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold">Your Profile</h2>
        </div>
      </div>
    </div>
  )
}

export default UserInfo
