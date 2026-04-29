"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSnapshot } from "valtio";
import { Dialog } from "@base-ui/react/dialog";
import { Button } from "@base-ui/react/button";

import type { BrowserService } from "@providence/services";
import { btnClass } from "@/utils/styles";
import { VncScreenHandle } from "react-vnc";
// import { buildBrowserVncWebSocketUrl } from "@/utils/vnc-url";

const VncScreen = dynamic(
  () => import("react-vnc").then((m) => m.VncScreen),
  { ssr: false },
);

type BrowserInspectDialogProps = {
  browserService: BrowserService;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function formatJobMetadata(metadata: Record<string, unknown>) {
  const rows: { key: string; value: string }[] = [];
  for (const [key, value] of Object.entries(metadata)) {
    rows.push({
      key,
      value:
        typeof value === "object" && value !== null
          ? JSON.stringify(value)
          : String(value),
    });
  }
  return rows;
}

export function BrowserInspectDialog({
  browserService,
  open,
  onOpenChange,
}: BrowserInspectDialogProps) {
  const { browser, loading } = useSnapshot(browserService.state);
  const [name, setName] = useState(browser.name);
  const [description, setDescription] = useState(browser.description ?? "");
  const [resolution, setResolution] = useState(browser.metadata.resolution ?? { width: "1440", height: "900" });
  const [saveError, setSaveError] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!open) return;
    setName(browser.name);
    setDescription(browser.description ?? "");
    setResolution(browser.metadata.resolution ?? { width: "1440", height: "900" });
    setSaveError(null);
  }, [open, browser.name, browser.description]);

  const vncUrl = useMemo(() => {
    if (!open || typeof window === "undefined") {
      return null;
    }

    const { hostname, port } = window.location;
    const host = port ? `${hostname}:${port}` : hostname;
    return `ws://${host}/websockify?browser_id=${browser.id}`;
  }, [open, browser.id]);

  const jobMetaRows = useMemo(
    () =>
      browser.browserJob
        ? formatJobMetadata(browser.browserJob.metadata as Record<string, unknown>)
        : [],
    [browser.browserJob],
  );

  const onSave = useCallback(() => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setSaveError("Name cannot be empty");
      return;
    }
    setSaveError(null);
    browserService.updateBrowser(
      {
        name: trimmedName,
        description: description.trim(),
        resolution: resolution,
      },
      {
        onSuccess: () => setSaveError(null),
        onError: (err: unknown) => {
          setSaveError(err instanceof Error ? err.message : String(err));
        },
      },
    );
  }, [browserService, name, description, resolution]);

  const onLaunch = useCallback(() => {
    browserService.launchBrowser(
      {
        onSuccess: () => setSaveError(null),
        onError: (err: unknown) => {
          setSaveError(err instanceof Error ? err.message : String(err));
        },
      },
    );
  }, [browserService]);

  const onStop = useCallback(() => {
    browserService.terminateBrowser(
      {
        onSuccess: () => setSaveError(null),
        onError: (err: unknown) => {
          setSaveError(err instanceof Error ? err.message : String(err));
        },
      },
    );
  }, [browserService]);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 min-h-dvh bg-black/50 transition-opacity data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 supports-[-webkit-touch-callout:none]:absolute" />
        <Dialog.Popup className="fixed inset-4 flex max-h-[calc(100dvh-2rem)] flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white text-zinc-900 shadow-xl outline-none transition-[opacity,transform] data-[ending-style]:scale-[0.98] data-[ending-style]:opacity-0 data-[starting-style]:scale-[0.98] data-[starting-style]:opacity-0 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 sm:inset-6 md:inset-8">
          <div className="flex shrink-0 items-start justify-between gap-3 border-b border-zinc-200 px-4 py-3 dark:border-zinc-800 sm:px-5">
            <div className="min-w-0">
              <Dialog.Title className="text-lg font-semibold tracking-tight">
                {browser.name}
              </Dialog.Title>
              <Dialog.Description className="mt-0.5 truncate font-mono text-xs text-zinc-500 dark:text-zinc-400">
                {browser.id}
              </Dialog.Description>
            </div>
            <Dialog.Close
              className={`${btnClass} h-8 shrink-0 px-2 text-xs`}
              type="button"
            >
              Close
            </Dialog.Close>
          </div>

          <div className="grid min-h-0 flex-1 grid-cols-1 gap-0 lg:grid-cols-[minmax(280px,340px)_1fr] lg:divide-x lg:divide-zinc-200 dark:lg:divide-zinc-800">
            <aside className="flex min-h-0 flex-col gap-4 overflow-y-auto p-4 sm:p-5">
              <section className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                  Browser Details
                </h3>
                <label className="flex flex-col gap-1 text-xs text-zinc-600 dark:text-zinc-400">
                  Name
                  <input
                    className="h-9 rounded-md border border-zinc-300 bg-white px-2 text-sm text-zinc-900 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
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
                <label className="flex flex-col gap-1 text-xs text-zinc-600 dark:text-zinc-400">
                  Resolution
                  <select
                    className="h-9 rounded-md border border-zinc-300 bg-white px-2 text-sm text-zinc-900 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
                    value={resolution.width + "x" + resolution.height}
                    onChange={(e) => {
                      const [width, height] = e.target.value.split("x");
                      setResolution({ width: width, height: height });
                    }}
                  >
                    <option value="1024x768">1024x768</option>
                    <option value="1440x900">1440x900</option>
                    <option value="1920x1080">1920x1080</option>
                  </select>
                </label>
                {saveError ? (
                  <p className="text-xs text-red-600 dark:text-red-400">{saveError}</p>
                ) : null}
                <div className="flex justify-between gap-2">
                  <Button
                    type="button"
                    className={btnClass}
                    disabled={loading}
                    onClick={onSave}
                  >
                    {loading ? "Saving…" : "Save"}
                  </Button>
                  <Button
                    type="button"
                    className={btnClass}
                    disabled={loading}
                    onClick={browser.browserJob ? onStop : onLaunch}
                  >
                    {browser.browserJob ? "Stop" : "Launch"}
                  </Button>
                </div>
              </section>

              <section className="space-y-2 border-t border-zinc-100 pt-4 dark:border-zinc-800">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                  Browser Job
                </h3>
                {browser.browserJob ? (
                  <dl className="space-y-2 text-xs">
                    <div className="flex flex-col gap-0.5">
                      <dt className="text-zinc-500 dark:text-zinc-400">id</dt>
                      <dd className="break-all font-mono text-zinc-800 dark:text-zinc-200">
                        {browser.browserJob.id}
                      </dd>
                    </div>
                    {/* <div className="flex flex-col gap-0.5">
                      <dt className="text-zinc-500 dark:text-zinc-400">status</dt>
                      <dd className="font-mono text-zinc-800 dark:text-zinc-200">
                        {browser.browserJob.status}
                      </dd>
                    </div> */}
                    <div className="pt-1">
                      <dt className="mb-1 text-zinc-500 dark:text-zinc-400">metadata</dt>
                      <dd>
                        <ul className="max-h-40 space-y-1 overflow-y-auto rounded border border-zinc-200 bg-zinc-50 p-2 dark:border-zinc-700 dark:bg-zinc-900">
                          {jobMetaRows.map((row) => (
                            <li key={row.key} className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-0.5">
                              <span className="font-mono text-zinc-500 dark:text-zinc-400">
                                {row.key}
                              </span>
                              <span className="break-all font-mono text-zinc-800 dark:text-zinc-200">
                                {row.value}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </dd>
                    </div>
                  </dl>
                ) : (
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">暂无关联 Job</p>
                )}
              </section>

              {browser.profile ? (
                <section className="space-y-1 border-t border-zinc-100 pt-4 text-xs dark:border-zinc-800">
                  <h3 className="font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                    Profile
                  </h3>
                  <p className="font-medium text-zinc-800 dark:text-zinc-200">
                    {browser.profile.name}
                  </p>
                  <p className="break-all font-mono text-zinc-500">{browser.profile.id}</p>
                </section>
              ) : null}
            </aside>

            <main className="flex flex-colmin-h-[min(50vh,420px)] min-w-0 gap-2 p-4 sm:p-5 lg:min-h-0 ">
              <div className="relative flex flex-1 h-full border border-zinc-800 bg-black overflow-auto">
                <div className={`flex w-full h-full justify-center items-center`}>
                {open && vncUrl && browser.browserJob ? (
                  <div className="flex" style={{ width: `${resolution.width}px`, height: `${resolution.height}px` }}>
                    <VncScreen
                      url={vncUrl}
                      autoConnect={true}
                      retryDuration={1000}
                      clipViewport
                      background="#000000"
                      style={{ width: `${resolution.width}px`, height: `${resolution.height}px` }}
                    />
                  </div>
                ) : (
                  <div className="flex h-full min-h-[280px] flex-col items-center justify-center gap-2 px-4 text-center text-sm text-zinc-400">
                    <span>No running Browser instance, cannot establish VNC.</span>
                    </div>
                )}
                </div>
              </div>
            </main>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
