import run from "aocrunner";
import debug from 'debug';

const log1 = debug('part1');
const log2 = debug('part2');

const ORIENTATION = {
  NORTH: 'NORTH', // TOP
  EAST: 'EAST',   // RIGHT
  SOUTH: 'SOUTH', // BOTTOM
  WEST: 'WEST',   // LEFT
};

// | is a vertical pipe connecting north and south.
// - is a horizontal pipe connecting east and west.
// L is a 90 - degree bend connecting north and east.
// J is a 90 - degree bend connecting north and west.
// 7 is a 90 - degree bend connecting south and west.
// F is a 90 - degree bend connecting south and east.
// .is ground; there is no pipe in this tile.
// S is the starting position of the animal; there is a pipe on this tile, but your sketch doesn't show what shape the pipe has.
const PIPE_TYPE = {
  VERTICAL: '|',
  HORIZONTAL: '-',
  NORTH_EAST: 'L',
  NORTH_WEST: 'J',
  SOUTH_WEST: '7',
  SOUTH_EAST: 'F',
  GROUND: '.',
  STARTING_POINT: 'S',
};

const VALID_CONNECTION = {
  [PIPE_TYPE.VERTICAL]: {
    [ORIENTATION.NORTH]: [PIPE_TYPE.VERTICAL, PIPE_TYPE.SOUTH_EAST, PIPE_TYPE.SOUTH_WEST, PIPE_TYPE.STARTING_POINT],
    [ORIENTATION.EAST]: [],
    [ORIENTATION.SOUTH]: [PIPE_TYPE.VERTICAL, PIPE_TYPE.NORTH_EAST, PIPE_TYPE.NORTH_WEST, PIPE_TYPE.STARTING_POINT],
    [ORIENTATION.WEST]: [],
  },
  [PIPE_TYPE.HORIZONTAL]: {
    [ORIENTATION.NORTH]: [],
    [ORIENTATION.EAST]: [PIPE_TYPE.HORIZONTAL, PIPE_TYPE.NORTH_WEST, PIPE_TYPE.SOUTH_WEST, PIPE_TYPE.STARTING_POINT],
    [ORIENTATION.SOUTH]: [],
    [ORIENTATION.WEST]: [PIPE_TYPE.HORIZONTAL, PIPE_TYPE.NORTH_EAST, PIPE_TYPE.SOUTH_EAST, PIPE_TYPE.STARTING_POINT],
  },
  [PIPE_TYPE.NORTH_EAST]: {
    [ORIENTATION.NORTH]: [PIPE_TYPE.VERTICAL, PIPE_TYPE.SOUTH_WEST, PIPE_TYPE.SOUTH_EAST, PIPE_TYPE.STARTING_POINT],
    [ORIENTATION.EAST]: [PIPE_TYPE.HORIZONTAL, PIPE_TYPE.NORTH_WEST, PIPE_TYPE.SOUTH_WEST, PIPE_TYPE.STARTING_POINT],
    [ORIENTATION.SOUTH]: [],
    [ORIENTATION.WEST]: [],
  },
  [PIPE_TYPE.NORTH_WEST]: {
    [ORIENTATION.NORTH]: [PIPE_TYPE.VERTICAL, PIPE_TYPE.SOUTH_EAST, PIPE_TYPE.SOUTH_WEST, PIPE_TYPE.STARTING_POINT],
    [ORIENTATION.EAST]: [],
    [ORIENTATION.SOUTH]: [],
    [ORIENTATION.WEST]: [PIPE_TYPE.HORIZONTAL, PIPE_TYPE.NORTH_EAST, PIPE_TYPE.SOUTH_EAST, PIPE_TYPE.STARTING_POINT],
  },
  [PIPE_TYPE.SOUTH_WEST]: {
    [ORIENTATION.NORTH]: [],
    [ORIENTATION.EAST]: [],
    [ORIENTATION.SOUTH]: [PIPE_TYPE.VERTICAL, PIPE_TYPE.NORTH_EAST, PIPE_TYPE.NORTH_WEST, PIPE_TYPE.STARTING_POINT],
    [ORIENTATION.WEST]: [PIPE_TYPE.HORIZONTAL, PIPE_TYPE.NORTH_EAST, PIPE_TYPE.SOUTH_EAST, PIPE_TYPE.STARTING_POINT],
  },
  [PIPE_TYPE.SOUTH_EAST]: {
    [ORIENTATION.NORTH]: [],
    [ORIENTATION.EAST]: [PIPE_TYPE.HORIZONTAL, PIPE_TYPE.NORTH_WEST, PIPE_TYPE.SOUTH_WEST, PIPE_TYPE.STARTING_POINT],
    [ORIENTATION.SOUTH]: [PIPE_TYPE.VERTICAL, PIPE_TYPE.NORTH_WEST, PIPE_TYPE.NORTH_EAST, PIPE_TYPE.STARTING_POINT],
    [ORIENTATION.WEST]: [],
  },
  [PIPE_TYPE.GROUND]: {
    [ORIENTATION.NORTH]: [],
    [ORIENTATION.EAST]: [],
    [ORIENTATION.SOUTH]: [],
    [ORIENTATION.WEST]: [],
  },
  [PIPE_TYPE.STARTING_POINT]: {
    [ORIENTATION.NORTH]: [PIPE_TYPE.VERTICAL, PIPE_TYPE.SOUTH_EAST, PIPE_TYPE.SOUTH_WEST],
    [ORIENTATION.EAST]: [PIPE_TYPE.HORIZONTAL, PIPE_TYPE.NORTH_WEST, PIPE_TYPE.SOUTH_WEST],
    [ORIENTATION.SOUTH]: [PIPE_TYPE.VERTICAL, PIPE_TYPE.NORTH_EAST, PIPE_TYPE.NORTH_WEST],
    [ORIENTATION.WEST]: [PIPE_TYPE.HORIZONTAL, PIPE_TYPE.NORTH_EAST, PIPE_TYPE.SOUTH_EAST],
  }
}

// Quick sketch of all of the surface pipes you can see
const parseInput = (rawInput) => {
  const lines = rawInput.split("\n");

  return lines.map(value => value.split(''));
};

const getStartingPoint = (surface) => {
  let row = 0;
  let startingPointPosition = null;

  while (startingPointPosition === null) {
    const found = surface[row].indexOf(PIPE_TYPE.STARTING_POINT);
    if (found !== -1) startingPointPosition = { row, col: found };
    row++;
  }

  return startingPointPosition;
}

const getConnectedPipes = (surface, row, col) => {
  const currentPipe = surface[row][col];
  const northPipePosition = row === 0 ? null : { row: row - 1, col };
  const eastPipePosition = col === surface[row].length - 1 ? null : { row, col: col + 1 };
  const southPipePosition = row === surface.length - 1 ? null : { row: row + 1, col };
  const westPipePosition = col === 0 ? null : { row, col: col - 1 };

  const northPipe = northPipePosition !== null ? surface[northPipePosition.row][northPipePosition.col] : PIPE_TYPE.GROUND;
  const eastPipe = eastPipePosition !== null ?surface[eastPipePosition.row][eastPipePosition.col] : PIPE_TYPE.GROUND;
  const southPipe = southPipePosition !== null ?surface[southPipePosition.row][southPipePosition.col] : PIPE_TYPE.GROUND;
  const westPipe = westPipePosition !== null ?surface[westPipePosition.row][westPipePosition.col] : PIPE_TYPE.GROUND;

  const connectedPipes = [];

  if (VALID_CONNECTION[currentPipe][ORIENTATION.NORTH].includes(northPipe)) {
    connectedPipes.push(northPipePosition);
  }
  if (VALID_CONNECTION[currentPipe][ORIENTATION.EAST].includes(eastPipe)) {
    connectedPipes.push(eastPipePosition);
  }
  if (VALID_CONNECTION[currentPipe][ORIENTATION.SOUTH].includes(southPipe)) {
    connectedPipes.push(southPipePosition);
  }
  if (VALID_CONNECTION[currentPipe][ORIENTATION.WEST].includes(westPipe)) {
    connectedPipes.push(westPipePosition);
  }

  return connectedPipes;
}

const isSamePosition = (pos1, pos2) => pos1.row === pos2.row && pos1.col === pos2.col;

const buildLoop = (surface) => {
  const loop = [];

  const initialPipe = getStartingPoint(surface);
  log1('initialPipe :>> ', initialPipe);
  loop.push(initialPipe);
  log1('loop :>> ', loop);

  let connectedPipes = getConnectedPipes(surface, initialPipe.row, initialPipe.col);
  log1('connectedPipes :>> ', connectedPipes);

  let previousPipe = initialPipe;
  let currentPipe = connectedPipes[0];

  while (!isSamePosition(currentPipe, initialPipe)) {
    log1('previousPipe :>> ', previousPipe);
    log1('currentPipe :>> ', currentPipe);
    connectedPipes = getConnectedPipes(surface, currentPipe.row, currentPipe.col);
    log1('connectedPipes :>> ', connectedPipes);
    const nextPipeInLoop = connectedPipes.filter(pipe => !isSamePosition(pipe, previousPipe))[0];
    log1('nextPipeInLoop :>> ', nextPipeInLoop);
    loop.push(currentPipe);
    log1('loop :>> ', loop);
    previousPipe = currentPipe;
    currentPipe = nextPipeInLoop;
  }

  return loop;
}

const isPipePartOfTheLoop = (loopByRows, row, col) => loopByRows[row] && loopByRows[row].includes(col);

const part1 = (rawInput) => {
  const input = parseInput(rawInput);
  log1('input :>> ', input);

  const loop = buildLoop(input);

  return loop.length / 2;
};

const part2 = (rawInput) => {
  const input = parseInput(rawInput);
  log2('input :>> ', input);

  // const loop = buildLoop(input);
  // log2('loop :>> ', loop);

  // const loopByRows = loop.reduce((acc, pipe) => {
  //   if (!acc[pipe.row]) acc[pipe.row] = [];
  //   acc[pipe.row].push(pipe.col);
  //   acc[pipe.row].sort();
  //   return acc;
  // }, {});
  // log2('loopByRows :>> ', loopByRows);


  // let enclosed = 0;
  // for (let row = 0; row < input.length; row++) {
  //   for (let col = 0; col < input[row].length; col++) {
  //     if (!isPipePartOfTheLoop(loopByRows, row, col)) {
  //       let pipesToTheWest = 0;
  //       let pipesToTheEast = 0;

  //       if (loopByRows[row]) {
  //         pipesToTheWest = loopByRows[row].filter(pipe => {
  //           if (input[row][pipe] === PIPE_TYPE.HORIZONTAL) return false;
  //           return pipe < col;
  //         }).length;
  //         pipesToTheEast = loopByRows[row].length - pipesToTheWest;
  //       }

  //       if ((pipesToTheWest !== 0 && pipesToTheWest % 2 !== 0) &&
  //         (pipesToTheEast !== 0 && pipesToTheEast % 2 !== 0)) {
  //         enclosed++;
  //       }
  //     }
  //   }
  // }

  // return enclosed;
  return;
};

run({
  part1: {
    tests: [
      {
        input: `-L|F7
7S-7|
L|7||
-L-J|
L|-JF`,
        expected: 4,
      },
      {
        input: `7-F7-
.FJ|7
SJLL7
|F--J
LJ.LJ`,
        expected: 8,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `...........
.S-------7.
.|F-----7|.
.||.....||.
.||.....||.
.|L-7.F-J|.
.|..|.|..|.
.L--J.L--J.
...........`,
        expected: 4,
      },
      {
        input: `..........
.S------7.
.|F----7|.
.||....||.
.||....||.
.|L-7F-J|.
.|..||..|.
.L--JL--J.
..........`,
        expected: 4,
      },
      {
        input: `.F----7F7F7F7F-7....
.|F--7||||||||FJ....
.||.FJ||||||||L7....
FJL7L7LJLJ||LJ.L-7..
L--J.L7...LJS7F-7L7.
....F-J..F7FJ|L7L7L7
....L7.F7||L7|.L7L7|
.....|FJLJ|FJ|F7|.LJ
....FJL-7.||.||||...
....L---J.LJ.LJLJ...`,
        expected: 8,
      },
      {
        input: `FF7FSF7F7F7F7F7F---7
L|LJ||||||||||||F--J
FL-7LJLJ||||||LJL-77
F--JF--7||LJLJIF7FJ-
L---JF-JLJIIIIFJLJJ7
|F|F-JF---7IIIL7L|7|
|FFJF7L7F-JF7IIL---7
7-L-JL7||F7|L7F-7F7|
L.L7LFJ|||||FJL7||LJ
L7JLJL-JLJLJL--JLJ.L`,
        expected: 10,
      }
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
