"use client";

import { useCallback, useEffect, useState } from "react";
import { useSnapshot } from "valtio";
import { Dialog } from "@base-ui/react/dialog";
import { Button } from "@base-ui/react/button";

import type { ProfileService } from "@providence/services";
import { btnClass, inputClass } from "@/utils/styles";

type ProfileEditDialogProps = {
  profileService: ProfileService;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ProfileEditDialog({
  profileService,
  open,
  onOpenChange,
}: ProfileEditDialogProps) {
  const { profile, loading } = useSnapshot(profileService.state);
  const [name, setName] = useState(profile.name);
  const [description, setDescription] = useState(profile.description ?? "");
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setName(profile.name);
    setDescription(profile.description ?? "");
    setSaveError(null);
  }, [open, profile.name, profile.description]);

  const onSave = useCallback(() => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setSaveError("名称不能为空");
      return;
    }
    setSaveError(null);
    profileService.updateProfile(
      {
        name: trimmedName,
        description: description.trim(),
      },
      {
        onSuccess: () => {
          setSaveError(null);
          onOpenChange(false);
        },
        onError: (err: unknown) => {
          setSaveError(err instanceof Error ? err.message : String(err));
        },
      },
    );
  }, [profileService, name, description, onOpenChange]);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 min-h-dvh bg-black/40 transition-opacity data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 supports-[-webkit-touch-callout:none]:absolute" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 w-[min(100vw-2rem,26rem)] max-h-[min(calc(100dvh-2rem),32rem)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-lg border border-zinc-200 bg-white p-5 text-zinc-900 shadow-lg outline-none transition-[opacity,transform] data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100">
          <Dialog.Title className="text-base font-semibold">Edit Profile</Dialog.Title>
          <Dialog.Description className="mt-1 truncate font-mono text-xs text-zinc-500 dark:text-zinc-400">
            {profile.id}
          </Dialog.Description>

          <div className="mt-4 space-y-3">
            <label className="flex flex-col gap-1 text-xs text-zinc-600 dark:text-zinc-400">
              Name
              <input
                className={inputClass}
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="off"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs text-zinc-600 dark:text-zinc-400">
              Description
              <textarea
                className="min-h-[88px] rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-sm text-zinc-900 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </label>
            {saveError ? (
              <p className="text-xs text-red-600 dark:text-red-400">{saveError}</p>
            ) : null}
          </div>

          <div className="mt-5 flex justify-end gap-2">
            <Dialog.Close className={btnClass} type="button">
              Cancel
            </Dialog.Close>
            <Button type="button" className={btnClass} disabled={loading} onClick={onSave}>
              {loading ? "Saving…" : "Save"}
            </Button>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
