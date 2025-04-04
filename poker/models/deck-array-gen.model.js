import { Model } from './model.js';
import { CardModel } from './card.model.js';
import { SUITS, CARD_TYPES } from '../data/constants.js';
import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';

const { utils, array } = ham;

const cardValues = [...CARD_TYPES];
const suits = [...SUITS];

class DeckModel extends Model {
  #cards = [];
  #top = null;
  #bottom = null;
  #size = 0;
  #count = 0;

  constructor(shuffle = true) {
    super('deck');
    this.head = DeckModel.#createCardList(shuffle);
    this._cards = DeckModel.#createCards2()
  }

  // get id() { return this.#id };

  get isEmpty() { return this.count === 0 };

  get canDraw() { return !this.isEmpty };

  createCard() {}

  setDeck() {}

  static #createCardList(shuffle = true) {
    const cards = DeckModel.#createCards2()
    this._cards = cards

    return cards.reduceRight((next, card, i) => {
      // if (next === null) {
      //   return CardModel.create(cardValue, suit);
      // }
      // this.#size = this.#size + 1;
      return {
        card, //CardModel.create(cardValue, suit),
        next: next.card,
      }
      // [
      // ...cards,
      // ...suits.map((suit, suitId) => CardModel.create(cardValue, suit))
      // ]

    }, { card: null, next: null })
    // cardValues.reduce((cards, cardValue, i) => [
    //   ...cards,
    //   ...suits.map((suit, suitId) => CardModel.create(cardValue, suit))
    // ], []))

    // cards.forEach((card, i) => {


    // });
  }

  static #createCards2(shuffle = true) {
    return shuffle === true ?
      utils.shuffle(cardValues.reduce((cards, cardValue) => [
        ...cards,
        ...suits.map((suit, suitId) => CardModel.create(cardValue, suit))
        ], [])) :
      cardValues.reduce((cards, cardValue, i) => [
        ...cards,
        ...suits.map((suit, suitId) => CardModel.create(cardValue, suit))
      ], []);
  }

  * cardGenerator() {
    while (this._cards.length > 0) {
      // Draw new card
      const card = this._cards.shift();

      yield {
        card: card,
        remaining: this._cards.length,
      };
    }
  }

  initEnqueuer(cards) {
    return () => {
      let index = 0
      const _cards = cards;

      return {
        value: _cards[index],
        next: _cards[++index],
        remaining: _cards.length - index
      }
    }
  }

  buildQueue(cards) {
    const createQueueItem = this.initEnqueuer(cards)

    let curr = createQueueItem()

    while (curr && cnt < cards.length) {
      ++cnt
      curr = createQueueItem()
    }

    return curr;
  }

  * cardGenerator2() {
    let c = this.buildQueue(this._cards);

    while (c) {
      yield {
        card: c.value,
        remaining: c.remaining
      }
console.log('c', c)
      c = c.next;
    }
  }

  enqueue() {}

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

  move(card, index) {}

  // draw(numberOfCards = 1) {
  //   if (!numberOfCards) return;

  //   numberOfCards = numberOfCards > this.count ? this.count : numberOfCards;

  //   const drawnCards = this.#cards.slice(0, numberOfCards);

  //   this.#drawn = [...this.#drawn, ...drawnCards];

  //   this.#cards = this.#cards.filter(_ => !this.#drawn.includes(_));

  //   return drawnCards;
  // }

  peek(numberOfCards = 1) {
    return this.#cards
      .slice(0, numberOfCards)
      .map(card => ({ ...card }));
  }

  // toJSON() {
  //   return {
  //     id: this.#id,
  //     cards: this.#cards.map(_ => _),
  //     drawnCards: this.#drawn.map(_ => _),
  //     size: this.#size,
  //   }
  // }
};

export const getDeck = (shuffle = true) => {
  return new DeckModel(shuffle);
};