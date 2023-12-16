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

const part1 = (rawInput) => {
  const input = parseInput(rawInput);
  log1('input :>> ', input);

  const loop = [];

  const initialPipe = getStartingPoint(input);
  log1('initialPipe :>> ', initialPipe);
  loop.push(initialPipe);
  log1('loop :>> ', loop);

  let connectedPipes = getConnectedPipes(input, initialPipe.row, initialPipe.col);
  log1('connectedPipes :>> ', connectedPipes);

  let previousPipe = initialPipe;
  let currentPipe = connectedPipes[0];

  while (!isSamePosition(currentPipe, initialPipe)) {
    log1('previousPipe :>> ', previousPipe);
    log1('currentPipe :>> ', currentPipe);
    connectedPipes = getConnectedPipes(input, currentPipe.row, currentPipe.col);
    log1('connectedPipes :>> ', connectedPipes);
    const nextPipeInLoop = connectedPipes.filter(pipe => !isSamePosition(pipe, previousPipe))[0];
    log1('nextPipeInLoop :>> ', nextPipeInLoop);
    loop.push(currentPipe);
    log1('loop :>> ', loop);
    previousPipe = currentPipe;
    currentPipe = nextPipeInLoop;
  }

  return loop.length / 2;
};

const part2 = (rawInput) => {
  const input = parseInput(rawInput);

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
