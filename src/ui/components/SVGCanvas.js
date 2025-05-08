import { Viewport } from './Viewport.js';

const { forkJoin, Observable, iif, BehaviorSubject, AsyncSubject, Subject, interval, of, fromEvent, merge, empty, delay, from } = rxjs;
const { flatMap, reduce, groupBy, toArray, mergeMap, switchMap, scan, map, tap, filter } = rxjs.operators;
const { fromFetch } = rxjs.fetch;

const CanvasOptions = {
  type: 'viewport',
  name: 'canvas',
  viewport: {
    width: 412,
    height: 781,
  },
  dimensions: {
    width: 412,
    height: 781,
  },
  origin: {
    x: 0,
    y: 0,
  },
  layers: {
    // hud: {},
    scene: {
      type: 'viewport',
      name: 'scene',
      fuck: 'me',
      viewport: {
        width: 412,
        height: 781,
      },
      dimensions: {
        width: 72,
        height: 128,
      },
      origin: {
        x: -36,
        y: -72,
      },
      layers: {
        surface: null,
        objects: null,
      },
    }
  }
};

export class SVGCanvas extends Viewport {
  constructor(context, options) {
    super(context, 'canvas', options);
    // console.log('SVGCanvas', this);

    this.createObject$ = fromEvent(this.dom, 'createobject').pipe(
      // tap(x => console.warn('SVGCanvas [[[ CREATE OBJECT ]]] EVENTS', x)),
      tap(this.objectEvents$),
      tap((e) => {
        const { object, objectId, target, action } = e.detail
        const targetObject = this.domObjectMap.get(target);

        this.layers.scene.insertObject(action)
      }),
    );

    this.createObjectSubscription = this.createObject$.subscribe();

    this.focusedObjectSubscription = this.layers.scene.focusedObject$
      .pipe(
        tap(this.layers.hud.updateDetailPane),
      )
      .subscribe();
  }

  get layers() {
    return {
      scene: this.components.scene,
      hud: this.components.hud,
    }
  }
}