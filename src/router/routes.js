// routes.js
// import { Home, DashboardLayout, DashboardHome, Settings } from './components.js';

export const routes = {
  '/index.html': { component: () => `<div id="home">HOME</div>` },
  '/dashboard': {
    component: () => `<div id="home">DASH HOME</div>`,
    children: {
      '/dashboard/about': { component: () => `<div id="home">DAAH ABOUT</div>` },
      '/dashboard/settings': { component: () => `<div id="home">DASH SETTUNGS</div>` },
    },
  },
};