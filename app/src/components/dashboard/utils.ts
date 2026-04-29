export function statusTone(status: string): string {
  switch (status) {
    case "running":
      return "bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200";
    case "pending":
      return "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200";
    case "succeeded":
      return "bg-sky-100 text-sky-900 dark:bg-sky-950 dark:text-sky-200";
    case "failed":
    case "stopped":
      return "bg-zinc-200 text-zinc-800 dark:bg-zinc-700 dark:text-zinc-100";
    default:
      return "bg-violet-100 text-violet-900 dark:bg-violet-950 dark:text-violet-200";
  }
}

export function formatTime(iso: string | null | undefined): string {
  if (!iso) {
    return "—";
  }
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}
