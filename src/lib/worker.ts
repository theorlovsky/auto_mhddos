import { isMainThread, parentPort } from 'worker_threads';
import { $, nothrow } from 'zx';
import { logWithTimePrefix } from './utils/log-with-time-prefix';

if (!isMainThread) {
  parentPort!.on('message', (data) => {
    const { target, flags } = data;

    logWithTimePrefix(`Starting attack on: ${target}`);

    nothrow($`python3 runner.py ${target.split(' ')} ${flags} --debug`);
  });
}
