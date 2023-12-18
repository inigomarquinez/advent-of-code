import run from "aocrunner";
import debug from 'debug';

import { transpose } from '../utils/index.js';

const log1 = debug('part1');
const log2 = debug('part2');

const OBJECT_TYPE = {
  EMPTY_SPACE: '.',
  GALAXY: '#',
};

// The researcher has collected a bunch of data and compiled the data into a single giant image
const parseInput = (rawInput) => {
  const lines = rawInput.split("\n");
  const image = lines.map(value => value.split(''));
  const transposedImage = transpose(image);

  const rowScan = image.reduce((acc, currentValue, row) => {
    const foundGalaxies = currentValue.join('').matchAll(/#/g);

    const newGalaxies = [];
    for (const galaxy of foundGalaxies) {
      newGalaxies.push({ row, col: galaxy.index });
    }

    if (newGalaxies.length === 0) {
      return {
        ...acc,
        rowsWithoutGalaxies: [...acc.rowsWithoutGalaxies, row],
      };
    }

    return {
      ...acc,
      galaxies: [...acc.galaxies, ...newGalaxies],
    };
  }, {
    galaxies: [],
    rowsWithoutGalaxies: [],
  });

  const colsWithoutGalaxies = transposedImage.reduce((acc, currentValue, index) => {
    if (currentValue.includes(OBJECT_TYPE.GALAXY)) return acc;
    return [...acc, index];
  }, []);

  return {
    image,
    transposedImage,
    galaxies: rowScan.galaxies,
    rowsWithoutGalaxies: rowScan.rowsWithoutGalaxies,
    colsWithoutGalaxies,
  };
};

const part1 = (rawInput) => {
  const input = parseInput(rawInput);
  log1(input);

  const totalShortestDistance =  input.galaxies.reduce((acc, sourceGalaxy, sourceIndex, galaxiesArray) => {
    const shortestPaths = galaxiesArray.reduce((galaxyAcc, destinationGalaxy, destinationIndex) => {
      if (sourceIndex === destinationIndex) return galaxyAcc;

      const expandedRows = input.rowsWithoutGalaxies.filter(row => row > Math.min(sourceGalaxy.row, destinationGalaxy.row) && row < Math.max(sourceGalaxy.row, destinationGalaxy.row));
      const expandedCols = input.colsWithoutGalaxies.filter(col => col > Math.min(sourceGalaxy.col, destinationGalaxy.col) && col < Math.max(sourceGalaxy.col, destinationGalaxy.col));

      const rowDistance = Math.abs(sourceGalaxy.row - destinationGalaxy.row) + expandedRows.length;
      const colDistance = Math.abs(sourceGalaxy.col - destinationGalaxy.col) + expandedCols.length;

      const shortestDistance = rowDistance + colDistance;

      log1(`Shortest path from galaxy [${sourceGalaxy.row}, ${sourceGalaxy.col}] to galaxy [${destinationGalaxy.row}, ${destinationGalaxy.col}] is ${shortestDistance}`);

      return galaxyAcc + shortestDistance;
    }, 0);

    return acc + shortestPaths;
  }, 0);

  // Take into account that we are double counting the paths
  return totalShortestDistance / 2;
};

const part2 = (rawInput) => {
  const input = parseInput(rawInput);

  return;
};

run({
  part1: {
    tests: [
      {
        input: `...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....`,
        expected: 374,
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
