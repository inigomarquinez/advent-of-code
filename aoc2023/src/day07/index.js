import run from "aocrunner";

// list of hands and their corresponding bid
const parseInput = (rawInput) => {
  return rawInput.split("\n").reduce((acc, currentValue) => {
    const [cards, bid] = currentValue.split(" ");
    return [...acc, { cards: cards.split(''), bid: parseInt(bid) }];
  }, []);
};

const CARDS_BY_STRENGTH = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];
const HANDS_BY_STRENGTH = [
  'FIVE_OF_A_KIND',
  'FOUR_OF_A_KIND',
  'FULL_HOUSE',
  'THREE_OF_A_KIND',
  'TWO_PAIR',
  'ONE_PAIR',
  'HIGH_CARD',
];

const getHandType = (hand) => {
  const count = CARDS_BY_STRENGTH.map(card => {
    return hand.cards.filter(c => c === card).length;
  });

  if (count.includes(5)) return 'FIVE_OF_A_KIND';
  else if (count.includes(4)) return 'FOUR_OF_A_KIND';
  else if (count.includes(3) && count.includes(2)) return 'FULL_HOUSE';
  else if (count.includes(3)) return 'THREE_OF_A_KIND';
  else if (count.filter(c => c === 2).length === 2) return 'TWO_PAIR';
  else if (count.includes(2)) return 'ONE_PAIR';
  else return 'HIGH_CARD';
}

const sortByHandType = (a, b) => HANDS_BY_STRENGTH.indexOf(a.type) - HANDS_BY_STRENGTH.indexOf(b.type);

const sortByCardsOrder = (a, b) => {
  let index = 0;
  let diff = 0;
  do {
    let aStrength = CARDS_BY_STRENGTH.indexOf(a.cards[index]);
    let bStrength = CARDS_BY_STRENGTH.indexOf(b.cards[index]);
    diff = aStrength - bStrength;
    index++;
  } while (diff === 0 && index < 5);
  return diff;
}

const part1 = (rawInput) => {
  const input = parseInput(rawInput);

  const output = input.map(hand => ({ ...hand, type: getHandType(hand) }));

  // Sort by decreasing strength
  output.sort((a, b) => {
    const diff = sortByHandType(a, b);
    if (diff !== 0) return HANDS_BY_STRENGTH.indexOf(a.type) - HANDS_BY_STRENGTH.indexOf(b.type);
    else return sortByCardsOrder(a, b);
  });

  return output.reduce((acc, currentValue, index, array) => {
    return acc + (currentValue.bid * (array.length - index));
  }, 0);
};

const CARDS_BY_STRENGTH_WITH_JOKER = ['A', 'K', 'Q', 'T', '9', '8', '7', '6', '5', '4', '3', '2', 'J'];

const getHandTypeWithJoker = (hand) => {
  const count = CARDS_BY_STRENGTH_WITH_JOKER.map(card => {
    return hand.cards.filter(c => c === card).length;
  });

  // Add jokers to the card with the highest count except if it's a joker, then add it to the second highest count
  const numberOfJokers = hand.cards.filter(c => c === 'J').length;
  const indexOfJokerInRank = CARDS_BY_STRENGTH_WITH_JOKER.indexOf('J');
  let maxIndex = count.findIndex(c => c === Math.max(...count));
  if (maxIndex === indexOfJokerInRank) {
    const countWithoutJoker = count.filter((c, index) => index !== indexOfJokerInRank);
    maxIndex = count.findIndex(c => c === Math.max(...countWithoutJoker));
  }
  count[maxIndex] += numberOfJokers;
  count[indexOfJokerInRank] -= numberOfJokers;

  if (count.includes(5)) return 'FIVE_OF_A_KIND';
  else if (count.includes(4)) return 'FOUR_OF_A_KIND';
  else if (count.includes(3) && count.includes(2)) return 'FULL_HOUSE';
  else if (count.includes(3)) return 'THREE_OF_A_KIND';
  else if (count.filter(c => c === 2).length === 2) return 'TWO_PAIR';
  else if (count.includes(2)) return 'ONE_PAIR';
  else return 'HIGH_CARD';
}

const sortByCardsOrderWithJoker = (a, b) => {
  let index = 0;
  let diff = 0;
  do {
    let aStrength = CARDS_BY_STRENGTH_WITH_JOKER.indexOf(a.cards[index]);
    let bStrength = CARDS_BY_STRENGTH_WITH_JOKER.indexOf(b.cards[index]);
    diff = aStrength - bStrength;
    index++;
  } while (diff === 0 && index < 5);
  return diff;
}

const part2 = (rawInput) => {
  const input = parseInput(rawInput);

  const output = input.map(hand => ({ ...hand, type: getHandTypeWithJoker(hand) }));

  // Sort by decreasing strength
  output.sort((a, b) => {
    const diff = sortByHandType(a, b);
    if (diff !== 0) return HANDS_BY_STRENGTH.indexOf(a.type) - HANDS_BY_STRENGTH.indexOf(b.type);
    else return sortByCardsOrderWithJoker(a, b);
  });
  // console.log('output :>> ', output);

  return output.reduce((acc, currentValue, index, array) => {
    return acc + (currentValue.bid * (array.length - index));
  }, 0);
};

run({
  part1: {
    tests: [
      {
        input: `32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`,
        expected: 6440,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`,
        expected: 5905,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
