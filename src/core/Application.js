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

// src/app/Application.ts
import { AudioEngine } from '../audio/AudioEngine';
import { SvgScene } from '../graphics/SvgScene';
import { Scheduler } from '../scheduling/Scheduler';
import { UI } from '../ui/UI';

export class Application {
  audio: AudioEngine;
  scene: SvgScene;
  ui: UI;
  scheduler: Scheduler;

  constructor() {
    this.audio = new AudioEngine();
    this.scene = new SvgScene();
    this.scheduler = new Scheduler();
    this.ui = new UI();
  }

  init() {
    this.audio.init();
    this.scene.init();
    this.ui.init();

    // Example: Wire UI to scene or scheduler
    this.ui.on('noteTrigger', (noteData) => {
      this.scene.spawnNote(noteData); // a method on your SvgScene or entity manager
      this.audio.playNote(noteData);  // send it to the audio engine
    });
  }

  update(time: number) {
    // Call this from a requestAnimationFrame loop or similar
    this.scheduler.tick(time);
    this.scene.update(time); // if animated or dynamic
  }

  destroy() {
    this.audio.destroy();
    this.scene.destroy();
    this.ui.destroy();
  }
}
