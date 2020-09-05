/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

export function copyWithSet(
  obj: Object | Array<any>,
  path: Array<number | string>,
  value: any,
  index: number = 0
): Object | Array<any> {
  console.log('[utils] copyWithSet()', obj, path, index, value);
  if (index >= path.length) {
    return value;
  }
  const key = parseInt(path[index]);
  const updated = Array.isArray(obj) ? obj.slice() : { ...obj };
  updated[key] = copyWithSet(obj[key], path, value, index + 1);
  return updated;
}
