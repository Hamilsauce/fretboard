// translate page to SVG co-ordinate
export function svgPoint(svgRoot, element, x, y) {
  var pt = svgRoot.createSVGPoint();
  pt.x = x;
  pt.y = y;
  return pt.matrixTransform(element.getScreenCTM().inverse());
}

// update co-ordinates
export function getCoordinates(event, svg = document.querySelector('#canvas')) {
  const out = {}
  // DOM co-ordinate
  out.clientX = event.clientX;
  out.clientY = event.clientY;
  
  // SVG co-ordinate
  const svgP = svgPoint(svg, out.clientX, out.clientY);
  out.svgX = Math.floor(svgP.x);
  out.svgY = Math.floor(svgP.y);
  
  // target co-ordinate
  const svgT = svgPoint(event.target, out.clientX, out.clientY);
  out.targetX = svgT.x;
  out.targetY = svgT.y;
  
  return out
  
};