import { Model } from './model.js';

import { SUITS, CARD_TYPES } from '../data/constants.js';
import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';

const { utils, array } = ham;

const cardValues = [...CARD_TYPES];

const suits = [...SUITS];

export class CardModel extends Model {
  #suit;
  #card;
  #value = [];
  #drawn = [];
  #size = 0;

  constructor(card, suit) {
    super('card');

    this.#suit = suit;
    this.#card = card;
    this.state = this._state.bind(this);
  }

  static create(cardValue, suit) {
    const c = new CardModel(
      cardValue,
      suit,
    );

    return c;
  }

  get displayName() {
    return `${this.value} of ${this.suitName}s`
  }

  get suitName() {
    return this.#suit.name;
  }

  get suitRank() {
    return this.#suit.rank;
  }

  get ascii() {
    return this.#suit.ascii;
  }

  get value() {
    return this.#card.value;
  }

  get type() {
    return this.#card.type;
  }

  get rank() {
    return this.#card.rank;
  }

  get valueType() {
    return this.#card.type;
  }

  _state() {
    return {
      suit: this.#suit,
      rank: this.rank,
      value: this.value,
      type: this.type,
    }
  }

  toJSON() {
    return {
      displayName: this.displayName,
      suitName: this.suitName,
      suitRank: this.suitRank,
      ascii: this.ascii,
      value: this.value,
      rank: this.rank,
      valueType: this.valueType,
    }
  }
}