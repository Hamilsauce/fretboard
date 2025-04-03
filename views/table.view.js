import { View } from './view.js';

export class TableView extends View {
  #self;
  #name;

  constructor() {
    super('table');
  };

  dealCards(options) {
    const deck = new Array(52)
      .fill(0)
      .map((_, i) => ++i)
      .reduce((cards, el, i) => {
        const c = document.createElement('div');

        c.classList.add('card');
        c.innerHTML = '&diams;';

        cards.append(c);

        return cards;
      }, new DocumentFragment());

    this.append(deck);
  }
};