// import { Graph } from './lib/store.js';
// import { SVGCanvas } from './src/lib/SVGCanvas.js';
// import { MAPS, MAP_9X15_1, BLANK_MAP_9X15_1, FRETBOARD_1 } from './maps.js';
import { Feature } from '../src/core/BaseObject.js';
import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';

const { template, utils, download, TwoWayMap } = ham;

const { forkJoin, Observable, iif, BehaviorSubject, AsyncSubject, Subject, interval, of, fromEvent, merge, empty, delay, from } = rxjs;
const { flatMap, reduce, groupBy, toArray, mergeMap, switchMap, scan, map, tap, filter } = rxjs.operators;

// const graph = new Graph(MAPS.get('FRETBOARD_1'));
// const graph = new Graph(MAP_9X15_1);


const domPoint = (element, x, y) => {
  return new DOMPoint(x, y).matrixTransform(
    element.getScreenCTM().inverse()
  )
};

const useTemplate = (templateName, options) => {
  const el = document.querySelector(`[data-template="${templateName}"]`).cloneNode(true)
  
  delete el.dataset.template;
  
  el.id = `${templateName}-${utils.uuid()}`;
  
  return el;
};

const createRect = ({ classList, width, height, x, y, text, dataset }) => {
  const g = document.createElementNS(SVG_NS, 'g');
  const r = document.createElementNS(SVG_NS, 'rect');
  
  Object.assign(g.dataset, dataset);
  
  g.setAttribute('transform', `translate(${dataset.x},${dataset.y})`);
  g.classList.add(...(classList || ['tile']));
  g.id = 'rect' + utils.uuid();
  
  r.setAttribute('width', width);
  r.setAttribute('height', height);
  
  g.append(r);
  
  if (text) {
    g.append(createText({ textContent: text }));
  }
  
  return g;
};


const createText = ({ textContent }) => {
  const textNode = document.createElementNS(SVG_NS, "text");
  textNode.style.fontSize = '0.0175rem';
  textNode.setAttribute('width', 1)
  textNode.setAttribute('text-anchor', 'middle')
  textNode.textContent = textContent;
  textNode.setAttribute('transform', 'translate(0.5,0.6)');
  
  return textNode;
};


const setCanvasDimensions = (canvas) => {
  if (canvas.parentElement) {
    const { width, height } = canvas.parentElement.getBoundingClientRect();
    
    canvas.setAttribute('width', width);
    canvas.setAttribute('height', height);
  }
  
  else {
    canvas.setAttribute('width', window.innerWidth);
    canvas.setAttribute('height', window.innerHeight);
  }
  
  return canvas
};

const getAspectRatio = (canvas) => {
  const { width, height } = canvas.getBoundingClientRect();
  
  return width / height;
};

const app = document.querySelector('#app');
const appBody = document.querySelector('#app-body')

const canvasEl = document.querySelector('#canvas');
// const canvas = new SVGCanvas(canvasEl)
const scene = document.querySelector('#scene');
// const tileLayer = scene.querySelector('#tile-layer');
const mapInput = document.querySelector('#map-input');
const objectLayer = scene.querySelector('#object-layer');

const actor1 = useTemplate('actor');
objectLayer.append(actor1);


const sceneBCR = scene.getBoundingClientRect();
const sceneBBox = scene.getBBox();
const canvasViewBox = canvas.viewBox;


const Mixin = {
  shit() {
    return this.dom || 'no dom'
  }
}

// Object.assign(SVGCanvas.prototype, Mixin)

console.warn({
  sceneBCR,
  sceneBBox,
  canvasViewBox
});

// const mapInput$ = fromEvent(mapInput, 'change')
const pointerDown$ = fromEvent(canvasEl, 'click')

let mapChangeCnt = 0

// mapInput$.pipe(
//   // tap(x => console.warn('mapInput change', x)),
//   tap(({ target }) => {
//     const sel = target.selectedOptions[0].value
//     const selectedMap = MAPS.get(sel)
//     console.log('sel', sel)
//     console.log('selectedMap', selectedMap)

//     graph.fromMap(selectedMap)
//     tileLayer.innerHTML = ''
//     console.log('tileLayer', tileLayer.children.length)

//     graph.nodes.forEach(({ x, y, tileType }, rowNumber) => {
//       if (tileType === 'start') {
//         actor1.setAttribute('transform', `translate(${x},${y})`);
//       }

//       tileLayer.append(
//         createRect({
//           width: 1,
//           height: 1,
//           text: `${x},${y}`,
//           classList: ['tile'],
//           dataset: {
//             tileType,
//             x: x,
//             y: y,
//           },
//         }))
//     });

//     console.log('tileLayer', tileLayer.children.length)

//   }),
// ).subscribe()

pointerDown$.pipe(
  tap(x => console.warn('CANVAS pointerDown$', x)),
  // map(({ target, clientX, clientY }) => {
  //   return domPoint(canvas, clientX, clientY)
  // }),
).subscribe()


const { width, height } = scene.getBoundingClientRect()

// const tiles = new Array(9 * 15).fill(null).map((_, i) => {})

// graph.nodes.forEach(({ x, y, tileType }, rowNumber) => {
//   tileLayer.append(
//     createRect({
//       width: 1,
//       height: 1,
//       text: `${x},${y}`,
//       classList: ['tile'],
//       dataset: {
//         tileType,
//         x: x,
//         y: y,
//       },
//     }))
// });

let isMoving = false;


// const goalTile = tileLayer.querySelector('[data-tile-type="goal"]');



// canvasEl.addEventListener('click', (e) => {
//   // if (isMoving) return;
  
//   const tile = e.target.closest('.tile');
  
  
//   const isActive = tile.dataset.active === 'true' ? true : false;
//   targetNodeEl.dataset.active = !isActive;
// })



// canvasEl.addEventListener('click', ({ detail }) => {
//   if (isMoving) return;

//   const tile = detail.target.closest('.tile');
//   targetNodeEl.dataset.active = false;

//   const pathNodes = canvas.querySelectorAll('.tile[data-is-path-node="true"]');

//   pathNodes.forEach((el, i) => { el.dataset.isPathNode = false });

//   if (tile && tile.dataset.tileType !== 'barrier') {
//     const activeTiles = canvas.querySelectorAll('.tile[data-active="true"]');

//     const highlightedTiles = canvas.querySelectorAll('.tile[data-highlight="true"]');

//     activeTiles.forEach((el, i) => { el.dataset.active = false });

//     highlightedTiles.forEach((el, i) => { el.dataset.highlight = false });

//     const pt = { x: +tile.dataset.x, y: +tile.dataset.y }

//     // const tileNode = graph.getNodeAtPoint(pt);

//     // const neighbors = graph.getNeighbors(tileNode);

//     tile.dataset.active = true;

//     [...neighbors.values()].forEach((node, i) => {
//       const el = canvas.querySelector(`.tile[data-x="${node.x}"][data-y="${node.y}"]`)
//       el.dataset.highlight = true;
//     });
//   }

//   const startNodeEl = canvas.querySelector('.tile[data-current="true"]') || canvas.querySelector('.tile[data-tile-type="start"]');

//   const targetNodeEl = canvas.querySelector('.tile[data-active="true"]');

//   const startNode = graph.getNodeAtPoint({ x: +startNodeEl.dataset.x, y: +startNodeEl.dataset.y });

//   const targetNode = graph.getNodeAtPoint({ x: +targetNodeEl.dataset.x, y: +targetNodeEl.dataset.y });

//   const dfsPath = graph.getPath(startNode, targetNode);

//   // const linkedList = graph.toLinkedList(dfsPath)
//   // console.log('linkedList', linkedList)
//   let oppositeDirMap = new TwoWayMap([
//     ['up', 'down'],
//     ['left', 'right'],
//   ]);

//   let pointer = 0;
//   let curr = dfsPath;

//   let path = [];

//   while (curr) {
//     let previous = curr.previous
//     path.push(curr);
//     curr = previous;
//   }

//   path.reverse();
//   curr = path[pointer];

//   isMoving = true;
//   actor1.dataset.moving = isMoving;

//   if (isMoving) {
//     let intervalHandle = setInterval(() => {
//       curr = path[pointer];

//       if (!curr) {
//         clearInterval(intervalHandle);
//         isMoving = false;
//         actor1.dataset.moving = isMoving;
//       }

//       else {
//         const el = canvas.querySelector(`.tile[data-x="${curr.x}"][data-y="${curr.y}"]`);
//         actor1.setAttribute('transform', `translate(${curr.x},${curr.y})`);

//         if (el === startNodeEl) {
//           startNodeEl.dataset.current = false;
//         }

//         el.dataset.isPathNode = curr.isPathNode;

//         pointer++;

//         if (el === goalTile) {
//           console.warn('----- GOAL FOUND -----');
//         }

//         if (el === targetNodeEl) {
//           console.warn('----- TARGET FOUND -----');
//         }
//       }
//       console.log('interval');
//     }, 75)

//     targetNodeEl.dataset.active = false;
//     targetNodeEl.dataset.current = true;
//   }
// });