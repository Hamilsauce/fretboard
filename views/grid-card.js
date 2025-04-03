import { View } from './view.js';

export class GridCard extends View {
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
    // this.self = this.getTemplateString();
    this.self = View.getTemplateString(this.template());
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

  template() {
    return `
      <div id="${this.id}" class="${this.name} grid-card" data-suit="${this.suitName}" data-value="${this.value}">
        ${
          new Array(25).fill(null).reduce((template, _, i)=> `${template}\n<div class="card-cell" data-cell-index="${i}"></div>`,'')
        }
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