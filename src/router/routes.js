// routes.js
// import { Home, DashboardLayout, DashboardHome, Settings } from './components.js';
import { renderMarkdown } from '../../docs/docs.js';
import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';

const { template, utils } = ham;
const appbodyHTML = document.querySelector('#app-body').cloneNode(10);
export const routes = {
  '/': {
    component: () => {
      return appbodyHTML.innerHTML
    }
  },
  '/docs': {
    component: () => {
      const instance = template('docs');
      renderMarkdown(instance)
      return instance
    }
  },
  '/dashboard': {
    component: () => `<div id="home">DASH HOME</div>`,
    children: {
      '/dashboard/about': { component: () => `<div id="home">DAAH ABOUT</div>` },
      '/dashboard/settings': { component: () => `<div id="home">DASH SETTUNGS</div>` },
    },
  },
};

setTimeout(() => {
  
  // console.log('In Routes Timeour 1000', appbodyHTML);
}, 1000)