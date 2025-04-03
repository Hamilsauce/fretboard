import { View } from './view.js';

export class CardView extends View {
  #suit = { name: '', ascii: '', rank: 0 }
  #rank = 0;
  #type = '';
  #value = '';

  constructor({ suit, rank, type, value }) {
    super('card');

    this.#suit = suit;
    this.#rank = rank;
    this.#type = type;
    this.#value = value;

    // const template = View.getTemplate(this.#template());
    // this.self = template;
    // console.log('template', template)
  }

  get suitName() { return this.#suit.name };

  get suitRank() { return this.#suit.rank };

  get suitSymbol() { return this.#suit.ascii };

  get rank() { return this.#rank };

  get type() { return this.#type };

  get value() { return this.#value };

  render() {
    return this.self;
  }

  #template() {

    return `
      <div id="${this.id}" class="${this.name}" data-suit="${this.suitName}" data-value="${this.value}">
        <div class="card-column left">
          <div class="card-left-top corner">${this.suitSymbol}</div>
          <div class="card-left-bottom corner">${this.value}</div>
        </div>
        <div class="card-column center">
          <div class="card-center-content">${this.createContent()}</div>
        </div>
        <div class="card-column right">
          <div class="card-right-top corner">${this.value}</div>
          <div class="card-right-bottom corner">${this.suitSymbol}</div>
        </div>
      </div>
    `;
  }

  createContent() {
    if (this.type === 'pip' && this.value !== 'ace') {
      return new Array(+this.value).fill(`<div class="card-content-symbol">${this.suitSymbol}</div>`).join('\n')

    }
    else return `<div class="card-content-symbol">${this.suitSymbol}</div>`
  }
}