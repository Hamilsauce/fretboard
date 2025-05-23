const config = {
  templateSource: null,
  instance: null
}

const State = {
  templateSource: null,
  instance: {

    // _source: document.querySelector(`#${templateSourceName}-template`),

    get source() { return State.templateSource },

    get(name) {
      return getTemplate(this.source, name)
    },
  }
}

const getTemplate = (templateSourceSvg, name) => {
  return templateSourceSvg.querySelector(`[data-canvas-element=${name}]`)
    .cloneNode(true);
};

export const setTemplateSource = (templateSourceName) => {
  State.templateSource = document.querySelector(`#${templateSourceName}-template`)

  return State.instance;
};

export const getTemplater = () => {
  return State.instance;
};
