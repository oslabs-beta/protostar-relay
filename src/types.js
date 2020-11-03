/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

export type Wall = {|
  // `listen` returns the "unlisten" function.
  listen: (fn: Function) => Function,
  send: (event: string, payload: any, transferable?: Array<any>) => void
|};

export type Record = { [key: string]: mixed, ... };
export type DataID = string;
export type UpdatedRecords = { [dataID: DataID]: boolean, ... };

export type StoreRecords = { [DataID]: ?Record, ... };

// Copied from relay
export type LogEvent =
  | {|
      +name: 'queryresource.fetch',
      +operation: $FlowFixMe,
      // FetchPolicy from relay-experimental
      +fetchPolicy: string,
      // RenderPolicy from relay-experimental
      +renderPolicy: string,
      +hasFullQuery: boolean,
      +shouldFetch: boolean
    |}
  | {|
      +name: 'store.publish',
      +source: any,
      +optimistic: boolean
    |}
  | {|
      +name: 'store.gc',
      references: Array<DataID>,
      gcRecords: StoreRecords
    |}
  | {|
      +name: 'store.restore'
    |}
  | {|
      +name: 'store.snapshot'
    |}
  | {|
      +name: 'store.notify.start'
    |}
  | {|
      +name: 'store.notify.complete',
      +updatedRecordIDs: UpdatedRecords,
      +invalidatedRecordIDs: Array<DataID>,
      updatedRecords: StoreRecords,
      invalidatedRecords: StoreRecords
    |}
  | {|
      +name: 'execute.info',
      +transactionID: number,
      +info: mixed,
      params: $FlowFixMe,
      variables: $FlowFixMe
    |}
  | {|
      +name: 'execute.start',
      +transactionID: number,
      +params: $FlowFixMe,
      +variables: $FlowFixMe
    |}
  | {|
      +name: 'execute.next',
      +transactionID: number,
      +response: $FlowFixMe,
      params: $FlowFixMe,
      variables: $FlowFixMe
    |}
  | {|
      +name: 'execute.error',
      +transactionID: number,
      +error: Error,
      params: $FlowFixMe,
      variables: $FlowFixMe
    |}
  | {|
      +name: 'execute.complete',
      +transactionID: number,
      params: $FlowFixMe,
      variables: $FlowFixMe
    |}
  | {|
      +name: 'execute.unsubscribe',
      +transactionID: number,
      params: $FlowFixMe,
      variables: $FlowFixMe
    |};

export type EventData = {|
  +id: number,
  +data: LogEvent,
  +source: StoreRecords,
  +eventType: string
|};

export type StoreData = {|
  +name: string,
  +id: number,
  +records: StoreRecords
|};

export type EnvironmentInfo = {|
  +id: number,
  +environmentName: string
|};
