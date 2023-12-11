import run from "aocrunner";

// The engine schematic
const parseInput = (rawInput) => {
  const initialValue = {
    numbers: [],
    symbols: [],
  };

  const lines = rawInput.split("\n");

  const output = lines.reduce((acc, line, currentIndex, array) => {
    const matchNumbers = [...line.matchAll(/\d+/g)];
    const matchSymbols = [...line.matchAll(/[^.\d]/g)];

    matchNumbers.forEach(match => {
      acc.numbers.push({
        number: parseInt(match[0]),
        rowMin: Math.max(0, currentIndex - 1),
        rowMax: Math.min(currentIndex + 1, array.length - 1),
        columnMin: Math.max(0, match.index - 1),
        columnMax: Math.min(match.index + match[0].length, line.length - 1),
      });
    });

    matchSymbols.forEach(match => {
      acc.symbols.push({
        symbol: match[0],
        row: currentIndex,
        column: match.index,
      });
    });

    return acc;
  }, initialValue);

  return output;
};

const part1 = (rawInput) => {
  const input = parseInput(rawInput);

  const isAdjacent = (number) => (symbol) =>
    symbol.row >= number.rowMin && symbol.row <= number.rowMax && symbol.column >= number.columnMin && symbol.column <= number.columnMax;

  return input.numbers.reduce((acc, number) => {
    let isAdjacentToSymbol = input.symbols.some(isAdjacent(number));
    return isAdjacentToSymbol ? acc + number.number : acc;
  }, 0);
};

const part2 = (rawInput) => {
  const input = parseInput(rawInput);

  const possibleGears = input.symbols.filter(symbol => symbol.symbol === '*');

  const isAdjacent = (gear) => (number) =>
    gear.row >= number.rowMin && gear.row <= number.rowMax && gear.column >= number.columnMin && gear.column <= number.columnMax;

  return possibleGears.reduce((acc, gear) => {
    const adjacentSymbols = input.numbers.filter(isAdjacent(gear));
    return adjacentSymbols.length === 2 ? acc + adjacentSymbols[0].number * adjacentSymbols[1].number : acc;
  }, 0);
};

run({
  part1: {
    tests: [
      {
        input: `467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`,
        expected: 4361,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`,
        expected: 467835,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
