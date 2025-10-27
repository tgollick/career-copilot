"use client"
import React, { useState } from 'react'
import { Button } from '../ui/button'
import { Loader2 } from 'lucide-react'
import { useAuth } from '@clerk/nextjs'

type Props = {}

enum Values {
  DeleteCurrentCV = "Delete Current CV",
  Deleting = "Deleting",
  ErrorDeletingCV = "Error Deleting CV",
  CVDeleted = "CV Deleted",
}

const DeleteCVButton = (props: Props) => {
  const [value, setValue] = useState<Values>(Values.DeleteCurrentCV);
  const { getToken } = useAuth()

  const handleDelete = async () => {
    setValue(Values.Deleting);

    const res = await fetch("/api/cv/delete", {
      method: "DELETE",
    })
    const data = await res.json();

    if(!res.ok) {
      setValue(Values.ErrorDeletingCV)
    } else {
      await getToken({ skipCache: true });
      window.location.href = "/";
    }
  }
  return (
      <Button onClick={handleDelete} disabled={value !== Values.DeleteCurrentCV} className={`${value === Values.ErrorDeletingCV ? "bg-destructive text-destructive-foreground" : ""} w-full text-base py-6`}>
        {value}

        {value === Values.Deleting && (
          <Loader2/>
        )}
      </Button>
  )
}

export default DeleteCVButton
