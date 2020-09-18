/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import React, { useCallback, useContext, useEffect, useState } from 'react';
import { BridgeContext, StoreContext } from './context';
import { deepCopyFunction } from './utils';

export default function StoreInspector(props: {|
  +portalContainer: mixed,
  currentEnvID: ?number,
|}) {
  const store = useContext(StoreContext);
  const bridge = useContext(BridgeContext);
  const [, forceUpdate] = useState({});
  const [envSnapshotList, setEnvSnapshotList] = useState({});
  const [envSnapshotListByType, setEnvSnapshotListByType] = useState({});
  const [checked, setChecked] = useState({
    networkEvents: true,
    storeEvents: true,
  });

  useEffect(() => {
    const refreshEvents = () => {
      console.log("storeinspector refreshing due to storeDataReceived flag")
      forceUpdate({});
    };
    store.addListener('storeDataReceived', refreshEvents);
    store.addListener('allEventsReceived', refreshEvents);
    return () => {
      store.removeListener('storeDataReceived', refreshEvents);
      store.removeListener('allEventsReceived', refreshEvents);
    };
  }, [store]);

  const [selectedRecordID, setSelectedRecordID] = useState('');
  let records = {};
  const recordsByType = new Map();

  const refreshStore = useCallback(() => {
    const currEnvID = props.currentEnvID;
    if (currEnvID != null) {
      const recordsArr = envSnapshotList[currEnvID] || [];
      recordsArr.push(deepCopyFunction(records));
      const recordsTypeArr = envSnapshotListByType[currEnvID] || [];
      recordsTypeArr.push(deepCopyFunction(recordsByType));
      setEnvSnapshotList({ ...envSnapshotList, [currEnvID]: recordsArr });
      setEnvSnapshotListByType({
        ...envSnapshotListByType,
        [currEnvID]: recordsTypeArr,
      });
      bridge.send('refreshStore', currEnvID);
    }
  }, [  //this array are the dependencies for ^^. Conceptionally represent arguments to the callback. 
    //Every val referenced should appear in this array.
    props,
    bridge,
    records,
    recordsByType,
    envSnapshotList,
    envSnapshotListByType,
  ]);

  const currentEnvID = props.currentEnvID;

  if (currentEnvID == null) {
    return null;
  }

  const recordingImportEnvironmentID = store.getImportEnvID();

  const allEvents = recordingImportEnvironmentID
    ? store.getEvents(recordingImportEnvironmentID)
    : store.getEvents(currentEnvID);

  records = store.getRecords(currentEnvID);
  const optimisticUpdates = store.getOptimisticUpdates(currentEnvID);
  let selectedRecord = {};
  if (records != null) {
    for (const key in records) {
      const rec = records[key];
      if (rec != null) {
        const arr = recordsByType.get(rec.__typename);
        if (arr) {
          arr.push(key);
        } else {
          recordsByType.set(rec.__typename, [key]);
        }
      }
    }
    selectedRecord = records[selectedRecordID];
  }

  if (records == null) {
    return null;
  }
  return (
    <p>Store loaded</p>
  );
}
