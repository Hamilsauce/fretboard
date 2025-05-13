// router.js
export class Router {
  constructor(routes, rootElement) {
    this.root = rootElement;
    this.routes = routes;
    window.addEventListener('popstate', () => this.render());
  }
  
  navigate(path) {
    history.pushState({}, '', path);
    this.render();
  }
  
  parsePath(path) {
    const segments = path.replace(/^\/+|\/+$/g, '').split('/');
    return segments.length === 1 && segments[0] === '' ? [] : segments;
  }
  
  findRouteTree(pathSegments, routeMap = this.routes, base = '') {
    let match = null;
    let children = null;
    const segment = '/' + pathSegments.join('/');
    
    for (const path in routeMap) {
      const pattern = path.replace(/:([^/]+)/g, (_, key) => `(?<${key}>[^/]+)`);
      const regex = new RegExp('^' + pattern + '$');
      const matchResult = segment.match(regex);
      if (matchResult) {
        const route = routeMap[path];
        const params = matchResult.groups || {};
        children = route.children || null;
        match = { path, component: route.component, params, children };
        break;
      }
    }
    
    if (!match) return [];
    
    const consumed = match.path.replace(/^\/+|\/+$/g, '').split('/');
    const remaining = pathSegments.slice(consumed.length);
    return [match, ...this.findRouteTree(remaining, children)];
  }
  
  render() {
    const fullPath = window.location.pathname;
    const segments = this.parsePath(fullPath);
    const routeTree = this.findRouteTree(segments);
    
    if (!routeTree.length) {
      this.root.innerHTML = '<h1>404 Not Found</h1>';
      return;
    }
    
    this.root.innerHTML = '';
    let currentContainer = this.root;
    
    for (const { component, params } of routeTree) {
    // TODO NEED TO USE COMPONENTS
      const node = document.createElement('div');
      node.innerHTML = component(params);

      currentContainer.appendChild(node);
      currentContainer = node.querySelector('router-view') || currentContainer;
    }
  }
}