export const sleep = async (time = 500, cb) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(cb()); // Yay! Everything went well!
    }, time);
  });
  
};

// const badChars = '",{,} ';

function* circleLooper(sourceArray = [], delay = 0) {
  // const baseIndex = 0;
  let index = 0;
  let indexOverride
  let currentItem = sourceArray[index]
  
  while (true) {
    indexOverride = yield currentItem
    
    if (indexOverride >= 0) {
      index = indexOverride
      indexOverride = null
    } else {
      index = index < sourceArray.length ? index + 1 : 0
    }
    
    currentItem = sourceArray[index]
    
    if (!currentItem) {
      index = 0
      currentItem = sourceArray[index]
    }
  }
}

export const makeCircular = (sourceArray) => {
  return circleLooper(sourceArray)
};