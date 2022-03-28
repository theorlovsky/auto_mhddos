export function parseFlags(args: Record<string, any>): string[] {
  return Object.entries(args)
    .map(([key, value]) => {
      return (key.length === 1 ? `-${key}=${value}` : `--${key}=${value}`)
        .replace(/(=true|.*=false|.*=undefined)/, '')
        .trim();
    })
    .filter(Boolean);
}
