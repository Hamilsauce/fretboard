export class CircularIterator {
  constructor(sourceArray = []) {
    if (!Array.isArray(sourceArray) || sourceArray.length === 0) {
      throw new Error("CircularIterator requires a non-empty array.");
    }
    this.sourceArray = sourceArray;
    this.iterator = circleLooper(sourceArray);
    this.current = this.sourceArray[0]; // Start with the first item
  }
  
  // Start the loop from the beginning (reset)
  reset() {
    this.iterator = circleLooper(this.sourceArray);
    this.current = this.sourceArray[0];
  }
  
  // Get the current item
  currentItem() {
    return this.current;
  }
  
  // Advance the loop by one item
  next() {
    this.current = this.iterator.next().value;
    return this.current;
  }
  
  // Skip to a specific index in the array
  jumpTo(index) {
    if (index >= 0 && index < this.sourceArray.length) {
      this.iterator.next(index);
      this.current = this.sourceArray[index];
    }
    return this.current;
  }
  
  // Peek at the next item without advancing
  peekNext() {
    const current = this.iterator.next().value;
    this.iterator = circleLooper(this.sourceArray); // Reset the iterator
    return current;
  }
}

// The generator function itself
function* circleLooper(sourceArray = [], delay = 0) {
  let index = 0;
  let indexOverride;
  let currentItem = sourceArray[index];
  
  while (true) {
    indexOverride = yield currentItem;
    
    if (indexOverride >= 0) {
      index = indexOverride;
      indexOverride = null;
    } else {
      index = index < sourceArray.length ? index + 1 : 0;
    }
    
    currentItem = sourceArray[index];
    
    if (!currentItem) {
      index = 0;
      currentItem = sourceArray[index];
    }
  }
}