"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'

export function ToastDemo() {
  const { toast } = useToast()
  
  return (
    <div className="flex flex-col items-center justify-center py-8 space-y-4">
      <h2 className="text-xl font-semibold">Toast Notifications Demo</h2>
      <div className="flex flex-wrap gap-4">
        <Button
          onClick={() => {
            toast({
              title: "Success!",
              description: "Your action was completed successfully.",
              duration: 5000,
            })
          }}
        >
          Show Success Toast
        </Button>
        
        <Button
          variant="destructive"
          onClick={() => {
            toast({
              title: "Error!",
              description: "There was a problem with your request.",
              variant: "destructive",
            })
          }}
        >
          Show Error Toast
        </Button>
      </div>
    </div>
  )
}
