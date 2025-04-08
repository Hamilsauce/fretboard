export const createCustomEvent = (type, detail = {}) => {
  return new CustomEvent(type, {bubbles: true, detail})
};

export const createEvent = (type, detail = {}) => {
  return new Event(type)
};