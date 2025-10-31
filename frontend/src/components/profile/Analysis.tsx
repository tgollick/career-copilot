import { AlertCircle, Briefcase, CheckCircle2 } from 'lucide-react'
import React from 'react'
import DisplayCV from './DisplayCV'

type Props = {
  hasAnalysis: boolean;
}

const Analysis = (props: Props) => {
  return (
    <div className="group relative bg-card border border-border rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10">
            <Briefcase className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold">CV Analysis</h2>
        </div>

        {props.hasAnalysis ? (
          <div className="space-y-6">
            <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
              <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
              <div>
                <p className="font-semibold text-green-500">CV Successfully Analyzed</p>
                <p className="text-sm text-muted-foreground">
                  Your CV has been processed and is ready for job matching
                </p>
              </div>
            </div>

            <DisplayCV />
          </div>
        ) : (
          <div className="flex items-center gap-3 p-4 bg-muted/50 border border-border rounded-xl">
            <AlertCircle className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            <div>
              <p className="font-semibold text-muted-foreground">No CV Uploaded</p>
              <p className="text-sm text-muted-foreground">
                Upload your CV to get started with personalized job matching
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Analysis
