import run from "aocrunner";
import debug from 'debug';

const log1 = debug('part1');
const log2 = debug('part2');

// The OASIS produces a report of many values and how they are changing over time.
const parseInput = (rawInput) => {
  const lines = rawInput.split("\n");
  return lines.map((value => value.split(' ').map((value) => parseInt(value))));
};

const calculateDiffSequence = (history) => {
  let diffSequenceArray = [[...history]];
  let currentDiffIndex = 0;

  while (!diffSequenceArray[currentDiffIndex].every(value => value === 0)) {
    const diff = diffSequenceArray[currentDiffIndex].reduce((acc, value, index, array) => {
      if (index === 0) {
        return acc;
      }
      return [...acc, value - array[index - 1]];
    }, []);

    diffSequenceArray.push(diff);
    currentDiffIndex++;
  }

  return diffSequenceArray;
}

const part1 = (rawInput) => {
  const input = parseInput(rawInput);
  log1('input :>> ', input);

  return input.reduce((acc, history, index) => {
    const diffSequenceArray = calculateDiffSequence(history);
    log1(`diffSequenceArray for history ${index} :>> `, diffSequenceArray);

    const extrapolatedValue = diffSequenceArray.toReversed().reduce((acc, diffSequence, index, array) =>
      index === 0 ? acc : acc + diffSequence.toReversed()[0]
    , 0);

    log1(`extrapolated value for history ${index} :>> `, extrapolatedValue);

    return acc + extrapolatedValue;
  }, 0);
};

const part2 = (rawInput) => {
  const input = parseInput(rawInput);
  log2('input :>> ', input);

  return input.reduce((acc, history, index) => {
    const diffSequenceArray = calculateDiffSequence(history);
    log2(`diffSequenceArray for history ${index} :>> `, diffSequenceArray);

    const extrapolatedValue = diffSequenceArray.toReversed().reduce((acc, diffSequence, index, array) =>
      index === 0 ? acc : diffSequence[0] - acc
      , 0);

    log2(`extrapolated value for history ${index} :>> `, extrapolatedValue);

    return acc + extrapolatedValue;
  }, 0);
};

run({
  part1: {
    tests: [
      {
        input: `0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45`,
        expected: 114,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45`,
        expected: 2,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
