export const svgUnitsToPixels = (svgRoot /*= new SVGSVGElement()*/ , element) => {
 const { width: vbWidth, height: vbHeight } = svgRoot.viewBox.baseVal;
 const svgWidthPixel = svgRoot.width.baseVal.value
 const svgHeightPixel = svgRoot.height.baseVal.value
 
 const pixelsPerUnitX = svgWidthPixel / vbWidth;
 const pixelsPerUnitY = svgHeightPixel / vbHeight;
 
 const elBBox = element.getBBox();
 const elWidth = elBBox.width
 const elWidthPixels = elWidth * pixelsPerUnitX;
 
 return elWidthPixels
};