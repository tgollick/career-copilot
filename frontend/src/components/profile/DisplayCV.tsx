'use client'

import React, { useEffect, useState } from 'react'

type Props = {}

const DisplayCV = (props: Props) => {
  const [url, setUrl] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCV = async () => {
      const res = await fetch("/api/cv/url");

      const data = await res.json()

      if(!res.ok) {
        setError(data.error);
      } else {
        setUrl(data.fileUrl);
      }
    }

    fetchCV()
  }, [])

  if(!url || error) return <p>{error ? error : "Loading current CV..."}</p>

  return (
    <div className="w-full mt-4">
      <h3 className="text-lg font-bold mb-2">Current Uploaded CV</h3>
      <iframe
        src={`https://docs.google.com/gview?url=${encodeURIComponent(url!)}&embedded=true`}
        width="100%"
        height="800px"
      />
    </div>
  )
}

export default DisplayCV
