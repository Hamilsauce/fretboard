import { ViewportLayer } from './ViewportLayer.js';
import { ObjectRegistry } from './ObjectRegistry.js';
import { initDetailPane } from './DetailPane.js';
import { setClipboard } from '../lib/copy-to-clipboard.js';

const { forkJoin, Observable, iif, BehaviorSubject, AsyncSubject, Subject, interval, of, fromEvent, merge, empty, delay, from } = rxjs;
const { flatMap, reduce, groupBy, toArray, mergeMap, switchMap, scan, map, tap, filter } = rxjs.operators;

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

const NULL_DETAIL_PANE = {
  x: '--',
  y: '--',
  left: '--',
  right: '--',
  top: '--',
  bottom: '--',
  width: '--',
  height: '--',
  vertices: [],
}


export class Hud extends ViewportLayer {
  constructor(context, options) {
    super(context, 'hud', { ...options, id: 'hud' });

    this.slotObject('hud');
    this.removeDOM('.overlay-slot');
    // this.removeDOM('.selection-slot');
    const [originElX, originElY] = [...this.querySelectorAll('#origin-coords-content text')];

    this.originElX = originElX
    this.originElY = originElY
    this.detailPane = initDetailPane(this)

    this.updateDetailPane = this.#updateDetailPane.bind(this)

    this.focusedObject = null;

    // setTimeout(() => {
    //   console.log(' ', );
    //   console.log('this.context.layers', this.context.layers)
    //   this.focusedObject$ = this.context.layers.scene.focusedObject$


    //   this.focusedObject$
    //     .pipe(
    //       tap(x => console.log('FOCUSED OBJECT IN HUD', x)),
    //       tap(x => this.focusedObject = x),
    //     )
    //     .subscribe()
    // }, 1000)


    this.widgets.toolbox.addEventListener('click', e => {
      // e.preventDefault()
      e.stopPropagation()

      const targ = e.target.closest('g.toolbox-object')

      if (targ) {
        const type = targ.dataset.objectType
        if (type) {
          this.emit(type, e);
        }
      }
      else {
        const expanded = this.widgets.toolbox.dataset.expanded === 'true' ? true : false
        this.widgets.toolbox.dataset.expanded = !expanded;
      }
    });

    this.widgets.panTool.addEventListener('click', e => {
      setClipboard(document.querySelector('#scene').innerHTML)
    });
  }

  get widgets() {
    return {
      toolbox: this.querySelector('#toolbox'),
      detailPane: this.detailPane,
      panTool: this.querySelector('#pan-tool-icon')
    }
  }

  emit(label, e) {
    const { x, y } = this.adaptEvent(e);

    this.self.dispatchEvent(new CustomEvent('createobject', {
      bubbles: true,
      detail: { action: label, objectId: this.id, object: this, x, y, type: e.type }
    }));
  }

  #updateDetailPane(focusedObject) {
    focusedObject = focusedObject ? focusedObject : NULL_DETAIL_PANE;

    this.widgets.detailPane.name.textContent = focusedObject.type + '-' + focusedObject.id.slice(0, 3)
    this.widgets.detailPane.selected.textContent = focusedObject.selected;
    this.widgets.detailPane.focused.textContent = focusedObject.focused;
    this.widgets.detailPane.xcoord.textContent = Math.trunc(focusedObject.x || 0);
    this.widgets.detailPane.ycoord.textContent = Math.trunc(focusedObject.y || 0);
    this.widgets.detailPane.width.textContent = Math.trunc(focusedObject.width || 0);
    this.widgets.detailPane.height.textContent = Math.trunc(focusedObject.height || 0);
    this.widgets.detailPane.vertices.textContent = (focusedObject.vertices || []).length
    return focusedObject;
  }
}