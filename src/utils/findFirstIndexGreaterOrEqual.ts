export function findFirstIndexGreaterOrEqual(
  values: number[],
  target: number,
): number {
  let index = 0;

  while (target > values[index]) {
    index += 1;
  }

  return index;
}
