import run from "aocrunner";

// You play several games and record the information from each game (your puzzle input).
// Each game is listed with its ID number (like the 11 in Game 11: ...) followed by a semicolon-separated list of
// subsets of cubes that were revealed from the bag (like 3 red, 5 green, 4 blue).
const parseInput = (rawInput) => {
  const lines = rawInput.split("\n");

  return lines.map(line => {
    const [gameId, subsets] = line.split(":");
    const gameMatch = gameId.match(/Game (?<gameId>\d*)/);

    return {
      id: parseInt(gameMatch.groups.gameId),
      subsets: subsets.trim().split(";").map((subset) => {
        const cubes = subset.trim().split(",");

        return cubes.map((cube) => {
          const [count, color] = cube.trim().split(" ");
          return {
            color,
            count: parseInt(count),
          };
        });
      }),
    };
  });
};

// Determine which games would have been possible if the bag had been loaded with only
// 12 red cubes, 13 green cubes, and 14 blue cubes.
// What is the sum of the IDs of those games?
const part1 = (rawInput) => {
  const input = parseInput(rawInput);

  const MAX = {
    RED: { color: 'red', count: 12 },
    GREEN: { color: 'green', count: 13 },
    BLUE: { color: 'blue', count: 14 },
  }

  const result = input.reduce((acc, game) => {
    let isValid = true;
    let index = 0;

    while (isValid && index < game.subsets.length) {
      let subset = game.subsets[index];
      subset.forEach((cubes) => {
        if (cubes.color === MAX.RED.color && cubes.count > MAX.RED.count) {
          isValid = false;
        }
        if (cubes.color === MAX.GREEN.color && cubes.count > MAX.GREEN.count) {
          isValid = false;
        }
        if (cubes.color === MAX.BLUE.color && cubes.count > MAX.BLUE.count) {
          isValid = false;
        }
      });
      index++;
    }

    return isValid ? acc + game.id : acc;
  }, 0);

  return result;
};


const part2 = (rawInput) => {
  const input = parseInput(rawInput);

  const result = input.reduce((acc, game) => {
    const min = {
      red: 0,
      green: 0,
      blue: 0,
    };

    game.subsets.forEach((subset) => {
      subset.forEach((cubes) => {
        min[cubes.color] = Math.max(min[cubes.color], cubes.count);
      });
    });

    return acc + (min.red * min.green * min.blue);
  }, 0);

  return result;
};

run({
  part1: {
    tests: [
      {
        input: `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`,
        expected: 8,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`,
        expected: 2286,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
