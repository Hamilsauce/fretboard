import { GraphicObject } from './GraphicObject.js';
import { addDragAction } from '../modules/drag-stream.js';

const { forkJoin, Observable, iif, BehaviorSubject, AsyncSubject, Subject, interval, of, fromEvent, merge, empty, delay, from } = rxjs;
const { distinctUntilChanged, shareReplay, flatMap, reduce, groupBy, toArray, mergeMap, switchMap, scan, map, tap, filter } = rxjs.operators;


const SceneObjectOptions = {
  type: String,
  point: {},
  dimensions: {},
  attributes: {},
  isInterface: true,
}

const DEFAULT_SCENE_CONFIG = {
  type: 'rect',
  point: {},
  dimensions: {},
  attributes: {},
  isInterface: true,
}


export class SceneObject extends GraphicObject {
  #state$ = null

  constructor(context, type, options = SceneObjectOptions) {
    super(context, type, options);
  
    this.#state$ = new BehaviorSubject(
    {
      ...(this.bounds || {}),
      id: this.id,
      type: this.type,
      selected: this.selected,
      focused: this.focused,
      vertices: this.vertices,

    });

  }

  focus(state) {
    this.dataset.focused = state ? state : !this.focused;
    this.dataset.selected = this.dataset.focused === 'true' ? true : this.dataset.focused;

    if (this.focused) {
      this.self.parentElement.append(this.self)

      this.drag$ = addDragAction.bind(this)(this, e => {
        if (e.type == 'pointerdown') {
          this.panOrigin = { x: e.x, y: e.y }
        }

        this.translate({
          x: this.x + (e.x - this.panOrigin.x),
          y: this.y + (e.y - this.panOrigin.y),
        });
        
        this.setState();

        // this.#state$.next({...this.#state$.getValue(),...this.bounds })
      });

      this.dragSubscription = this.drag$
        .subscribe() //this.#state$)
    }

    else {
      if (this.dragSubscription && this.dragSubscription.unsubscribe) {
        console.warn('this.dragSubscription', this.dragSubscription)
        this.dragSubscription.unsubscribe()
      }
    }
  }


  observe(options = {}) {
    const state$ = this.#state$.asObservable()
      .pipe(
        distinctUntilChanged(),
        shareReplay(1),
      );

    return state$;
  }

  setState(stateMap = {}) {
    this.#state$.next({
      ...this.#state$.getValue(),
      ...this.bounds,
      id: this.id,
      type: this.type,
      selected: this.selected,
      focused: this.focused,
      vertices: this.vertices,
    })
  }


  static create(context, { type, template, point, dimensions, isInterface, } = SceneObjectOptions) {
    if (isInterface) throw new Error('Invalid Options passed to Create Scene Object');

    if (type !== 'circle') {
      container
        .querySelector('.object-slot')
        .setAttribute('transform', `translate(-${dimensions.width / 2},-${dimensions.height / 2})`);
    }

    else {
      obj.setAttribute('r', dimensions.width / 2);
    }

    if (type == 'rect') {
      obj.setAttribute('width', dimensions.width);
      obj.setAttribute('height', dimensions.height);
    }

    return new SceneObject(INSTANTIATION_KEY, sceneContext, {
      // svg: sceneContext,
      template: container,
      type,
      attrs: {
        dataset: {
          selected: false,
          focused: false,
          cum: 'fuck',
        }
      }
    });
  };

}