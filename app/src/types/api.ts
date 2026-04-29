export type BrowserJob = {
  id: string;
  job_name: string;
  namespace: string;
  status: string;
  k8s_uid: string | null;
  k8s_message: string | null;
  created_at: string;
  updated_at: string;
};

export type BrowserJobList = {
  items: BrowserJob[];
  total: number;
};

export type UserDataPvc = {
  name: string;
  namespace: string;
  phase: string | null;
  storage_class_name: string | null;
  capacity: string | null;
  creation_timestamp: string | null;
  labels: Record<string, string>;
};

export type UserDataPvcList = {
  items: UserDataPvc[];
  total: number;
};
