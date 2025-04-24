import { EventEmitter } from 'https://hamilsauce.github.io/hamhelper/event-emitter.js';
import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
import { GridView } from './view/grid.view.js';
const { template, utils, DOM } = ham;

export class View extends EventEmitter {
  #self;
  #name;
  #grid;

  constructor(gridView) {
    super();

    this.#name = 'ui';
    this.#grid = new GridView('grid');

    // this.#self = View.#getTemplate(name);
    this.#self = document.querySelector('#app');
  };

  get self() { return this.#self };

  get name() { return this.#name };

  get grid() {
    return this.#grid;
  }

  get overlay() {
    return document.querySelector('.overlay');
  }

  get actor() {
    return this.overlay.querySelector('.actor');
  }

  get actorScreenCoordinates() {
    return new DOMPoint(
      this.actor.getBoundingClientRect().x,
      this.actor.getBoundingClientRect().y 
    )
  }

  get actorGridCoordinates() {
    return {
      row: +this.actor.dataset.row,
      column: +this.actor.dataset.column,
    }
  }

  get tileSize() {
    const { width, height } = this.tiles[0].getBoundingClientRect()

    return {
      width,
      height,
    }
  }

  get tiles() {
    return this.grid.tiles
  }

  get occupiedTile() {
    return this.grid.occupiedTile
  }

  get occupiedTiles() {
    return this.grid.occupiedTiles
  }

  get targetTile() {
    return this.grid.targetTile
  }

  static #getTemplate(name) {
    return template(name);
  }

  tile(row, column) {
    return this.tiles.find(_ => +_.dataset.row === row && +_.dataset.column === column)
  }

  tileAtPoint(x, y) {
    return this.grid.tileAtPoint(x, y)
    const targ = document.elementFromPoint(x, y)
    const curr = targ ? targ.closest('.tile') : null
    const subtile = targ ? targ.closest('.subtile') : null
    return [curr, subtile];
  }

  setOccupiedTile(tile, subtile) {
    if (!this.occupiedTile) {
      tile.dataset.occupied = true;
      tile.dataset.visited = true;

      if (subtile) subtile.dataset.occupied = true;

      return;
    }

    if (this.occupiedTile.querySelectorAll) {
      this.occupiedTile.querySelectorAll('.subtile').forEach((sub, i) => {
        sub.dataset.occupied = false;
        sub.dataset.visited = true;
      });
    }

    this.occupiedTile.dataset.visited = this.occupiedTile.dataset.visited === 'true' ? false : true;
    this.occupiedTile.dataset.occupied = false;

    tile.dataset.occupied = true;

    if (subtile) subtile.dataset.occupied = true;

    return this.occupiedTile;
  }

  setTarget(tile) {
    if ((tile !== this.targetTile || !tile) && this.targetTile) {
      this.targetTile.dataset.target = false;
    }

    tile.dataset.target = true;

    return this.targetTile;
  }

  createTile(row, column, options) {
    const t = DOM.createElement({
      templateName: 'tile',
      elementProperties: {
        id: [row, column].toString(),
        dataset: {
          row,
          column,
          target: false,
          type: 'empty',
          ...options || {}
        }
      }
    });

    return t;
  }

  createGrid(height, width, options) {
    const gridDom = this.grid.createGrid(height, width, options)

    document.querySelector('#app-body').querySelector('.grid').replaceWith(gridDom)

    return;

    this.grid.innerHTML = '';

    this.grid.style.gridTemplateRows = `repeat(${height}, 1fr)`

    this.grid.style.gridTemplateColumns = `repeat(${width}, 1fr)`

    for (let row = 0; row < height; row++) {
      for (let column = 0; column < width; column++) {
        this.grid.append(this.createTile(row, column))
      }
    }

    return this.grid;
  }

  handleTileClick(e) {
    const tile = e.target.closest('.tile');
    const { row, column } = tile.dataset
    const targ = this.tile(+row, +column);

    if (targ) {
      this.setTarget(targ)
    }
  };


};