// GraphicsFeature.js
import { TransformList } from './TransformList.js';
import { domPoint } from '../lib/utils.js';

export function GraphicsFeature(context) {
  return (entity) => {
    if (!context) throw new Error('GraphicsFeature requires a context');
    
    // Setup basic properties
    const self = GraphicsFeature.createGraphicNode(context);
    const transforms = new TransformList(entity, {
      transforms: [
        { type: 'translate', values: [0, 0] },
        { type: 'rotate', values: [0, 0, 0] },
        { type: 'scale', values: [1, 1] },
      ],
    });
    
    const slots = {
      object: self.querySelector('.object-slot'),
      overlay: self.querySelector('.overlay-slot'),
    };
    
    entity.graphic = {
      self,
      context,
      transforms,
      slots,
      dataset: self.dataset,
      dom: self, // alias
    };
    
    // Shortcuts
    entity.x = () => transforms.translation.x;
    entity.y = () => transforms.translation.y;
    entity.point = () => ({ x: entity.x(), y: entity.y() });
    entity.translate = ({ x, y }) => transforms.translateTo(x, y);
    entity.rotate = ({ x, y }) => transforms.rotateTo(x, y);
    entity.scale = ({ x, y }) => transforms.scaleTo(x, y);
    
    // Event adapter (optional upgrade later)
    const adaptEvent = ({ context, target, clientX, clientY } = new PointerEvent()) => {
      return domPoint((target ? target : context), clientX, clientY);
    };
    
    // Basic click handling
    const clickHandler = (e) => {
      const adapted = adaptEvent(e);
      entity.dispatch('graphic-click', { x: adapted.x, y: adapted.y, event: e });
    };
    self.addEventListener('click', clickHandler);
    
    // Feature remove method
    entity.removeFeature('graphics', () => {
      self.removeEventListener('click', clickHandler);
      self.remove();
    });
    
    // Optional: selection/focus utilities
    entity.select = (state) => {
      entity.graphic.dataset.selected = state ? 'true' : 'false';
    };
    
    entity.focus = (state) => {
      entity.graphic.dataset.focused = state ? 'true' : 'false';
    };
  }
}

// Static method to create graphic template
GraphicsFeature.createGraphicNode = (context) => {
  const container = context.templates.querySelector('.object-container').cloneNode(true);
  const selector = context.templates.querySelector('[data-template="object-selector"]').cloneNode(true);
  
  container.querySelector('.overlay-slot').append(selector);
  
  delete container.dataset.template;
  container.dataset.component = 'graphic-object';
  
  return container;
};