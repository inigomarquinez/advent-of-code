import run from "aocrunner";

// input => calibration document
const parseInput = (rawInput) => rawInput;

const part1 = (rawInput) => {
  const input = parseInput(rawInput);
  const lines = input.split("\n");

  const result = lines.reduce((acc, line) => {
    const numbers = line.match(/\d/g);
    return acc + parseInt(numbers[0] + numbers[numbers.length - 1]);
  }, 0);

  return result;
};

const part2 = (rawInput) => {
  const input = parseInput(rawInput);
  const lines = input.split("\n");

  const VALID_NUMBERS = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
  const VALID_NUMBERS_CONVERSION = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

  const validNumbersRegex = new RegExp(VALID_NUMBERS.join('|').concat('|\\d'), 'g');

  const result = lines.reduce((acc, line) => {
    const numbers = line.match(validNumbersRegex);

    const parsedNumbers = numbers.map((number) => {
      if (VALID_NUMBERS.includes(number)) {
        return VALID_NUMBERS_CONVERSION[VALID_NUMBERS.indexOf(number)];
      }
      return number;
    });

    console.log(parsedNumbers[0], parsedNumbers[parsedNumbers.length - 1]);
    return acc + parseInt(parsedNumbers[0] + parsedNumbers[parsedNumbers.length - 1]);
  }, 0);

  return result;
};

run({
  part1: {
    tests: [
      {
        input: `1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet`,
        expected: 142,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen`,
        expected: 281,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
