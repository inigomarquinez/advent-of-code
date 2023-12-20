import run from "aocrunner";
import debug from 'debug';

const log1 = debug('part1');
const log2 = debug('part2');

// condition records of which springs are damaged
const parseInput = (rawInput) => {
  const lines = rawInput.split("\n");
  const records = lines.map((value, index, array) => {
    const [springs, groups] = value.split(' ');

    return {
      springs,
      groups: groups.split(',').map(value => parseInt(value))
    };
  });

  return records;
};

const part1 = (rawInput) => {
  const input = parseInput(rawInput);
  log1(input);

  return input.reduce((acc, currentValue) => {
    const { springs, groups } = currentValue;
    return acc;
  }, 0);
};

const part2 = (rawInput) => {
  const input = parseInput(rawInput);
  log2(input);

  return;
};

run({
  part1: {
    tests: [
      {
        input: `???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1`,
        expected: 21,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      // {
      //   input: ``,
      //   expected: "",
      // },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: true,
});
