import run from "aocrunner";
import debug from 'debug';

const log1 = debug('day08-part1');
const log2 = debug('day08-part2');

const START = 'AAA';
const END = 'ZZZ';

// documents about how to navigate the desert
const parseInput = (rawInput) => {
  const lines = rawInput.split("\n");

  const network = lines.slice(2).reduce((acc, value) => {
    const match = value.match(/^(?<id>.{3}) = \((?<L>.{3}), (?<R>.{3})\)$/);
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
  log1('input :>> ', input);

  let exitFound = false;
  let steps = 0;
  let currentNodeId = START;

  while (!exitFound) {
    log1('currentNodeId :>> ', currentNodeId);
    const currentNodeNetwork = input.network[currentNodeId];
    log1('currentNodeNetwork :>> ', currentNodeNetwork);
    const nextStep = input.sequence[steps % input.sequence.length];
    log1('nextStep :>> ', nextStep);
    const nextNodeId = currentNodeNetwork[nextStep];
    log1('nextNodeId :>> ', nextNodeId);
    steps++;

    if (nextNodeId === END) exitFound = true;
    else currentNodeId = nextNodeId;
  }

  return steps;
};

const GHOST_START = 'A';
const GHOST_END = 'Z';

const decomposeIntoPrimeFactors = (number) => {
  if (number === 1) return [{ divisor: 1, times: 1 }];

  let primeNumbers = [];
  let divisionResult = number;
  let currentDivisor = 2;

  while (divisionResult !== 1) {
    if (divisionResult % currentDivisor === 0) {
      const divisorIndex = primeNumbers.findIndex((primeNumber) => primeNumber.divisor === currentDivisor);

      if (divisorIndex === -1) primeNumbers.push({ divisor: currentDivisor, times: 1 });
      else primeNumbers[divisorIndex] = { divisor: currentDivisor, times: primeNumbers[divisorIndex].times + 1 };

      divisionResult = divisionResult / currentDivisor;
    } else {
      currentDivisor++;
    }
  }

  return primeNumbers;
}

const leastCommonMultiple = (numbers) => {
  const primeFactors = numbers.map((number) => ({ number, primeFactors: decomposeIntoPrimeFactors(number) }));

  const factors = primeFactors.reduce((acc, currentValue) => {
    const primeFactors = currentValue.primeFactors;
    primeFactors.forEach((primeFactor) => {
      const primeFactorIndex = acc.findIndex(value => value.divisor === primeFactor.divisor);
      if (primeFactorIndex === -1) acc.push(primeFactor);
      else {
        if (acc[primeFactorIndex].times < primeFactor.times) {
          acc[primeFactorIndex].times = primeFactor.times;
        }
      }
    });

    return acc;
  }, []);

  return factors.reduce((acc, currentValue) => acc * Math.pow(currentValue.divisor, currentValue.times), 1);
}

const part2 = (rawInput) => {
  const input = parseInput(rawInput);
  log2('input :>> ', input);

  let exitFound = false;
  let currentNodeId = Object.keys(input.network).filter((id) => id.endsWith(GHOST_START));
  let ghostSteps = Array(currentNodeId.length).fill(null);
  let steps = 0;

  // We'll exit once every ghost has found the exit
  while (!exitFound) {
    log2('currentNodeId :>> ', currentNodeId);
    const currentNodeNetwork = currentNodeId.map(value => input.network[value]);
    log2('currentNodeNetwork :>> ', currentNodeNetwork);
    const nextStep = input.sequence[steps % input.sequence.length];
    log2('nextStep :>> ', nextStep);
    const nextNodeId = currentNodeNetwork.map(value => value[nextStep]);
    log2('nextNodeId :>> ', nextNodeId);
    steps++;

    nextNodeId.forEach((value, index) => {
      if (ghostSteps[index] === null && value.endsWith(GHOST_END)) {
        ghostSteps[index] = steps;
      }
    });

    if (ghostSteps.every(value => value !== null)) exitFound = true;
    else currentNodeId = nextNodeId;
  }

  // Now we calculate the LCM of the ghost steps
  log2('ghostSteps :>> ', ghostSteps);
  return leastCommonMultiple(ghostSteps);
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
      {
        input: `LR

11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX)`,
        expected: 6,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
