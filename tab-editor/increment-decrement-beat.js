export function incrementBeat(value) {
  let intPart = Math.floor(value);
  let decPart = Math.round((value - intPart) * 10); // get decimal part as integer
  
  if (decPart < 4) {
    decPart += 1;
  } else {
    intPart += 1;
    decPart = 1;
  }
  
  return parseFloat(`${intPart}.${decPart}`);
}

export function decrementBeat(value) {
  let intPart = Math.floor(value);
  let decPart = Math.round((value - intPart) * 10); // get decimal part as integer
  
  if (decPart > 1) {
    decPart -= 1;
  } else {
    intPart -= 1;
    decPart = 4;
  }
  
  return parseFloat(`${intPart}.${decPart}`);
}