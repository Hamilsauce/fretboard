import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
const { template, utils, download } = ham;

const TILE_TYPE_INDEX = [
  'empty',
  'barrier',
  'start',
  'goal'
];

const DIRECTIONS = new Map([
  ['up', { x: 0, y: -1 }],
  ['down', { x: 0, y: 1 }],
  ['left', { x: -1, y: 0 }],
  ['right', { x: 1, y: 0 }],
]);


export class GraphNode {
  #tileType = null;
  #point = { x: 0, y: 0 };
  isPathNode = false;
  isVisited = false;
  previous = null;

  constructor({ tileType, x, y }) {
    this.#tileType = tileType;
    this.#point = { x, y };
  }

  get tileType() { return this.#tileType }

  get isTraversable() { return !['barrier'].includes(this.#tileType) }

  get address() { return [this.x, this.y].toString() }

  get x() { return this.#point.x }

  get y() { return this.#point.y }

  toJSON() {
    return {
      tileType: this.tileType,
      address: this.address,
      x: this.x,
      y: this.y,
      isTraversable: this.isTraversable,
      isPathNode: this.isPathNode,
      isVisited: this.isVisited,
      previous: this.previous,
    }
  }
}

export class Neighbor {
  #node = null;
  #visited = false;

  constructor(node, visited = false) {
    this.#node = node;
    this.#visited = visited;
  }

  get node() { return this.#node }

  get visited() { return this.#visited }

  visit() {
    this.#visited = true;
  }
}




export class Graph {
  #nodes = new Map();
  #edges = new Map();

  constructor(map = []) {
    if (map && map.length) {
      this.fromMap(map);
    }
  }

  get nodes() { return [...this.#nodes.values()]; }

  get startNode() { return this.nodes.find(n => n.tileType === 'start'); }

  get goalNode() { return this.nodes.find(n => n.tileType === 'goal'); }

  get targetNode() { return this.nodes.find(n => n.tileType === 'target'); }

  pointToAddress({ x, y }) {
    return [x, y].toString();
  }

  addressToPoint(address) {
    return address.split(',').map(_ => +_);
  }

  getNodeByAddress(address) {
    return this.#nodes.get(address);
  }

  getNodeAtPoint({ x, y }) {
    return this.getNodeByAddress(this.pointToAddress({ x, y }))
  }

  getNeighbor(node, dirName = '') {
    const { x, y } = DIRECTIONS.get(dirName);

    const n = this.getNodeAtPoint({
      x: node.x + x,
      y: node.y + y,
    });

    if (!n || !n.isTraversable) return null;

    return n;
  }

  getNeighbors(node) {
    const neighborMap = [...DIRECTIONS.keys()]
      .reduce((map, name, i) => {
        return node && this.getNeighbor(node, name) ? map.set(name, this.getNeighbor(node, name)) : map;
      }, new Map());

    return neighborMap;
  }

  getUnvisitedNeighbors(node) {
    return node ? ([...this.getNeighbors(node).entries()] || []).filter(([k, v]) => v && !v.previous && v.isVisited === false) : [];
  }

  getPath(node = this.startNode, stopNode) {
    this.resetPath();
    return this.shortestPathDfs(node, stopNode)
  };

  toLinkedList(lastNode) {
    let pointer = 0;
    let curr = lastNode;
    let path = [];

    while (curr) {
      let previous = curr.previous
      if (previous) {
        previous.next = curr;
        delete curr.previous
      }
      curr = previous;
    }

    return curr;
  };

  pathToQueue(lastNode) {
    let pointer = 0;
    let curr = lastNode;
    let path = [];

    while (curr) {
      let previous = curr.previous
      path.push(curr);
      curr = previous;
    }

    path.reverse();
    curr = path[pointer];
  };


  shortestPathDfs(node, stopNode) { //node = this.startNode, stopNode = this.goalNode) {
    node.isPathNode = true;
    node.isVisited = true;

    if (node === stopNode) {
      return node;
    }


    let unvisitedNeighbors = this.getUnvisitedNeighbors(node);

    if (unvisitedNeighbors.length == 0 && node.previous) {
      node.isPathNode = false;
      node.isVisited = true;
      node = node.previous;

      unvisitedNeighbors = this.getUnvisitedNeighbors(node);

      while (node && unvisitedNeighbors.length === 0) {
        node.isPathNode = false;
        node.isVisited = true;
        node = node.previous;

        unvisitedNeighbors = this.getUnvisitedNeighbors(node);
      }

      return this.shortestPathDfs(node, stopNode);
    }

    else {
      for (let [direction, neighbor] of unvisitedNeighbors) {
        neighbor.previous = node;

        if (unvisitedNeighbors.length > 0) {
          return this.shortestPathDfs(neighbor, stopNode);
        }

        else {
          return node
        }
      }
    }
    return node; /* If no path, return null */
  };

  resetPath() {
    this.nodes.forEach((n, i) => {
      n.isVisited = false;
      n.isPathNode = false;
      n.previous = null;

    });
  }

  fromMap(map = []) {
    const height = map.length;
    const width = map[0].length;

    map.forEach((row, rowNumber) => {
      row.forEach((typeId, columnNumber) => {
        const node = new GraphNode({
          tileType: TILE_TYPE_INDEX[typeId],
          x: columnNumber,
          y: rowNumber
        });

        this.#nodes.set(node.address, node);
      });
    });
  }
}