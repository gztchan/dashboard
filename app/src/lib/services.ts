import {
  BrowserManagerService,
  ProfileManagerService,
} from "@providence/services";

export function createBrowserManagerService(): BrowserManagerService {
  return BrowserManagerService.createService();
}

export function createProfileManagerService(): ProfileManagerService {
  return ProfileManagerService.createService();
}
