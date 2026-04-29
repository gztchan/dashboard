import { Button } from "@base-ui/react/button";
import { Dialog } from "@base-ui/react/dialog";

import type { BrowserJob, UserDataPvc } from "@/types/api";

import { btnClass, btnDanger } from "@/utils/styles";

type StopJobDialogProps = {
  stopTarget: BrowserJob | null;
  setStopTarget: (target: BrowserJob | null) => void;
  onConfirmStop: () => void;
};

export function StopJobDialog({
  stopTarget,
  setStopTarget,
  onConfirmStop,
}: StopJobDialogProps) {
  return (
    <Dialog.Root
      open={stopTarget !== null}
      onOpenChange={(open) => {
        if (!open) {
          setStopTarget(null);
        }
      }}
    >
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 min-h-dvh bg-black/40 transition-opacity data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 supports-[-webkit-touch-callout:none]:absolute" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 w-[min(100vw-2rem,24rem)] -translate-x-1/2 -translate-y-1/2 rounded-lg border border-zinc-200 bg-white p-5 text-zinc-900 shadow-lg outline-none transition-[opacity,transform] data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100">
          <Dialog.Title className="text-base font-semibold">
            停止浏览器 Job？
          </Dialog.Title>
          <Dialog.Description className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            {stopTarget ? (
              <>
                将删除集群中的 Job{" "}
                <span className="font-mono">{stopTarget.job_name}</span>
                ，数据库状态会标记为 stopped。
              </>
            ) : null}
          </Dialog.Description>
          <div className="mt-5 flex justify-end gap-2">
            <Dialog.Close className={btnClass}>取消</Dialog.Close>
            <Button className={btnDanger} onClick={onConfirmStop}>
              确认停止
            </Button>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

type DeletePvcDialogProps = {
  deletePvcTarget: UserDataPvc | null;
  setDeletePvcTarget: (target: UserDataPvc | null) => void;
  onConfirmDeletePvc: () => void;
};

export function DeletePvcDialog({
  deletePvcTarget,
  setDeletePvcTarget,
  onConfirmDeletePvc,
}: DeletePvcDialogProps) {
  return (
    <Dialog.Root
      open={deletePvcTarget !== null}
      onOpenChange={(open) => {
        if (!open) {
          setDeletePvcTarget(null);
        }
      }}
    >
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 min-h-dvh bg-black/40 transition-opacity data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 supports-[-webkit-touch-callout:none]:absolute" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 w-[min(100vw-2rem,26rem)] -translate-x-1/2 -translate-y-1/2 rounded-lg border border-zinc-200 bg-white p-5 text-zinc-900 shadow-lg outline-none transition-[opacity,transform] data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100">
          <Dialog.Title className="text-base font-semibold">
            删除 user-data 卷？
          </Dialog.Title>
          <Dialog.Description className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            {deletePvcTarget ? (
              <>
                将永久删除 PVC{" "}
                <span className="font-mono">
                  {deletePvcTarget.namespace}/{deletePvcTarget.name}
                </span>
                。若仍有 Pod 挂载，删除可能失败或被推迟。
              </>
            ) : null}
          </Dialog.Description>
          <div className="mt-5 flex justify-end gap-2">
            <Dialog.Close className={btnClass}>取消</Dialog.Close>
            <Button className={btnDanger} onClick={onConfirmDeletePvc}>
              确认删除
            </Button>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
