import run from "aocrunner";

// lists the time allowed for each race and also the best distance ever recorded in that race.
const parseInput = (rawInput) => {
  const lines = rawInput.split("\n");
  const times = lines[0].match(/\d+/g);
  const distances = lines[1].match(/\d+/g);

  return {
    times: times.map((time) => parseInt(time)),
    distances: distances.map((distance) => parseInt(distance)),
  }
};

const calculateHoldDownValidRangeLength = (time, distance) => {
  // Distance [D] > HoldDownTime [ht] * (RaceTime [T] - HoldDownTime [ht])
  //  ht = (T +- sqrt(T^2 - 4D)) / 2
  let holdDownTimeMax = (time + Math.sqrt(Math.pow(time, 2) - 4 * distance)) / 2;
  let holdDownTimeMin = (time - Math.sqrt(Math.pow(time, 2) - 4 * distance)) / 2;

  holdDownTimeMax = Math.floor(holdDownTimeMax) === holdDownTimeMax ? Math.floor(holdDownTimeMax) - 1 : Math.floor(holdDownTimeMax);
  holdDownTimeMin = Math.floor(holdDownTimeMin) === holdDownTimeMin ? Math.floor(holdDownTimeMin) + 1 : Math.ceil(holdDownTimeMin);

  return (holdDownTimeMax - holdDownTimeMin + 1);
}

const part1 = (rawInput) => {
  const input = parseInput(rawInput);

  return input.times.reduce((acc, time, currentIndex) => {
    const range = calculateHoldDownValidRangeLength(time, input.distances[currentIndex]);
    return acc * range;
  }, 1);
};

const part2 = (rawInput) => {
  const input = parseInput(rawInput);

  const time = parseInt(input.times.reduce((acc, time) => acc + time.toString(), ''));
  const distance = parseInt(input.distances.reduce((acc, distance) => acc + distance.toString(), ''));
  const range = calculateHoldDownValidRangeLength(time, distance);

  return range;
};

run({
  part1: {
    tests: [
      {
        input: `Time:      7  15   30
Distance:  9  40  200`,
        expected: 288,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `Time:      7  15   30
Distance:  9  40  200`,
        expected: 71503,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
