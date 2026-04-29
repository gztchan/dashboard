"use client";

import { Button } from "@base-ui/react/button";

import { btnClass } from "@/utils/styles";
import { useAppContext } from "@/providers/context";
import { useEffect, useMemo, useState } from "react";
import { useSnapshot } from "valtio";
import { BrowserCard } from "./card";
import { BrowserCreateDialog } from "./browser-create-dialog";

export default function Page() {
  const { browserManagerService, profileManagerService } = useAppContext()!;
  const { list } = useSnapshot(browserManagerService.state);
  const [createOpen, setCreateOpen] = useState(false);

  const browserServices = useMemo(() => {
    return list.map((browserId) => browserManagerService.browserServices.get(browserId)!);
  }, [browserManagerService.browserServices, list]);

  useEffect(() => {
    if (list.length === 0) {
      browserManagerService.fetchBrowsers({ limit: 100, offset: 0 });
    }
  }, [browserManagerService, list]);

  useEffect(() => {
    if (profileManagerService.state.profiles.length === 0) {
      profileManagerService.fetchProfiles({ limit: 100, offset: 0 });
    }
  }, [profileManagerService]);

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end gap-2">
        <Button
          className={btnClass}
          disabled={false}
          onClick={() => browserManagerService.fetchBrowsers({ limit: 100, offset: 0 })}
        >
          Refresh
        </Button>
        <Button className={btnClass} disabled={false} onClick={() => setCreateOpen(true)}>
          Create New Browser
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {browserServices.map((browserService) => (
          <BrowserCard key={browserService.state.browser.id} browserService={browserService} />
        ))}
      </div>
      <BrowserCreateDialog
        browserManagerService={browserManagerService}
        profileManagerService={profileManagerService}
        open={createOpen}
        onOpenChange={setCreateOpen}
      />
    </section>
  );
}
