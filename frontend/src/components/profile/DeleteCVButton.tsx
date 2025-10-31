"use client"

import React, { useState, useTransition } from 'react'
import { Button } from '../ui/button'
import { CheckCircle, Loader2, Trash2 } from 'lucide-react'
import { useAuth } from '@clerk/nextjs'
import { toast } from 'sonner'
import { deleteCV } from '@/app/profile/actions/delete-cv'
import { useRouter } from 'next/navigation'

type Props = {}

const DeleteCVButton = (props: Props) => {
  const { getToken } = useAuth()
  const router = useRouter();

  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [isComplete, setIsComplete] = useState(false)

    const handleDeleteCV = async () => {
    setError(null);
    setIsComplete(false);

    // Show loading toast
    const loadingToast = toast.loading("Deleting CV, this might take a few moments...", {
      description: "This may take a few moments",
    });

    startTransition(async () => {
      try {
        const result = await deleteCV();
        
        if (!result.success) {
          toast.dismiss(loadingToast);
          toast.error("Failed to match jobs", {
            description: result.error || "Please try again later",
          });
          setError(result.error || "Failed to match jobs");
        } else {
          // Show success state briefly before refresh
          setIsComplete(true);
          toast.dismiss(loadingToast);
          toast.success("Jobs matched successfully!", {
            description: "All DB entries and CV's saved have been deleted from our system.",
            duration: 3000,
          });

          // Refresh Clerk cache to update metadata to trigger onboarding page load
          await getToken({ skipCache: true })

          // Small delay so user sees the success state
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Refresh the page data
          router.refresh()
        }
      } catch (error) {
        toast.dismiss(loadingToast);
        toast.error("Unexpected error", {
          description: "Something went wrong. Please try again.",
        });
        setError("Error deleting CV data: " + error);
      }
    });
  };
  
  return (
     <div>
      <Button
        onClick={handleDeleteCV}
        disabled={isPending || isComplete}
        size="lg"
        variant="destructive"
        className="w-full font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:cursor-pointer"
      >
        {isComplete ? (
          <>
            <CheckCircle className="w-5 h-5 mr-2" />
            Deleted Successfully!
          </>
        ) : isPending ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Deleting CV Data...
          </>
        ) : (
          <>
            <Trash2 className="w-5 h-5 mr-2" />
            Delete CV Data
          </>
        )}
      </Button>

      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive/50 rounded-lg animate-in fade-in slide-in-from-top-2 duration-300">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}
    </div>
 )
}

export default DeleteCVButton
