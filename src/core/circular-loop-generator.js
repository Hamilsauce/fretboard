export const sleep = async (time = 500, cb = () => {}) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(cb());
    }, time);
  });
  
};

const initNumberInRangeTester = (lower = 0, upper = 1) => (num) => {
  return typeof override === 'number' &&
    num >= lower &&
    num < upper;
}

const initIndexIncrementLooper = (initialIndex = 0, lower = 0, upper = 1) => {
  const isNumberInRange = initNumberInRangeTester(0, upper)
  let index = initialIndex;
  
  return (override) => {
    index = isNumberInRange(override) ? override : (index + 1) % upper;
    return index;
  }
}


function* circleLooper(sourceArray = [], startIndex = 0) {
  let index = startIndex;
  let indexOverride
  const loopIncrementIndex = initIndexIncrementLooper(index, 0, sourceArray.length)
  
  while (true) {
    indexOverride = yield sourceArray[index]
    index = loopIncrementIndex(indexOverride)
  }
}

export const makeCircular = (sourceArray) => {
  return circleLooper(sourceArray)
};