export type ShortArg = `-${string}=${string}`;

export type LongArg = `--${string}=${string}`;

export function parseFlags(args: Record<string, any>): Array<ShortArg | LongArg> {
  return Object.entries(args).map(([key, value]): ShortArg | LongArg => {
    return key.length === 1 ? `-${key}=${value}` : `--${key}=${value}`;
  });
}
