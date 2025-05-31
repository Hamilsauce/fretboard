import { Eventer } from './Eventer.js';

export class Channel extends Set {
  #name;
  
  constructor(name) {
    super();
    this.#name = name;
  }
  
  get name() { return this.#name }
  
  publish(data) {
    for (const subscriber of this) {
      subscriber(data);
    }
  }
}

export class Mediator extends Map {
  getChannel(name) {
    if (!this.has(name)) {
      this.set(name, new Channel(name));
    }
    return this.get(name);
  }
  
  subscribe(channelName, subscriber) {
    this.getChannel(channelName).add(subscriber);
  }
  
  unsubscribe(channelName, subscriber) {
    const channel = this.get(channelName);
    if (channel) channel.delete(subscriber);
  }
  
  publish(channelName, data) {
    const channel = this.get(channelName);
    if (channel) channel.publish(data);
  }
}


export class Application extends Mediator {
  #self;
  
  constructor(rootSelector = '#app') {
    super();
    
    this.#self = document.querySelector(rootSelector);
  }
  
  get self() { return this.#self };
  
  
}