import { Eventer } from './Eventer.js'
import { SvgApi } from './SVGCanvas.js';
import { TransformList } from '../src/features/graphic/TransformList.js';

const TabCellParams = {
  context: SvgApi(),
  initialValue: null,
}
export class TabCell extends Eventer {
  #self;
  #context;
  #value;
  
  constructor({ context, initialValue } = TabCellParams) {
    super();
    
    if (context === SvgApi) throw new Error('No context passed to Tab Cell');
    
    this.#context = context;
    this.#self = context.getTemplate('tab-cell');
    
    this.setValue(initialValue);
    
    this.#transforms = new TransformList(
      this.#context, this.#self, {
        transforms: [
          { type: 'translate', values: [0, 0] },
          { type: 'rotate', values: [0, 0, 0] },
          { type: 'scale', values: [1, 1] },
        ]
      }
    );
  }
  
  get dom() { return this.#self };
  
  get #textElement() { return this.dom.querySelector('.tab-cell-value') };
  
  get value() { return this.#textElement.textContent ? +this.#textElement.textContent : null };
  
  set value(v) {
    this.#textElement.textContent = v;
  };
  
  get isActive() { return this.dom.dataset.isActive === 'true' ? true : false };
  
  setValue(v) {
    /*
      Think of cell activations as start of an 'Active Session'
      - So the first input of a session overwrites existing value
        rather than appends to it
      - Second input appends to value unless first input is 0,
        in which case second input overwrites
      - If an input will result in a value with length of 3
        then overwrite
      
      
      
      
      Validation for accepting values:
        1. Can only have a leading 0 if 0 is the full value;
          
    */
    if ((typeof v == 'string' && !v.length) || !isNaN(+v)) {
      this.value = v;
    }
  }
  
  activate() {
    if (!this.isActive) {
      this.dom.dataset.isActive = true;
      
      this.emit('cell:activate', { fretValue: this.value })
    }
  }
  
  deactivate() {
    if (this.isActive) {
      this.dom.dataset.isActive = false;
      
      this.emit('cell:deactivate', { fretValue: this.value })
    }
  }
  
}