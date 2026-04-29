"use client"

import { useCallback, useMemo, useState } from "react"

import type { BrowserManagerService, ProfileManagerService } from "@providence/services"
import { useSnapshot } from "valtio"

import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

type BrowserCreateDialogProps = {
  browserManagerService: BrowserManagerService
  profileManagerService: ProfileManagerService
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BrowserCreateDialog({
  browserManagerService,
  profileManagerService,
  open,
  onOpenChange,
}: BrowserCreateDialogProps) {
  const { loading: browserLoading } = useSnapshot(browserManagerService.state)
  const { profiles, loading: profileLoading } = useSnapshot(profileManagerService.state)
  const [profileId, setProfileId] = useState("")
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [saveError, setSaveError] = useState<string | null>(null)

  const profileOptions = useMemo(() => {
    return profiles
      .map((id) => profileManagerService.profileServices.get(id))
      .filter((service): service is NonNullable<typeof service> => Boolean(service))
      .map((service) => ({
        id: service.state.profile.id,
        name: service.state.profile.name,
      }))
  }, [profileManagerService.profileServices, profiles])

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (nextOpen) {
        setName("")
        setDescription("")
        setSaveError(null)
        setProfileId(profileOptions[0]?.id ?? "")
      }
      onOpenChange(nextOpen)
    },
    [onOpenChange, profileOptions]
  )

  const onCreate = useCallback(() => {
    if (!profileId) {
      setSaveError("Please select a profile")
      return
    }
    setSaveError(null)
    browserManagerService.createBrowser(
      {
        profileId,
        name: name.trim(),
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
  }, [browserManagerService, description, name, onOpenChange, profileId])

  const isLoading = browserLoading || profileLoading

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Browser</DialogTitle>
          <DialogDescription>
            Choose a profile and create a browser instance.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3">
          <label className="grid gap-1.5 text-sm">
            <span>Profile</span>
            <select
              className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
              value={profileId}
              onChange={(e) => setProfileId(e.target.value)}
              disabled={isLoading || profileOptions.length === 0}
            >
              {profileOptions.length === 0 ? (
                <option value="">No profile available</option>
              ) : null}
              {profileOptions.map((profile) => (
                <option key={profile.id} value={profile.id}>
                  {profile.name} ({profile.id})
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-1.5 text-sm">
            <span>Name</span>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Browser"
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
          <DialogClose render={<Button type="button" variant="outline" />} disabled={isLoading}>
            Cancel
          </DialogClose>
          <Button
            type="button"
            onClick={onCreate}
            disabled={isLoading || profileOptions.length === 0}
          >
            {browserLoading ? "Creating..." : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
