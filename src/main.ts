import { merge } from 'rxjs';
import { $, argv } from 'zx';
import { Arguments } from './lib/arguments';
import { handleSigInt$ } from './lib/handle-sigint';
import { logExit$ } from './lib/log-exit';
import { startAttacks } from './lib/start-attacks';
import { parseFlags } from './lib/utils/parse-flags';

$.verbose = false;

const { _, parallel, c, config, ...mhddosArgs } = argv as Arguments;

merge(handleSigInt$, logExit$, startAttacks(parallel, parseFlags(mhddosArgs))).subscribe();
