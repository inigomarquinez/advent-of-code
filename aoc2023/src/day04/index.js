import run from "aocrunner";

// a list of winning numbers | a list of numbers you have
const parseInput = (rawInput) => {
  const lines = rawInput.split("\n");

  return lines.map(line => {
    const [cardId, subsets] = line.split(":");
    const cardMatch = cardId.match(/Card (?<cardId>\d*)/);
    const lists = subsets.trim().split("|").map((subset) => {
      const numbers = subset.trim().split(/\s+/);
      return numbers.map((number) => parseInt(number.trim()));
    });

    return {
      id: parseInt(cardMatch.groups.cardId),
      winningNumbers: lists[0],
      myNumbers: lists[1],
    };
  });
};

const part1 = (rawInput) => {
  const input = parseInput(rawInput);

  return input.reduce((acc, card) => {
    const matchNumbers = card.myNumbers.filter(number => card.winningNumbers.includes(number));
    return matchNumbers.length > 0 ? acc + Math.pow(2, matchNumbers.length - 1) : acc;
  }, 0);
};

const part2 = (rawInput) => {
  const input = parseInput(rawInput);

  const cards = input.map(card => ({
    id: card.id,
    matchNumbers: card.myNumbers.filter(number => card.winningNumbers.includes(number)).length,
    copies: 1,
  }));

  cards.forEach((card, index, array) => {
    for (let i = index + 1; i < Math.min(index + 1 + card.matchNumbers, array.length); i++) {
      array[i].copies += card.copies;
    }
  });

  return cards.reduce((acc, card) => {
    return acc + card.copies;
  }, 0);
};

run({
  part1: {
    tests: [
      {
        input: `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`,
        expected: 13,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`,
        expected: 30,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
