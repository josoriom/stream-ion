import ImageWorker from "./imageWorker?worker";
import type { RenderedImage } from "./ionImage";

export interface ImageProgress {
  fetched: number;
  total: number;
  memory: number | null;
}

interface DoneMessage {
  id: number;
  type: "done";
  image: RenderedImage;
}

interface ProgressMessage {
  id: number;
  type: "progress";
  fetched: number;
  total: number;
  memory: number | null;
}

interface ErrorMessage {
  id: number;
  type: "error";
  message: string;
}

type WorkerMessage = DoneMessage | ProgressMessage | ErrorMessage;

let worker: Worker | null = null;
let nextId = 1;

function getWorker(): Worker {
  if (!worker) worker = new ImageWorker();
  return worker;
}

export function requestImage(
  url: string,
  mz: number,
  tolerance: number,
  level: number,
  onProgress: (progress: ImageProgress) => void,
): Promise<RenderedImage> {
  const id = nextId++;
  const active = getWorker();
  return new Promise((resolve, reject) => {
    const handle = (event: MessageEvent<WorkerMessage>) => {
      const message = event.data;
      if (message.id !== id) return;
      if (message.type === "progress") {
        onProgress({ fetched: message.fetched, total: message.total, memory: message.memory });
        return;
      }
      active.removeEventListener("message", handle);
      if (message.type === "done") resolve(message.image);
      else reject(new Error(message.message));
    };
    active.addEventListener("message", handle);
    active.postMessage({ id, url, mz, tolerance, level });
  });
}
