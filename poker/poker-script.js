import { newDeck } from './model/deck.model.js';

const app = document.querySelector('#app');
const appBody = document.querySelector('#app-body')
const containers = document.querySelectorAll('.container')
const cards = document.querySelectorAll('.card')

export class DeckView {
  constructor() {
    this.self = document.createElement('div');
    this.self.classList.add('deck');

  }



  render(cards) {
    this.self.innerHTML = ''

    cards.forEach((x, i) => {
      this.self.append(this.createCard(x))
    });
    return this.self
  }
  createCard(model) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.textContent = `${model.name}`
    // const card = document.createElement('div');
    return card;
  }



  get cards() { return this.self.querySelectorAll('.card') };
  set prop(newValue) { this._prop = newValue };
}

// const box1 = document.querySelector('#b1')
// const box2 = document.querySelector('#b2')

// const d1 = utils.shuffle(newDeck());
const deck = newDeck();
const deckView = new DeckView();
appBody.innerHTML = '';
appBody.append(deckView.render(deck))
// console.log('d1', d1)


const state = {
  removedElement: null,
}

// boxes.forEach((b, i) => {
//   b.addEventListener('click', e => {
//     e.stopPropagation()
//     if (state.removedElement !== null) return;
//     state.removedElement = b.parentElement.removeChild(b)
//   });
// });

;[...app.children].forEach((c, i) => {
  c.addEventListener('click', e => {
    e.stopPropagation()
    if (+c.style.opacity == 1) {
      c.style.opacity = 0

    } else {
      c.style.opacity = 1

    }
    if (state.removedElement === null) return;
    c.appendChild(state.removedElement)
    state.removedElement = null
  });
});
