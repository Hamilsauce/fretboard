import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';

const { TwoWayMap, date, array, utils, text } = ham;

export const SUIT_RANK_LOOKUP = new TwoWayMap([
  [0, 'diamond', ],
  [1, 'heart', ],
  [2, 'club', ],
  [4, 'spade', ],
]);

export const SUITS_MAP = new Map([
  ['diamond', { name: 'diamond', ascii: '&diams;', rank: 0 }],
  ['heart', { name: 'heart', ascii: '&hearts;', rank: 1 }],
  ['club', { name: 'club', ascii: '&clubs;', rank: 2 }],
  ['spade', { name: 'spade', ascii: '&spades;', rank: 3 }],
]);

export const SUITS = [...SUITS_MAP.values()];

export const CARD_TYPES = [
  {
    rank: 0,
    type: 'pip',
    value: '2',
  },
  {
    rank: 1,
    type: 'pip',
    value: '3',
  },
  {
    rank: 2,
    type: 'pip',
    value: '4',
  },
  {
    rank: 3,
    type: 'pip',
    value: '5',
  },
  {
    rank: 4,
    type: 'pip',
    value: '6',
  },
  {
    rank: 5,
    type: 'pip',
    value: '7',
  },
  {
    rank: 6,
    type: 'pip',
    value: '8',
  },
  {
    rank: 7,
    type: 'pip',
    value: '9',
  },
  {
    rank: 8,
    type: 'pip',
    value: '10',
  },
  {
    rank: 9,
    type: 'face',
    value: 'jack',
  },
  {
    rank: 10,
    type: 'face',
    value: 'queen',
  },
  {
    rank: 11,
    type: 'face',
    value: 'king',
  },
  {
    rank: 12,
    type: 'pip',
    value: 'ace',
  },
]

export const HANDS = [
  {
    rank: 0,
    name: 'High Card',
  },
  {
    rank: 1,
    name: 'One Pair',
  },
  {
    rank: 2,
    name: 'Two Pair',
  },
  {
    rank: 3,
    name: 'Three of a Kind',
  },
  {
    rank: 4,
    name: 'Straight',
  },
  {
    rank: 5,
    name: 'Flush',
  },
  {
    rank: 6,
    name: 'Full House',
  },
  {
    rank: 7,
    name: 'Four of a Kind',
  },
  {
    rank: 8,
    name: 'Straight-Flush',
  }
];
