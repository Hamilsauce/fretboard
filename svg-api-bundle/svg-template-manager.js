class SvgTemplateManager extends Map {
  constructor() {
    super();
  }
  
  async load(url = './templates.svg') {
    const res = await fetch(url);
    const text = await res.text();
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(text, 'image/svg+xml');

    svgDoc.querySelectorAll('[data-template]').forEach(el => {
      const id = el.dataset.template;
      this.set(id, el);
      delete el.dataset.template;
    });
  }
  
  get(id) {
    const template = super.get(id);
    if (!template) throw new Error(`SVG template '${id}' not found.`);
    return template.cloneNode(true);
  }
  
  has(id) {
    return super.has(id);
  }
  
  get templates() {
    return [...this.entries()].reduce((acc, [key, value], i) => ({ ...acc, [key]: value }), {});
  }
}

export const svgTemplater = new SvgTemplateManager()