// Returns a fibonacci sequence up to the given maxValue.
export function fibonacciMaxValue(
  maxValue: number,
  exclusive = false,
): number[] {
  const sequence = [0, 1];
  let n2 = 0;
  let n1 = 1;
  while (n1 < maxValue) {
    const prev_n1 = n1;
    n1 = n2 + n1;
    if (exclusive && n1 > maxValue) {
      break;
    }
    n2 = prev_n1;
    sequence.push(n1);
  }
  return sequence;
}

// Returns the nearest number of the given sequence for the given searchValue.
export function nearestValue(
  searchValue: number,
  minValue: number,
  maxValue: number,
  sequence: number[],
): number {
  if (searchValue <= minValue) {
    return minValue;
  }
  if (searchValue >= maxValue) {
    return maxValue;
  }
  if (searchValue > sequence[sequence.length - 1]) {
    return sequence[sequence.length - 1];
  }
  let index = 0;
  let currValue = 0;
  while (index < sequence.length || currValue < searchValue) {
    currValue = sequence[index];
    if (currValue === searchValue) {
      return searchValue;
    }
    index++;
  }
  if (searchValue - sequence[index - 2] > sequence[index - 1] - searchValue) {
    return sequence[index - 1];
  } else {
    return sequence[index - 2];
  }
}
