import run from "aocrunner";
import _groupBy from 'lodash/groupBy.js';

// the two lists up side by side
const parseInput = (rawInput) => {
  const lines = rawInput.split("\n");
  const firstList = [];
  const secondList = [];
  for (const line of lines) {
    const [first, second] = line.split(/\s+/).map(Number);
    firstList.push(first);
    secondList.push(second);
  }

  return { firstList, secondList };
};

const part1 = (rawInput) => {
  const input = parseInput(rawInput);
  const sortedFirstList = input.firstList.toSorted((a, b) => a - b);
  const sortedSecondList = input.secondList.toSorted((a, b) => a - b);
  return sortedFirstList.reduce((acc, curr, index) => acc + Math.abs(curr - sortedSecondList[index]), 0);
};

const part2 = (rawInput) => {
  const input = parseInput(rawInput);
  const groupedBySecondList = _groupBy(input.secondList);
  return input.firstList.reduce((acc, curr) => acc + curr * (groupedBySecondList[curr]?.length ?? 0), 0);
};

run({
  part1: {
    tests: [
      {
        input: `3   4
4   3
2   5
1   3
3   9
3   3`,
        expected: 11,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `3   4
4   3
2   5
1   3
3   9
3   3`,
        expected: 31,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
