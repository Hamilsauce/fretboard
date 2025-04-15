const sleep = async (time = 500) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("Success!"); // Yay! Everything went well!
    }, time);
  });
  
};

// const badChars = '",{,} ';

 function* circleLooper(sourceArray = [], delay = 0) {
  // const baseIndex = 0;
  let index = 0;
  let currentItem = sourceArray[index]
  
  while (true) {
    if (delay) {
       sleep(delay)
    }
    // console.warn('pitchClass, index', currentItem.dataset.pitchClass, index)

    yield currentItem
    
    index = index < sourceArray.length ? index + 1 : 0
    // index++
    // index < sourceArray.length ? index + 1 : 0
    // console.warn('index', index)
    currentItem = sourceArray[index]
    
    if (!currentItem) {
      index =0
    currentItem = sourceArray[index]

    }
  }
}

export const makeCircular = (sourceArray) => {
  return circleLooper(sourceArray)
};