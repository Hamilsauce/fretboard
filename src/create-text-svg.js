export const createText = (value, parent) => {
  const textNode = document.createElementNS(SVG_NS, "text");
  const text = document.createTextNode(value);
  textNode.appendChild(text);
  textNode.classList.add('text-node');
  textNode.setAttributeNS(null, 'text-anchor', 'middle');
  textNode.setAttribute('x', 0.5)
  textNode.setAttribute('y', 0.6)

  textNode.setAttribute('transform', 'translate(0,0)')
  parent.prepend(textNode);

  return textNode;
}
