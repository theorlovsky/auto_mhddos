import { Observable } from 'rxjs';
import { Worker } from 'worker_threads';

export function fromWorker<T, R>(workerFactory: () => Worker, workerData: T): Observable<R> {
  return new Observable<R>((subscriber) => {
    const worker = workerFactory();

    worker.on('message', (message) => {
      subscriber.next(message);
    });

    worker.on('error', (error) => {
      subscriber.error(error);
    });

    worker.on('exit', (exitCode) => {
      if (exitCode !== 0) {
        subscriber.error(new Error(`Worker exited with code ${exitCode}`));
      }

      subscriber.complete();
    });

    worker.postMessage(workerData);

    return async () => {
      await worker.terminate();
    };
  });
}
