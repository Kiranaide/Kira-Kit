export const EXIT_OK = 0;
export const EXIT_USER = 1;
export const EXIT_REGISTRY = 2;
export const EXIT_CHECKS = 3;

/**
 * Error carrying the kira-kit exit-code contract:
 * 0 ok, 1 user/validation error, 2 network/registry error, 3 check failures.
 * `nextStep` is always printed — errors must tell the user what to do next.
 */
export class CliError extends Error {
  readonly exitCode: number;
  readonly nextStep?: string;

  constructor(message: string, exitCode: number, nextStep?: string) {
    super(message);
    this.name = "CliError";
    this.exitCode = exitCode;
    this.nextStep = nextStep;
  }
}

export class ValidationError extends CliError {
  constructor(message: string, nextStep?: string) {
    super(message, EXIT_USER, nextStep);
    this.name = "ValidationError";
  }
}

export class RegistryError extends CliError {
  constructor(message: string, nextStep?: string) {
    super(message, EXIT_REGISTRY, nextStep);
    this.name = "RegistryError";
  }
}

export class CheckFailureError extends CliError {
  constructor(message: string, nextStep?: string) {
    super(message, EXIT_CHECKS, nextStep);
    this.name = "CheckFailureError";
  }
}

export function printError(error: unknown): number {
  if (error instanceof CliError) {
    console.error(`error: ${error.message}`);
    if (error.nextStep) {
      console.error(`next step: ${error.nextStep}`);
    }
    return error.exitCode;
  }
  const message = error instanceof Error ? error.message : String(error);
  console.error(`error: ${message}`);
  return EXIT_USER;
}
