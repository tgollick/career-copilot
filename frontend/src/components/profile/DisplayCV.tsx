"use client"

import { useEffect, useState } from "react"
import { FileText, Download, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

const DisplayCV = () => {
  const [url, setUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCV = async () => {
      try {
        const res = await fetch("/api/cv/url")
        const data = await res.json()

        if (!res.ok) {
          setError(data.error)
        } else {
          setUrl(data.fileUrl)
        }
      } catch (err) {
        setError("Failed to load CV")
      } finally {
        setLoading(false)
      }
    }

    fetchCV()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 bg-muted/30 border border-border rounded-xl">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading CV...</span>
      </div>
    )
  }

  if (error || !url) {
    return (
      <div className="p-4 bg-destructive/10 border border-destructive/50 rounded-xl">
        <p className="text-sm text-destructive">{error || "Failed to load CV"}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium">
          <FileText className="w-4 h-4 text-primary" />
          <span>Current Uploaded CV</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          asChild
          className="hover:bg-primary hover:text-white transition-colors bg-transparent"
        >
          <a href={url} download target="_blank" rel="noopener noreferrer">
            <Download className="w-4 h-4 mr-2" />
            Download
          </a>
        </Button>
      </div>

      <div className="relative rounded-xl overflow-hidden border border-border bg-muted/30 shadow-inner">
        <iframe
          src={`https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`}
          width="100%"
          height="800px"
          className="w-full"
          title="CV Preview"
        />
      </div>
    </div>
  )
}

export default DisplayCV

