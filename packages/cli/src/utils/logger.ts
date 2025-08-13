/**
 * Simple logger utilities for CLI output
 */

const colors = {
  dim: (text: string) => `\x1b[2m${text}\x1b[0m`,
  bold: (text: string) => `\x1b[1m${text}\x1b[0m`,
  cyan: (text: string) => `\x1b[36m${text}\x1b[0m`,
  green: (text: string) => `\x1b[32m${text}\x1b[0m`,
  yellow: (text: string) => `\x1b[33m${text}\x1b[0m`,
  blue: (text: string) => `\x1b[34m${text}\x1b[0m`,
  magenta: (text: string) => `\x1b[35m${text}\x1b[0m`,
};

export const logger = {
  info: (msg: string) => console.log(`ℹ️  ${msg}`),
  success: (msg: string) => console.log(`✅ ${msg}`),
  error: (msg: string) => console.error(`❌ ${msg}`),
  warn: (msg: string) => console.warn(`⚠️  ${msg}`),
  log: (msg: string) => console.log(msg),
  ...colors,
};

/**
 * Handle errors and exit
 */
export function handleError(error: unknown): never {
  logger.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}

/**
 * Require a value or exit with error
 */
export function require(value: unknown, message: string): asserts value {
  if (!value) {
    logger.error(message);
    process.exit(1);
  }
}
