"use client"

import { useCallback, useState } from "react"

import type { ProfileManagerService } from "@providence/services"
import { useSnapshot } from "valtio"

import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

type ProfileCreateDialogProps = {
  profileManagerService: ProfileManagerService
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProfileCreateDialog({
  profileManagerService,
  open,
  onOpenChange,
}: ProfileCreateDialogProps) {
  const { loading } = useSnapshot(profileManagerService.state)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [saveError, setSaveError] = useState<string | null>(null)

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (nextOpen) {
        setName("")
        setDescription("")
        setSaveError(null)
      }
      onOpenChange(nextOpen)
    },
    [onOpenChange]
  )

  const onCreate = useCallback(() => {
    const trimmedName = name.trim()
    if (!trimmedName) {
      setSaveError("Name is required")
      return
    }
    setSaveError(null)
    profileManagerService.createProfile(
      {
        name: trimmedName,
        description: description.trim(),
      },
      {
        onSuccess: () => {
          onOpenChange(false)
        },
        onError: (err: unknown) => {
          setSaveError(err instanceof Error ? err.message : String(err))
        },
      }
    )
  }, [description, name, onOpenChange, profileManagerService])

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Profile</DialogTitle>
          <DialogDescription>
            Fill in profile details and create a new profile.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3">
          <label className="grid gap-1.5 text-sm">
            <span>Name</span>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Profile"
              autoComplete="off"
            />
          </label>
          <label className="grid gap-1.5 text-sm">
            <span>Description</span>
            <textarea
              className="min-h-[96px] rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description"
              rows={4}
            />
          </label>
          {saveError ? (
            <p className="text-sm text-destructive">{saveError}</p>
          ) : null}
        </div>
        <DialogFooter>
          <DialogClose render={<Button type="button" variant="outline" />} disabled={loading}>
            Cancel
          </DialogClose>
          <Button type="button" onClick={onCreate} disabled={loading}>
            {loading ? "Creating..." : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
