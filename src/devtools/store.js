/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */
const __DEBUG__ = true;

import EventEmitter from 'events';
import type { FrontendBridge } from 'src/bridge';
import type {
  DataID,
  LogEvent,
  EventData,
  EnvironmentInfo,
  StoreData,
  StoreRecords,
  Record,
} from '../types';

const debug = (methodName, ...args) => {
  if (__DEBUG__) {
    console.log(
      `%cStore %c${methodName}`,
      'color: green; font-weight: bold;',
      'font-weight: bold;',
      ...args
    );
  }
};

const storeEventNames = [
  'queryresource.fetch',
  'store.publish',
  'store.restore',
  'store.gc',
  'store.snapshot',
  'store.notify.complete',
  'store.notify.start',
];

/**
 * The store is the single source of truth for updates from the backend.
 * ContextProviders can subscribe to the Store for specific things they want to provide.
 */
export default class Store extends EventEmitter<{|
  collapseNodesByDefault: [],
  componentFilters: [],
  environmentInitialized: [],
  mutated: [],
  storeDataReceived: [],
  allEventsReceived: [],
  recordChangeDescriptions: [],
  roots: [],
|}> {
  _bridge: FrontendBridge;

  _environmentEventsMap: Map < number, Array<LogEvent>> = new Map();
_environmentNames: Map < number, string > = new Map();
_environmentStoreData: Map < number, StoreRecords > = new Map();
_environmentStoreOptimisticData: Map < number, StoreRecords > = new Map();
_environmentAllEvents: Map < number, Array < LogEvent >> = new Map();
_recordedRequests: Map < number, Map < number, LogEvent >> = new Map();
_isRecording: boolean = false;
_importEnvID: ? number = null;

constructor(bridge: FrontendBridge) {
  super();
  this._bridge = bridge;
  bridge.addListener('events', this.onBridgeEvents);
  bridge.addListener('shutdown', this.onBridgeShutdown);
  bridge.addListener('environmentInitialized', this.onBridgeEnvironmentInit);
  bridge.addListener('storeRecords', this.onBridgeStoreSnapshot);
  bridge.addListener('mutationComplete', this.setEnvironmentEvents);
}

getAllEventsArray(): $ReadOnlyArray < LogEvent > {
  console.log('wow geteventsarray')

    const allEvents = [];
  this._environmentAllEvents.forEach((value, _) => allEvents.push(...value));
  return allEvents;
}

setAllEventsMap(environmentID: number, events: Array<LogEvent>) {
  this._environmentAllEvents.set(environmentID, events);
  this.emit('allEventsReceived');
  console.log('hi events')

}

  getAllEventsMap(): Map < number, Array < LogEvent >> {
  return this._environmentAllEvents;
}

  getEvents(environmentID: number): ?$ReadOnlyArray < LogEvent > {
  console.log('wow getevents')

    return this._environmentAllEvents.get(environmentID);
}

  getAllEnvironmentEvents(): $ReadOnlyArray < LogEvent > {
  console.log('wow getallenvevents')

    const allEnvironmentEvents = [];
  this._environmentEventsMap.forEach((value, _) =>
    allEnvironmentEvents.push(...value)
  );
  return allEnvironmentEvents;
}

  getEnvironmentEvents(environmentID: number): ?$ReadOnlyArray < LogEvent > {
  return this._environmentEventsMap.get(environmentID);
}

  getEnvironmentIDs(): $ReadOnlyArray < number > {
  return Array.from(this._environmentNames.keys());
}

  getImportEnvID(): ?number {
  return this._importEnvID;
}

  setImportEnvID(envID: ?number) {
  this._importEnvID = envID;
  this.emit('allEventsReceived');
}

  getEnvironmentName(environmentID: number): ?string {
  return this._environmentNames.get(environmentID);
}

  getRecords(environmentID: number): ?StoreRecords {
  console.log('getrecords from storejs')
    return this._environmentStoreData.get(environmentID);
}

  getRecordIDs(environmentID: number): ?$ReadOnlyArray < string > {
  console.log('wow getrecordids')

    const storeRecords = this._environmentStoreData.get(environmentID);
  return storeRecords ? Object.keys(storeRecords) : null;
}

  removeRecord(environmentID: number, recordID: string) {
  console.log('wow removedreocrd')

    const storeRecords = this._environmentStoreData.get(environmentID);
  if(storeRecords != null) {
  delete storeRecords[recordID];
}
  }

getAllRecords(): ?$ReadOnlyArray < StoreRecords > {
  console.log('wow getallrecords')
    return Array.from(this._environmentStoreData.values());
}

getOptimisticUpdates(environmentID: number): ?StoreRecords {
  return this._environmentStoreOptimisticData.get(environmentID);
}

mergeRecords(id: number, newRecords: ?StoreRecords) {
  console.log('merging records')
  if (newRecords == null) {
    return;
  }
  const oldRecords = this._environmentStoreData.get(id);
  if (oldRecords == null) {
    this._environmentStoreData.set(id, newRecords);
    return;
  }
  const dataIDs = Object.keys(newRecords);

  for (let ii = 0; ii < dataIDs.length; ii++) {
    const dataID = dataIDs[ii];
    const oldRecord = oldRecords[dataID];
    const newRecord = newRecords[dataID];
    if (oldRecord && newRecord) {
      let updated: Record | null = null;
      const keys = Object.keys(newRecord);
      for (let iii = 0; iii < keys.length; iii++) {
        const key = keys[iii];
        if (updated || oldRecord[key] !== newRecord[key]) {
          updated = updated !== null ? updated : { ...oldRecord };
          updated[key] = newRecord[key];
        }
      }
      updated = updated !== null ? updated : oldRecord;
      if (updated !== newRecord) {
        oldRecords[dataID] = updated;
      }
    } else if (oldRecord == null) {
      oldRecords[dataID] = newRecord;
    } else if (newRecord == null) {
      delete oldRecords[dataID];
    }
  }
  this._environmentStoreData.set(id, oldRecords);
}

mergeOptimisticRecords(id: number, newRecords: ?StoreRecords) {
  if (newRecords == null) {
    return;
  }
  const oldRecords = this._environmentStoreOptimisticData.get(id);
  if (oldRecords == null) {
    this._environmentStoreOptimisticData.set(id, newRecords);
    return;
  }
  const dataIDs = Object.keys(newRecords);

  for (let ii = 0; ii < dataIDs.length; ii++) {
    const dataID = dataIDs[ii];
    const oldRecord = oldRecords[dataID];
    const newRecord = newRecords[dataID];
    if (oldRecord && newRecord) {
      let updated: Record | null = null;
      const keys = Object.keys(newRecord);
      for (let iii = 0; iii < keys.length; iii++) {
        const key = keys[iii];
        if (updated || oldRecord[key] !== newRecord[key]) {
          updated = updated !== null ? updated : { ...oldRecord };
          updated[key] = newRecord[key];
        }
      }
      updated = updated !== null ? updated : oldRecord;
      if (updated !== newRecord) {
        oldRecords[dataID] = updated;
      }
    } else if (oldRecord == null) {
      oldRecords[dataID] = newRecord;
    } else if (newRecord == null) {
      delete oldRecords[dataID];
    }
  }
  this._environmentStoreOptimisticData.set(id, oldRecords);
}

onBridgeStoreSnapshot = (data: Array<StoreData>) => {
  console.log('onBridgeStoreSnapshot... in store')
  for (const { id, records } of data) {
    this._environmentStoreData.set(id, records);
    this.emit('storeDataReceived');
  }
};

setStoreEvents = (id: number, data: LogEvent) => {
  console.log('setstoreevents in store js... ', id, data.name)
  switch (data.name) {
    case 'store.publish':
      this.mergeRecords(id, data.source);
      if (data.optimistic) {
        this.mergeOptimisticRecords(id, data.source);
      }
      break;
    case 'store.restore':
      this.clearOptimisticUpdates(id);
      break;
    case 'store.gc':
      this.garbageCollectRecords(id, data.references);
      break;
    default:
      break;
  }
  this.emit('storeDataReceived');
};

setEnvironmentEvents = (id: number, data: LogEvent) => {
  console.log('wow setevnevents in storejs')

  const arr = this._environmentEventsMap.get(id);
  if (arr) {
    arr.push(data);
  } else {
    this._environmentEventsMap.set(id, [data]);
  }
  this.emit('mutated');
  if (data.name === 'execute.complete') {
    console.log('wow mutation is complete!!!')
    this.emit('mutationComplete')
  }
};

appendInformationToRequest = (id: number, data: LogEvent) => {
  console.log('appendinfotorequest')
  switch (data.name) {
    case 'execute.start':
      const requestArr = this._recordedRequests.get(id);
      if (requestArr) {
        requestArr.set(data.transactionID, data);
      } else {
        const newRequest = new Map<number, LogEvent>();
        newRequest.set(data.transactionID, data);
        this._recordedRequests.set(id, newRequest);
      }
      break;
    case 'execute.next':
    case 'execute.info':
    case 'execute.complete':
    case 'execute.error':
    case 'execute.unsubscribe':
      const requests = this._recordedRequests.get(id);
      if (requests) {
        const request = requests.get(data.transactionID);
        if (request && request.name === 'execute.start') {
          data.params = request.params;
          data.variables = request.variables;
        }
      }
      break;
    default:
      break;
  }
};

startRecording = () => {
  console.log('recoring')
  this._isRecording = true;
  this.clearAllEvents();
};

stopRecording = () => {
  console.log('wow stop recordign')

  this._isRecording = false;
};

onBridgeEvents = (events: Array<EventData>) => {
  console.log('onbrdigeevents', events)
  for (const { id, data, eventType } of events) {
    if (this._isRecording) {
      const allEvents = this._environmentAllEvents.get(id);
      if (allEvents) {
        if (data.name === 'store.gc') {
          const records = this.getRecords(id);
          if (records != null) {
            data.gcRecords = {};
            data.references = Object.keys(records)
              .filter(
                recID => recID != null && !data.references.includes(recID)
              )
              .map(recID => {
                data.gcRecords[recID] = records[recID];
                return recID;
              });
          }
        } else if (data.name === 'store.notify.complete') {
          const records = this.getRecords(id);
          if (records != null) {
            data.invalidatedRecords = {};
            data.updatedRecords = {};
            Object.keys(data.updatedRecordIDs).forEach(recID => {
              data.updatedRecords[recID] = { ...records[recID] };
            });
            data.invalidatedRecordIDs.forEach(
              recID =>
                (data.invalidatedRecords[recID] = { ...records[recID] })
            );
          }
        } else if (data.name.startsWith('execute')) {
          this.appendInformationToRequest(id, data);
        }
        allEvents.push(data);
      } else {
        this._environmentAllEvents.set(id, [data]);
      }
      this.emit('allEventsReceived');
      console.log('hi bob')
    }
    if (eventType === 'store') {
      this.setStoreEvents(id, data);
    } else if (eventType === 'environment') {
      console.log('line 370')
      this.setEnvironmentEvents(id, data);
    }
  }
};

onBridgeEnvironmentInit = (data: Array<EnvironmentInfo>) => {
  for (const { id, environmentName } of data) {
    this._environmentNames.set(id, environmentName);
  }
  this.emit('environmentInitialized');
};

clearOptimisticUpdates = (envID: number) => {
  this._environmentStoreOptimisticData.delete(envID);
};

garbageCollectRecords = (
  envID: number,
  references: $ReadOnlyArray<DataID>
) => {
  if (references.length === 0) {
    this._environmentStoreData.delete(envID);
  } else {
    const storeIDs = this.getRecordIDs(envID);
    if (storeIDs == null) {
      return;
    }
    for (const dataID of storeIDs) {
      if (!references.includes(dataID)) {
        this.removeRecord(envID, dataID);
      }
    }
  }
};

clearAllEvents = () => {
  this._environmentAllEvents.forEach((_, key) => this.clearEvents(key));
  this.emit('allEventsReceived');
};

clearEvents = (environmentID: number) => {
  this._environmentAllEvents.delete(environmentID);
};

clearAllNetworkEvents = () => {
  this._environmentEventsMap.forEach((_, key) =>
    this.clearNetworkEvents(key)
  );
  this.emit('mutated');
};

clearNetworkEvents = (environmentID: number) => {
  const completed = new Set();
  let networkEventArray = this._environmentEventsMap.get(environmentID);
  if (networkEventArray !== undefined && networkEventArray.length > 0) {
    for (const event of networkEventArray) {
      if (
        event.name === 'execute.complete' ||
        event.name === 'execute.error' ||
        event.name === 'execute.unsubscribe'
      ) {
        completed.add(event.transactionID);
      }
    }
    networkEventArray = networkEventArray.filter(
      event =>
        storeEventNames.includes(event.name) &&
        event.transactionID != null &&
        !completed.has(event.transactionID)
    );
    this._environmentEventsMap.set(environmentID, networkEventArray);
    this.emit('mutated');
  }
};

onBridgeShutdown = () => {
  if (__DEBUG__) {
    debug('onBridgeShutdown', 'unsubscribing from Bridge');
  }

  this._bridge.removeListener('events', this.onBridgeEvents);
  this._bridge.removeListener('shutdown', this.onBridgeShutdown);
  this._bridge.removeListener(
    'environmentInitialized',
    this.onBridgeEnvironmentInit
  );
  this._bridge.removeListener('storeRecords', this.onBridgeStoreSnapshot);
};
}
