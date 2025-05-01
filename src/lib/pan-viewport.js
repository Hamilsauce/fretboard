import { domPoint } from './utils.js';

const { forkJoin, Observable, iif, BehaviorSubject, AsyncSubject, Subject, interval, of, fromEvent, merge, empty, delay, from } = rxjs;
const { startWith, flatMap, reduce, groupBy, toArray, mergeMap, switchMap, scan, map, tap, filter } = rxjs.operators;
const { fromFetch } = rxjs.fetch;

const createPanEvent = ({ svg, target, clientX, clientY } = new PointerEvent()) => {
  return domPoint((target ? target : svg), clientX, clientY);
};

const calculateOrigimDelta = ({ viewBox, x, y, clientY } = new PointerEvent()) => {
  return domPoint((target ? target : svg), clientX, clientY);
};


export const addPanAction = (svg, callback) => {
  let currentOrigin = domPoint(svg, 0, 0)
  let panOrigin = null;

  const scene = svg.querySelector('#scene');
  const viewBox = svg.viewBox.baseVal;

  const pointerdown$ = fromEvent(svg, 'pointerdown')
    .pipe(
      tap((e) => {
        e.preventDefault();
        e.stopPropagation();
      }),
      map(createPanEvent),
      tap(point => panOrigin = point),
    );

  const pointermove$ = fromEvent(svg, 'pointermove')
    .pipe(
      tap((e) => {
        e.preventDefault();
        e.stopPropagation();
      }),
      map(createPanEvent),
      map(({ x, y }) => {
        return {
          type: 'pointermove',
          x: viewBox.x - ((x - panOrigin.x)),
          y: viewBox.y - ((y - panOrigin.y))
        }
      }),
      tap((origin) => {
        callback(origin)
      }),
    );

  const pointerup$ = fromEvent(svg, 'pointerup')
    .pipe(
      map(createPanEvent),
      map(({ x, y }) => {
        return {
          type: 'pointerdown',
          x: viewBox.x - ((x - panOrigin.x)),
          y: viewBox.y - ((y - panOrigin.y))
        }
      }),
    );

  return pointerdown$.pipe(
    switchMap(panOrigin => pointermove$.pipe(
      // tap(({ x, y }) => {
      //   const o = {
      //     x: viewBox.x + (viewBox.width / 2),
      //     y: viewBox.y + (viewBox.height / 2),
      //   }
      // }),
    )),
    switchMap(delta => pointerup$)
  )
};