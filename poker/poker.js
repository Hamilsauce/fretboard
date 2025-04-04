import { getDeck } from './model/deck.model.js';
import { printArrayObjectProps } from './utils.js'
import { SUITS } from './data/constants.js';
import { TableView } from './view/table.view.js';
import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
// import { EventEmitter } from 'https://hamilsauce.github.io/event-emitter.js';
import { CardView } from './view/card.view.js';

const { template, download, utils, timer } = ham;

export const dom = {
  get app() { return document.querySelector('#app'); },
  get appBody() { return document.querySelector('#app-body'); },
  get table() { return document.querySelector('#table'); },
  get drawButton() { return document.querySelector('#draw-button'); },
  get actions() {
    return {
      get deal() { return document.querySelector('#draw-button'); },
      get draw() { return document.querySelector('#draw-button'); },
    }
  }
}

const app = document.querySelector('#app');
const appBody = document.querySelector('#app-body')
const containers = document.querySelectorAll('.container')
const table = document.querySelector('#table');
const drawButton = document.querySelector('#draw-button');

export class Game {
  #self;
  #name;
  
  #model = {
    deck: null,
  };
  
  #view = {
    shell: null,
    menu: null,
    actions: null,
    table: null,
  };
  
  constructor(name, tableView, deckModel) {
    if (tableView && deckModel) this.initialize(tableView, deckModel);
    if (tableView) {
      this.bindToDom(tableView)
    }
    this.extend('dom', dom)
    
    // console.warn('GAME AFTER EXTENDED', this)
  };
  
  get view() { return this.#view }
  
  get model() { return this.#model }
  
  get self() { return this.#self };
  
  get name() { return this.#name };
  
  extend(key, extension = {}) {
    Object.assign(this, {
      [key]: extension
    })
    // Object.entries(extension).forEach(([k, v], i) => {
    //     this[k] = v;
    //   });
  }
  
  initialize(view = new TableView(), model = getDeck(true)) {
    this.view.table = view;
    this.model.deck = model;
  }
  
  bindToDom(component) {
    const el = document.querySelector(`[data-component=${component.name}]`);
    console.log('el', el)
    console.log('component.name', component.name)
    if (el) {
      el.replaceWith(component.dom)
    }
    
    return component.dom
  }
  
  
  // static #getTemplate(name) {
  //   return template(name);
  // }
};


const state = {
  drawnCards: [],
  deck: getDeck(true)
}


const tableView = new TableView();
const deckModel = getDeck(false);
const game = new Game('poker', tableView, deckModel);

const cardsState = deckModel.getState().cards;
const drawnState = deckModel.getState().drawn;





tableView.dealCards();

// const top1 = state.deck.peek(1)

// printArrayObjectProps('Top 1 BEFORE Place On Top', top1, 'modelId')

// state.deck.placeOnTop(...state.deck.peek(10))

// const top2 = state.deck.peek(1)

// printArrayObjectProps('Top 2 AFTER Place On Top', top2, 'modelId')

drawButton.addEventListener('click', e => {
  state.drawnCards = [...state.drawnCards, ...state.deck.draw(5)]
});