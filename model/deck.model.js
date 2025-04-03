import { Model } from './model.js';

import { SUITS, CARD_TYPES } from '../data/constants.js';
import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
const { utils, array } = ham;
console.log('array', array)
const cardValues = [...CARD_TYPES];

const suits = [...SUITS];

class DeckModel {
  #id;
  #cards = [];
  #drawn = [];
  #size = 0;

  constructor(shuffle = true) {
    this.#id = 'd' + utils.uuid();
    this.#cards = DeckModel.#createCards(shuffle);
    this.#size = this.#cards.length;

    this.getState = this.#getState.bind(this);
  };

  get id() { return this.#id };
  
  get cards() { return this.#cards };
  
  get drawn() { return this.#drawn };

  get size() { return this.#size };

  get isEmpty() { return this.count === 0 };

  get canDraw() { return !this.isEmpty };

  get count() { return this.#cards ? this.#cards.length : 0 };

  get countOfDrawn() { return this.#cards ? this.#cards.length : 0 };

  static #createCards(shuffle = true) {
    return shuffle === true ?
      utils.shuffle(cardValues.reduce((acc, curr, i) => [
        ...acc,
        ...suits.map((suit, suitId) => ({
          ...curr,
          suit,
          suitId,
          modelId: 'c' + utils.uuid(),
          name: `${curr.value} of ${suit}s`
        }))
        ], [])) :
      cardValues.reduce((acc, curr, i) => [
        ...acc,
        ...suits.map((suit, suitId) => ({
          ...curr,
          suit,
          suitId,
          modelId: 'c' + utils.uuid(),
          name: `${curr.value} of ${suit}s`
        }))
      ], []);
  }

  #getState() {
    const c = this.#cards
    const d = this.#drawn
    return {
      get cards() { return c },
      get drawn() { return d },
    }
  }
  
  *cardGenerator() {
    
  }
  

  destroyCards() {
    this.#cards.forEach((c, i) => {
      c = null

    });

  }

  // groupBy(key, innerSort = 'asc') {
  //   const groupKeys = ['suit', 'value', ];
  //   if (!groupKeys.includes(key)) {
  //     console.error(`Invalid group key. Provided key: ${key}`);
  //   }
  //   else {
  //     this.#cards = this.#cards.sort((a, b) => a.suitId - b.suitId)
  //   }

  //   return this;
  // }

  sort(key, dir = 'asc') {
    const sortKeys = ['suit', 'value', ];
    if (!sortKeys.includes(key)) {
      console.error(`Invalid sort key. Provided key: ${key}`);
    }
    else {
      this.#cards = this.#cards.sort((a, b) => a[key] - b[key])
    }

    return this;
  }

  shuffle() {
    this.#cards = utils.shuffle([...this.#cards]);

    return this;
  }

  remove(...cards) {
    this.#cards = [...this.#cards].filter(_ => !cards.includes(_))

    return cards;
  }

  has(card) {
    return this.#cards.includes(card)
  }

  placeOnTop(...cards) {
    this.#cards = [...cards, ...this.#cards.filter(c => !cards.some(_ => _.modelId === c.modelId))]
  }

  placeOnBottom(...cards) {
    this.#cards = [...this.#cards.filter(c => !cards.some(_ => _.modelId === c.modelId)), ...cards];
  }

  at(index = -1) {
    return (index >= 0 && index <= this.count) ? this.#cards[index] : null;
  }

  find(key, value) {
    return this.#cards.filter(_ => _[key] === value);
  }

  move(card, index) {}

  draw(numberOfCards = 1) {
    if (!numberOfCards) return;

    numberOfCards = numberOfCards > this.count ? this.count : numberOfCards;

    const drawnCards = this.#cards.slice(0, numberOfCards);

    this.#drawn = [...this.#drawn, ...drawnCards];

    this.#cards = this.#cards.filter(_ => !this.#drawn.includes(_));

    return drawnCards;
  }

  peek(numberOfCards = 1) {
    return this.#cards
      .slice(0, numberOfCards)
      .map(card => ({ ...card }));
  }

  toJSON() {
    return {
      id: this.#id,
      cards: this.#cards.map(_ => _),
      drawnCards: this.#drawn.map(_ => _),
      size: this.#size,
    }
  }
};

export const getDeck = (shuffle = true) => {
  return new DeckModel(shuffle);
};
