import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
import { View } from './view.js';

const { template } = ham;


export class Action {
  #type = String;
  #payload = Object;
  
  constructor(type, payload = {}) {
    if (!type) throw new Error('No type passed to Action');
    
    this.#type = type;
    
    this.#payload = payload;
  }
  
  setPayload(data = {}) {
    this.#payload = data
  }
  
  get type() { return this.#type };
  
  get payload() { return this.#payload || null };
}

export class MenuItem {
  #name = String;
  #title = String;
  #path = String;
  #action = Action;
  #value;
  #self;
  
  constructor({ name, title, path, action, value }) {
    this.#self = document.createElement('div');
    this.#self.classList.add('app-menu-item', 'app-button')
    this.title = title;
    this.#name = name;
    this.#path = path;
    this.#value = value ?? false;
    this.action = action;
    this.#self.dataset.menuItemName = name;
    
    // if (path) {
    //   const link = document.createElement('a');
    //   a.href = '../../docs/index.html'

    // }
  }
  
  get path() { return this.#path };
  
  get dom() { return this.#self };
  
  get name() { return this.#name };
  
  get title() { return this.#self.textContent };
  
  set title(v) { this.#self.textContent = v };
  
  get action() { return this.#action };
  
  set action(v) {
    this.#action = v
    this.#self.dataset.action = v.type;
  };
}


const DEFAULT_MENU_OPTIONS = {
  items: [
  {
    name: 'auto-mode',
    title: 'Auto Mode',
    path: null,
    action: new Action('auto-mode'),
  },
  {
    name: 'scale-mode',
    title: 'Scale Mode',
    path: null,
    action: new Action('scale-mode'),
  },
  {
    name: 'lightshow-mode',
    title: 'Light Show',
    path: null,
    action: new Action('lightshow-mode'),
  },
  {
    name: 'audio-toggle',
    title: 'Sound: On',
    path: null,
    action: new Action('audio-toggle'),
  },
  {
    name: 'docs-link',
    title: 'docs',
    path: '../../docs/index.html',
    action: new Action('docs-link'),
  }, ]
}


export class AppMenu extends View {
  #items = new Map();
  
  constructor(options = DEFAULT_MENU_OPTIONS) {
    super('app-menu');
    if (options && options.items) {
      this.init(options.items);
    }
    
    this.closeButton.addEventListener('click', e => {
      this.close();
    });
    
    this.closeButton.addEventListener('menu:open', e => {
      this.open();
    });
  }
  
  get closeButton() { return this.selectDOM('#app-menu-close') };
  
  get items() { return this.selectDOM('#app-menu-items') };
  
  init(items) {
    this.items.innerHTML = ''
    this.close()
    this.items.append(...items.map(this.createItem.bind(this)))
    
    this.self.addEventListener('click', this.handleItemClick.bind(this));
  }
  
  getItemByName(name) {
    return [...this.#items.values()].find((item) => item.name === name)
  }
  
  createItem(config) {
    const itm = new MenuItem(config);
    this.#items.set(itm.dom, itm);
    return itm.dom;
  }
  
  handleItemClick(e) {
    const targ = e.target.closest('.app-menu-item');
    const item = this.#items.get(targ);
    
    if (item && item.path) {
      location.href = item.path
    } else if (item && item.action) {
      this.emit('menu:' + item.action.type, item.action)
      this.close();
    }
    
  }
  
  #handleCloseClick(items) {
    this.close()
  }
  
  open() {
    this.self.dataset.show = true;
    
  }
  
  close() {
    this.self.dataset.show = false;
  }
  
  toggle() {
    this.self.dataset.show = this.self.dataset.show === 'true' ? false : true;
  }
};