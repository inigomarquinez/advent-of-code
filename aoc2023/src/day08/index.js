import run from "aocrunner";
import debug from 'debug';

const log = debug('day08');

const START = 'AAA';
const END = 'ZZZ';

// documents about how to navigate the desert
const parseInput = (rawInput) => {
  const lines = rawInput.split("\n");

  const network = lines.slice(2).reduce((acc, value) => {
    const match = value.match(/^(?<id>[A-Z]{3}) = \((?<L>[A-Z]{3}), (?<R>[A-Z]{3})\)$/);
    return {
      ...acc,
      [match.groups.id]: {
        L: match.groups.L,
        R: match.groups.R,
      }
    }
  }, {});

  return {
    sequence: lines[0].split(''),
    network
  };
};

const part1 = (rawInput) => {
  const input = parseInput(rawInput);
  log('input :>> ', input);

  let exitFound = false;
  let steps = 0;
  let currentNodeId = START;

  while (!exitFound) {
    log('currentNodeId :>> ', currentNodeId);
    const currentNodeNetwork = input.network[currentNodeId];
    log('currentNodeNetwork :>> ', currentNodeNetwork);
    const nextStep = input.sequence[steps % input.sequence.length];
    log('nextStep :>> ', nextStep);
    const nextNodeId = currentNodeNetwork[nextStep];
    log('nextNodeId :>> ', nextNodeId);
    steps++;

    if (nextNodeId === END) exitFound = true;
    else currentNodeId = nextNodeId;
  }

  return steps;
};

const part2 = (rawInput) => {
  const input = parseInput(rawInput);

  return;
};

run({
  part1: {
    tests: [
      {
        input: `RL

AAA = (BBB, CCC)
BBB = (DDD, EEE)
CCC = (ZZZ, GGG)
DDD = (DDD, DDD)
EEE = (EEE, EEE)
GGG = (GGG, GGG)
ZZZ = (ZZZ, ZZZ)`,
        expected: 2,
      },
      {
        input: `LLR

AAA = (BBB, BBB)
BBB = (AAA, ZZZ)
ZZZ = (ZZZ, ZZZ)`,
        expected: 6,
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
  onlyTests: false,
});
