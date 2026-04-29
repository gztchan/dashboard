"use client";

import { Button } from "@base-ui/react/button";

import { btnClass } from "@/utils/styles";
import { useAppContext } from "@/providers/context";
import { useEffect, useMemo, useState } from "react";
import { useSnapshot } from "valtio";
import { type ProfileService } from "@providence/services";
import { ProfileCard } from "./card";
import { ProfileCreateDialog } from "./profile-create-dialog";

export default function Page() {
  const { profileManagerService } = useAppContext()!;
  const { profiles } = useSnapshot(profileManagerService.state);
  const [createOpen, setCreateOpen] = useState(false);

  const profileServices = useMemo(() => {
    return profiles.map(
      (profileId) => profileManagerService.profileServices.get(profileId)!,
    ) as ProfileService[];
  }, [profileManagerService.profileServices, profiles]);

  useEffect(() => {
    if (profiles.length === 0) {
      profileManagerService.fetchProfiles({ limit: 100, offset: 0 });
    }
  }, [profileManagerService, profiles]);

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end gap-4">
        <Button
          className={btnClass}
          disabled={false}
          onClick={() => profileManagerService.fetchProfiles({ limit: 100, offset: 0 })}
        >
          Refresh
        </Button>
        <Button className={btnClass} disabled={false} onClick={() => setCreateOpen(true)}>
          Create New Profile
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {profileServices.map((profileService) => (
          <ProfileCard
            key={profileService.state.profile.id}
            profileService={profileService}
          />
        ))}
      </div>
      <ProfileCreateDialog
        profileManagerService={profileManagerService}
        open={createOpen}
        onOpenChange={setCreateOpen}
      />
    </section>
  );
}
