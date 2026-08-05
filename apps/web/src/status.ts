export function createRuntimeStatus(componentCount: number): string {
  if (!Number.isInteger(componentCount) || componentCount < 1) {
    throw new RangeError("componentCount must be a positive integer");
  }

  return `${componentCount} repository components validated`;
}
