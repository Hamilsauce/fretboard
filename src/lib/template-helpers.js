export const getPlaceholder = (el, name) => el.querySelector(`[data-component-placeholder="${name}"]`)


export const getSVGTemplate = (context, type, options) => {
  const template = context
    .querySelector('#templates')
    .querySelector(`[data-component="${type}"]`)
    .cloneNode(true);
  
  template.dataset.type = type;
  
  return template;
}

export const insertComponent = (context, name, options) => {
  let template = null;
  let placeholder = null;
  
  if (context instanceof SVGElement) {
    placeholder = getPlaceholder(context, name);
    
    template = getSVGTemplate(context, name);
  }
  
  // else if (context instanceof HTMLElement || context === document) {
  //   placeholder = getPlaceholder(context, name);
    
  //   template = ham.template(name);
  // }
  
  if (options) Object.assign(template, options);
  
  placeholder.replaceWith(template);
  
  return template;
};