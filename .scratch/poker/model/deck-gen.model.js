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

    // this.#cards = DeckModel.#createCards(shuffle);
    this.head = DeckModel.#createCards2(shuffle);

    console.log('this.head', this.head)
    // this.#size = this.#cards.length;

    // this.getState = this.#getState.bind(this);
  }

  // get id() { return this.#id };

  get isEmpty() { return this.count === 0 };

  get canDraw() { return !this.isEmpty };

  // get count2() { return this.#cards ? this.#cards.length : 0 };

  // get count() { return this.#cards ? this.#cards.length : 0 };

  createCard() {

  }

  setDeck() {

  }

  static #createCardList(shuffle = true) {
    const cards = DeckModel.#createCards2()
    console.warn('cards[0===card[1]', [cards[0].displayName, cards[1].displayName])
    return DeckModel.#createCards2()

      .reduceRight((next, card, i) => {
        // if (next === null) {
        //   return CardModel.create(cardValue, suit);
        // }
        // this.#size = this.#size + 1;
        console.log('card', { id: card.card ? card.card.modelId : null });
        console.log('next', { id: next.card ? next.card.modelId : null });
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
      while (this.cards.length > 0) {
        // Draw new card
        const card = this.cards.shift();

        yield {
          card: card,
          remainingCards: this.cards.length,
        };
      }
    }

  * cardGenerator2() {
    let c = this.head;
    console.log('this',this)
    // yield this.head
    while (c) {

      yield this.head

      this.head = this.head.next
      c = this.head
      console.log('c', c)

      // yield {
      //   card: c,
      //   remainingCards: this.count,
      // }
    }
  }

  enqueue() {

  }

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