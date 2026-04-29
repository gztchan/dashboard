"use client";

import { useState } from "react";
import { statusTone } from "@/utils/tone";
import type { BrowserService } from "@providence/services";
import { useSnapshot } from "valtio";
import { Button } from "@base-ui/react/button";
import { btnClass, btnDanger } from "@/utils/styles";
import { useAppContext } from "@/providers/context";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { BrowserInspectDialog } from "./browser-inspect-dialog";

export function BrowserCard({ browserService }: { browserService: BrowserService }) {
  const { browserManagerService } = useAppContext()!;
  const browser = useSnapshot(browserService.state.browser);
  const { loading } = useSnapshot(browserManagerService.state);
  const [inspectOpen, setInspectOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  return (
    <>
      <article className="flex flex-col gap-3 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-950">
        <div className="min-w-0 space-y-2">
          <span
            className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${statusTone(`status-${browser.id}`)}`}
          >
            {browser.id}
          </span>
          <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
            {browser.name}
          </p>
          <p className="line-clamp-1 text-xs text-zinc-500 dark:text-zinc-400">
            {browser.profile?.name ?? "—"}
          </p>
          <p className="line-clamp-2 text-xs text-zinc-600 dark:text-zinc-300">
            {browser.browserJob?.metadata?.job_name ?? "—"}
          </p>
        </div>
        <div className="mt-auto flex flex-wrap justify-end gap-2 border-t border-zinc-100 pt-3 dark:border-zinc-800">
          <Popover open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
            <PopoverTrigger
              render={<Button className={btnDanger} type="button" disabled={loading} />}
            >
              Delete
            </PopoverTrigger>
            <PopoverContent className="w-64 space-y-3 p-3" side="top" align="end">
              <p className="text-sm text-zinc-700 dark:text-zinc-200">
                Confirm delete this browser?
              </p>
              <div className="flex justify-end gap-2">
                <Button className={btnClass} type="button" onClick={() => setDeleteConfirmOpen(false)}>
                  Cancel
                </Button>
                <Button
                  className={btnDanger}
                  type="button"
                  disabled={loading}
                  onClick={() => {
                    browserManagerService.deleteBrowser({ browserId: browser.id });
                    setDeleteConfirmOpen(false);
                  }}
                >
                  Confirm
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          <Button className={btnClass} type="button" onClick={() => setInspectOpen(true)}>
            Inspect
          </Button>
        </div>
      </article>
      <BrowserInspectDialog
        browserService={browserService}
        open={inspectOpen}
        onOpenChange={setInspectOpen}
      />
    </>
  );
}