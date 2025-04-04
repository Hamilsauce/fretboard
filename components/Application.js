import { Component } from './Component.js';
import { SVGCanvas } from './SVGCanvas.js';
import { AppConfig } from '../app.config.js';

export class Application extends Component {
  constructor(appConfig = AppConfig) {
    super(null, 'app', {...appConfig, id: 'app'});

    Object.entries(appConfig.components)
      .forEach(([name, config]) => {
        Component.insertComponent(this, name, config)
      });

    // console.log('Application: ', this);
  };
}