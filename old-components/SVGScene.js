import { Viewport } from './Viewport.js';
import { ObjectRegistry } from '../graphics-objects/ObjectRegistry.js';
import { addPanAction } from '../lib/pan-viewport.js';

const { forkJoin, Observable, iif, BehaviorSubject, AsyncSubject, Subject, interval, of, fromEvent, merge, empty, delay, from } = rxjs;
const { distinctUntilChanged, startWith, flatMap, reduce, groupBy, toArray, mergeMap, switchMap, scan, map, tap, filter } = rxjs.operators;
const { fromFetch } = rxjs.fetch;

const testObject1 = {
  type: 'circle',
  point: {
    x: 10,
    y: -10,
  },
  dimensions: {
    width: 16,
    height: 16,
  },
  selected: true,
  focused: false,
};

export class Scene extends Viewport {
  #focusedObjectId = null;
  #sceneState$ = new BehaviorSubject({
    focusedObjectId: null,
    selectedObjectIds: [],
  });

  constructor(context, options) {
    super(context, 'scene', options);

    this.pan$ = addPanAction(this, e => {
      this.pan(e);
    });

    // EXPERIMENTAL CODE:
    // scenePan$.pipe(
    //   startWith({ origin: { x: 0, y: 0 }, viewBox: { x: -36, y: -64, width: 72, height: 128 } }),
    //   filter(({ origin, viewBox }) => origin.x && viewBox.x && viewBox.y && origin.y),
    //   // tap(x => console.warn('[[ SCREEN PAN$ ]]: ', { x })),
    //   tap(x => Object.assign(LocalVewportState.origin, x.origin)),
    //   tap((panState) => {
    //     const viewBox = scene.viewBox.baseVal;

    //     Object.assign(viewBox, { ...panState.viewBox });

    //     originElX.textContent = `x: ${Math.trunc(panState.origin.x)}`
    //     originElY.textContent = `y: ${Math.trunc(panState.origin.y)}`
    //   }),
    // ).subscribe();

    this.pan$.subscribe();

    this.objectEvents$ = new Subject().pipe(
      scan((prev, curr) => {
        return { ...prev, ...curr }
      }, this.#sceneState$.getValue()),
      tap(this.#sceneState$),
    );

    this.focusedObject$ = this.#sceneState$.pipe(
      map(({ focusedObjectId }) => focusedObjectId),
      distinctUntilChanged(),
      map((focusedObjectId) => this.objects.get(focusedObjectId)),
      filter(_ => _),
      switchMap(obj => obj.observe()
        .pipe(
          map(o => ({ ...o, vertices: obj.vertices, })),
        )
      )
    );

    fromEvent(this.layers.surface, 'click').pipe(
      map(() => {
        return {
          focusedObjectId: null
        }
      }),
      tap(this.objectEvents$),
    ).subscribe()

    fromEvent(this.layers.objects, 'objectevent').pipe(
      map(({ detail }) => detail),
      tap(x => console.log('x', x)),
      filter(({ type }) => type === 'click'),
      map((e) => {
        const { object, objectId, target } = e
        return {
          focusedObjectId: object.id
        }
      }),
      tap(this.objectEvents$),
    ).subscribe()

    this.#sceneState$.pipe(
      tap(x => console.warn('[ SCENE STATE$ CHANGED ]: ', x)),
    ).subscribe()

    window._scene = this;
  }

  get state$() {
    return this.#sceneState$.asObservable();
  }

  get focusedObject() {
    return this.objects.get(this.#focusedObjectId);
  }

  get originMarker() {
    return this.querySelector('#origin');
  }

  pan({ x, y }) {
    Object.assign(this.viewBox, { x, y });

    const coordTextEl = this.originMarker.querySelector('.coord-text');

    coordTextEl.textContent = `${Math.trunc(this.origin.x || 0)},     ${Math.trunc(this.origin.y || 0)}`;

    this.originMarker.setAttribute('transform', `translate(${x + (this.viewBox.width / 2)},${y + (this.viewBox.height / 2)}) scale(0.16)`);
  }

  handleSurfaceClick(e) {
    const newObject = { ...testObject1, type: ObjectRegistry.keys[getRandomIndex()] };

    this.insertObject(newObject.type, {
      ...newObject
    });
  }

  handleObjectClick(e) {
    const targ = e.target;

    const targetObj = e.target.closest('.object-container');

    const surface = e.target.closest('#surface');

    if (surface) {
      return
    }

    if (targetObj && targetObj.id !== this.#focusedObjectId) {
      if (this.focusedObject) {
        this.focusedObject.focus(false);
      }

      this.#focusedObjectId = targetObj.id;

      this.focusedObject.focus(true);
    }

    else if (targetObj.id === this.#focusedObjectId) {
      this.focusedObject.focus();

      this.#focusedObjectId = null;
    }
  }
}