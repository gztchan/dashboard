export function controllerBaseUrl(): string {
  return (process.env.CONTROLLER_URL ?? "http://127.0.0.1:8010").replace(
    /\/$/,
    "",
  );
}
