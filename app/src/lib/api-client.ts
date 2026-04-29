const prefix = "/api/controller";

async function apiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<{ ok: boolean; status: number; data: T | null; text: string }> {
  const url = `${prefix}${path.startsWith("/") ? path : `/${path}`}`;
  const res = await fetch(url, {
    ...init,
    cache: "no-store",
    headers: {
      "content-type": "application/json",
      ...init?.headers,
    },
  });
  const text = await res.text();
  let data: T | null = null;
  if (text) {
    try {
      data = JSON.parse(text) as T;
    } catch {
      data = null;
    }
  }
  return { ok: res.ok, status: res.status, data, text };
}

export function listJobs(limit = 200) {
  return apiFetch<import("@/types/api").BrowserJobList>(
    `/api/v1/jobs?limit=${limit}`,
  );
}

export function stopJob(id: string) {
  return apiFetch<import("@/types/api").BrowserJob>(
    `/api/v1/jobs/${id}`,
    { method: "DELETE" },
  );
}

export function createJob(body: { job_name_suffix?: string | null }) {
  return apiFetch<import("@/types/api").BrowserJob>(`/api/v1/jobs`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function listUserDataPvcs(params: {
  namespace?: string;
  all_namespaces?: boolean;
}) {
  const q = new URLSearchParams();
  if (params.namespace) {
    q.set("namespace", params.namespace);
  }
  if (params.all_namespaces) {
    q.set("all_namespaces", "true");
  }
  const qs = q.toString();
  return apiFetch<import("@/types/api").UserDataPvcList>(
    `/api/v1/user-data${qs ? `?${qs}` : ""}`,
  );
}

export function deleteUserDataPvc(namespace: string, name: string) {
  const ns = encodeURIComponent(namespace);
  const n = encodeURIComponent(name);
  return apiFetch<import("@/types/api").UserDataPvc>(
    `/api/v1/user-data/${ns}/${n}`,
    { method: "DELETE" },
  );
}
