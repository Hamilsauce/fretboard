import { EventEmitter } from 'https://hamilsauce.github.io/hamhelper/event-emitter.js';
import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';

const { template, utils, DOM } = ham;

export class GridView extends EventEmitter {
  #self;
  #name;
  
  constructor(selector) {
    super();
    this.#name = selector;
    
    this.#self = GridView.#getTemplate(selector);
    
    this.#self.addEventListener('click', e => {
      this.handleTileClick(e)
    });
    
    
  };
  
  get self() { return this.#self };
  
  get dom() { return this.#self };
  
  get name() { return this.#name };
  
  // get grid() {
  //   return document.querySelector('.grid');
  // }
  
  // get actorGridCoordinates() {
  //   return {
  //     row: +this.actor.dataset.row,
  //     column: +this.actor.dataset.column,
  //   }
  // }
  
  get tileSize() {
    const { width, height } = this.tiles[0].getBoundingClientRect()
    
    return { width, height, }
  }
  
  get tiles() {
    return [...this.self.querySelectorAll('.tile')]
  }
  
  get occupiedTile() {
    return this.self.querySelector('.tile[data-occupied="true"]')
  }
  
  get occupiedTiles() {
    return [...this.self.querySelectorAll('.tile[data-occupied="true"]')];
  }
  
  get targetTile() {
    return this.self.querySelector('.tile[data-target="true"]');
  }
  
  static #getTemplate(name) {
    return template(name);
  }
  
  // addEventListener() {}
  
  tile(row, column) {
    return this.tiles.find(_ => +_.dataset.row === row && +_.dataset.column === column)
  }
  
  
  tileAtPoint(x, y) {
    const targ = document.elementFromPoint(x, y)
    
    // console.warn('Gridview tileAtPoint')
    // console.warn({ x, y, targ: targ.classList })
    
    const curr = targ ? targ.closest('.tile') : null
    const subtile = targ ? targ.closest('.subtile') : null
    return [curr, subtile];
  }
  
  setOccupiedTile(tile, subtile) {
    if (!this.occupiedTile) {
      tile.dataset.occupied = true;
      tile.dataset.visited = true;
      
      if (subtile) subtile.dataset.occupied = true;
      
      return this.occupiedTile;
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
        id: `r${row}c${column}`,
        dataset: {
          // get traversable() {
          //   // return this.type !== 'barrier'
          // },
          row,
          column,
          target: false,
          type: 'empty',
          // ...options || {}
        }
      }
    });
    
    return t;
  }
  
  clear() {
    const removed = []
    
    let curr = this.self.firstElementChild;
    
    while (curr) {
      removed.push(this.self.removeChild(curr))
      curr = this.self.firstElementChild;
    }
    
    return removed;
  }
  
  createGrid(height, width, options) {
    this.clear();
    
    const tiles = options && options.tiles ? options.tiles : null
    // console.log('tiles', tiles)
    this.self.style.gridTemplateRows = `repeat(${height}, 1fr)`
    this.self.style.gridTemplateColumns = `repeat(${width}, 1fr)`
    
    for (let row = 0; row < height; row++) {
      for (let column = 0; column < width; column++) {
        const b = tiles ? tiles.find((t) => t.row == row && t.column == column) : {};
        
        this.self.append(this.createTile(row, column, b))
      }
    }
    
    return this.self;
  }
  
  handleTileClick(e) {
    const tile = e.target.closest('.tile');
    const { row, column } = tile.dataset
    const targ = this.tile(+row, +column);
  // console.warn('Gridview handleTileClick')

    // console.warn('+row, +column', +row, +column)
    if (targ) {
      this.setTarget(targ)
    }
  };
};