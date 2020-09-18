/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

export function deepCopyFunction(inObject: any) {
  if (typeof inObject !== "object" || inObject === null) {
    return inObject;
  }

  if (Array.isArray(inObject)) {
    const outObject = [];
    for (let i = 0; i < inObject.length; i++) {
      const value = inObject[i];
      outObject[i] = deepCopyFunction(value);
    }
    return outObject;
  } else if (inObject instanceof Map) {
    const outObject = new Map<mixed, mixed>();
    inObject.forEach((val, key) => {
      outObject.set(key, deepCopyFunction(val));
    });
    return outObject;
  } else {
    const outObject = {};
    for (const key in inObject) {
      const value = inObject[key];
      if (typeof key === "string" && key != null) {
        outObject[key] = deepCopyFunction(value);
      }
    }
    return outObject;
  }
}

export function debounce(func, wait) {
  let timeout = null;
  return function () {
    const newfunc = () => {
      timeout = null;
      func.apply(this, arguments)
    }
    clearTimeout(timeout)
    timeout = setTimeout(newfunc, wait);
  }
}