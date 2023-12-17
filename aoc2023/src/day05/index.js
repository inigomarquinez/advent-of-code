import run from "aocrunner";

const keys = {
  SEED: 'seed',
  SOIL: 'soil',
  FERTILIZER: 'fertilizer',
  WATER: 'water',
  LIGHT: 'light',
  TEMPERATURE: 'temperature',
  HUMIDITY: 'humidity',
  LOCATION: 'location',
};

// The almanac
const parseInput = (rawInput) => {
  const blocks = rawInput.split("\n\n")

  const seeds = blocks[0]
    .split(":")[1]
    .trim()
    .split(/\s+/)
    .map(value => parseInt(value.trim()))
    .sort();

  const maps = blocks
    .slice(1)
    .reduce((acc, block) => {
        const parts = block.split(":");
        const id = parts[0].match(/^(?<source>[^-]*)-to-(?<destination>[^-]*) map$/);

        return [
          ...acc,
          {
            source: id.groups.source,
            destination: id.groups.destination,
            ranges: parts[1]
              .trim()
              .split(/\n/)
              .map(value => value.split(/\s+/).reduce((acc, value, index) => {
                if (index === 0) { return { ...acc, destinationRangeStart: parseInt(value.trim()) } }
                else if (index === 1) { return { ...acc, sourceRangeStart: parseInt(value.trim()) } }
                else { return { ...acc, rangeLength: parseInt(value.trim()) } }
              }, {}))
          }];
      }, []);

  return {
    seeds,
    maps,
  };
};

const part1 = (rawInput) => {
  const input = parseInput(rawInput);

  // Let's calculate the min and max seed value
  const seedToSoilMap = input.maps.find(map => map.source === keys.SEED).ranges;
  const minSeed = Math.min(
    ...input.seeds,
    seedToSoilMap.reduce((acc, range) => Math.min(acc, range.sourceRangeStart), Infinity));
  const maxSeed = Math.max(
    ...input.seeds,
    seedToSoilMap.reduce((acc, range) => Math.max(acc, range.sourceRangeStart + range.rangeLength - 1), 0)
  );

  const seedArray = [...Array(maxSeed + 1).keys()];
  const output = Object.values(keys).reduce((acc, key) => ({ ...acc, [key]: [...seedArray] }), {});

  input.maps.forEach(map => {
    output[map.destination] = [...output[map.source]];
    map.ranges.forEach(range => {
      for (let i = 0; i < range.rangeLength; i++) {
        const index = output[map.source].indexOf(range.sourceRangeStart + i);
        output[map.destination][index] = range.destinationRangeStart + i;
      }
    });
  });

  return input.seeds.reduce((acc, seed) => Math.min(acc, output[keys.LOCATION][seed]), Infinity);
};

const part2 = (rawInput) => {
  const input = parseInput(rawInput);

  return;
};

run({
  part1: {
    tests: [
      {
        input: `seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4`,
        expected: 35,
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
