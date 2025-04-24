import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
import { EventEmitter } from 'https://hamilsauce.github.io/hamhelper/event-emitter.js';
const { template, utils } = ham;

export class Cache extends Map {
  constructor(entries = [[]]) {
    super()
    if (entries) {
      entries
    }
  }

  set(entryKey, cacheKey, cacheValue) {
    if (!(entryKey && cacheKey && cacheValue)) return;

    if (super.has(entryKey)) super.get(entryKey).set(cacheKey, cacheValue)
    else super.set(entryKey, new Map(cacheKey, cacheValue));

    return this //super.get(entryKey).get(cacheKey)
  }

  get(entryKey, cacheKey) {
    if (!(entryKey && cacheKey)) return;

    return super.get(entryKey).get(cacheKey)
  }

  has(entryKey, cacheKey) {
    return super.has(entryKey) && this.get(entryKey).has(cacheKey)
  }
}


export class TileModel {
  #id = TileModel.uuid();
  #row = -1;
  #column = -1;
  #occupied = false;
  #target = false;
  #type = 'tile';

  constructor(row, column, occupied, target) {
    this.#row = row;
    this.#column = column;
    this.#occupied = occupied;
    this.#target = target;
  }

  static create(row, column, options) {
    if (isNaN(+row) || isNaN(+column)) return;

    const { occupied, target } = options || {};

    return new TileModel(+row, +column, !!occupied, !!target);
  }

  get id() { return this.#id }

  get type() { return this.#type }

  get row() { return this.#row }

  get column() { return this.#column }

  get occupied() { return this.#occupied }

  get target() { return this.#target }

  static uuid() {
    return 't' + utils.uuid();
  }

  setState(state = {}) {
    const { target, occupied } = state;

    if (target) this.#target = !!target
    if (occupied) this.#occupied = !!occupied

    return this;
  }
}

export class GridModel {
  #tiles = new Map();
  #rows = [];
  #width = 0;
  #height = 0;

  constructor(height, width, options) {
    if (!height && width) throw new Error('[GRID MODEL]: INVALID height or width')

    this.#init(height, width);
  }

  get height() { return this.#height || 0 }

  get width() { return this.#width || 0 }

  get rows() { return this.#rows }

  #init(height, width, options) {
    this.#height = height
    this.#width = width

    for (let row = 0; row < height; row++) {
      this.insertRow(row);
      // for (let column = 0; column < width; column++) {
      //   grid.append(createTile(row, column))
      // }
    }

    return this;
  }

  create() {}

  tile(row, column) {
    return this.#rows[row][column]
  }

  createTile(row, column, options) {
    return TileModel.create(row, column, options)
  }

  insertRow(row, options) {
    const r = new Array(this.width)
      .fill(null)
      .map((_, column) => this.createTile(row, column))

    this.#rows.push(r);

    return r;
  }

  insertColumn(column, options) {}

  setTargetTile(row, column, options) {}

  setTileOccupied(row, column, options) {}

  // uuid(type = 'tile') {
  //   return type.slice(0, 1).toLowerCase() + uuid();
  // }
}

const INITIAL_STATE = {
  fps: 0,
  grid: null,

}

export class Store extends EventEmitter {
  #state;
  #grid;
  #name;

  constructor(gridModel = new GridModel(1, 1)) {
    super();

    this.#grid = gridModel;
    
    // console.log(this.#grid);
  }

  get grid() { return this.#grid };

};

export const store = new Store(new GridModel(12, 6));