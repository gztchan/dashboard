"use client";

import { useCallback, useEffect, useState } from "react";
import { formatTime } from "@/utils/date";
import type { ProfileService } from "@providence/services";
import { useSnapshot } from "valtio";
import { Button } from "@base-ui/react/button";
import { Dialog } from "@base-ui/react/dialog";
import { btnClass, btnDanger } from "@/utils/styles";
import { useAppContext } from "@/providers/context";
import { ProfileEditDialog } from "./profile-edit-dialog";

export function ProfileCard({
  profileService,
}: {
  profileService: ProfileService;
}) {
  const { profileManagerService } = useAppContext()!;
  const { profile } = useSnapshot(profileService.state);
  const { loading: managerLoading } = useSnapshot(profileManagerService.state);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    if (!deleteOpen) return;
    setDeleteError(null);
  }, [deleteOpen]);

  const onConfirmDelete = useCallback(() => {
    setDeleteError(null);
    profileManagerService.deleteProfile(
      { profileId: profile.id },
      {
        onSuccess: () => {
          setDeleteOpen(false);
        },
        onError: (err: unknown) => {
          setDeleteError(err instanceof Error ? err.message : String(err));
        },
      },
    );
  }, [profileManagerService, profile.id]);

  return (
    <>
      <article className="flex flex-col gap-3 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-950">
        <div className="min-w-0 flex-1 space-y-1">
          <h3 className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            {profile.name}
          </h3>
          <p className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
            {profile.id}
          </p>
          <p className="line-clamp-3 text-xs text-zinc-600 dark:text-zinc-300">
            {profile.description ?? "—"}
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {formatTime(profile.createdAt)}
          </p>
        </div>
        <div className="mt-auto flex justify-end gap-2 border-t border-zinc-100 pt-3 dark:border-zinc-800">
          <Button className={btnDanger} type="button" onClick={() => setDeleteOpen(true)}>
            Delete
          </Button>
          <Button className={btnClass} type="button" onClick={() => setEditOpen(true)}>
            Edit
          </Button>
        </div>
      </article>
      <ProfileEditDialog
        profileService={profileService}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
      <Dialog.Root open={deleteOpen} onOpenChange={setDeleteOpen}>
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 min-h-dvh bg-black/40 transition-opacity data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 supports-[-webkit-touch-callout:none]:absolute" />
          <Dialog.Popup className="fixed top-1/2 left-1/2 w-[min(100vw-2rem,24rem)] -translate-x-1/2 -translate-y-1/2 rounded-lg border border-zinc-200 bg-white p-5 text-zinc-900 shadow-lg outline-none transition-[opacity,transform] data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100">
            <Dialog.Title className="text-base font-semibold">Delete profile</Dialog.Title>
            <Dialog.Description className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Permanently delete “{profile.name}”? This cannot be undone.
            </Dialog.Description>
            {deleteError ? (
              <p className="mt-3 text-xs text-red-600 dark:text-red-400">{deleteError}</p>
            ) : null}
            <div className="mt-5 flex justify-end gap-2">
              <Dialog.Close className={btnClass} type="button" disabled={managerLoading}>
                Cancel
              </Dialog.Close>
              <Button
                type="button"
                className={btnDanger}
                disabled={managerLoading}
                onClick={onConfirmDelete}
              >
                {managerLoading ? "Deleting…" : "Delete"}
              </Button>
            </div>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
