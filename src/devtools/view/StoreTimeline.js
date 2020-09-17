import React, { useState, useEffect, useContext, useCallback } from "react";
import InputRange from 'react-input-range';
import { BridgeContext, StoreContext } from '../context';
import StoreDisplayer from "./StoreDisplayer";
// import { detailedDiff } from 'deep-object-diff';


const StoreTimeline = ({ currentEnvID }) => {
  const store = useContext(StoreContext);
  const bridge = useContext(BridgeContext);
  const [snapshotIndex, setSnapshotIndex] = useState(0);
  const [timelineLabel, setTimelineLabel] = useState('');
  const [liveStore, setLiveStore] = useState({});
  const [timeline, setTimeline] = useState({
    [currentEnvID]: [{
      label: "at startup",
      date: Date.now(),
      storage: liveStore,
    }]
  });

  const handleClick = (e) => {
    e.preventDefault();
    const timelineInsert = {};
    const timeStamp = Date.now();
    timelineInsert.label = timelineLabel;
    timelineInsert.date = timeStamp;
    timelineInsert.storage = liveStore;
    const newTimeline = timeline[currentEnvID].concat([timelineInsert])
    setTimeline({ ...timeline, [currentEnvID]: newTimeline });
    setTimelineLabel('');
    setSnapshotIndex(newTimeline.length)
  }

  const updateStoreHelper = (storeObj) => {
    setLiveStore(storeObj);
  }
  // testing sans set timeout... maybe put back
  useEffect(() => {
    const refreshLiveStore = () => {
      console.log("mutation triggered refr")
      bridge.send('refreshStore', currentEnvID);
      const allRecords = store.getRecords(currentEnvID);
      console.log('REFRESH INVOKED! currentEnvID:', currentEnvID)
      updateStoreHelper(allRecords);
    };
    store.addListener('mutationComplete', refreshLiveStore);
    return () => {
      store.removeListener('mutationComplete', refreshLiveStore);
    };
  }, [store]);

  useEffect(() => {
    const allRecords = store.getRecords(currentEnvID);
    setLiveStore(allRecords);

    if (!timeline[currentEnvID]) {
      const newTimeline = {
        ...timeline, [currentEnvID]: [{
          label: "current",
          date: Date.now(),
          storage: allRecords,
        }]
      }
      setTimeline(newTimeline);
      setSnapshotIndex(1)
    } else {
      setSnapshotIndex(timeline[currentEnvID].length)
    }
  }, [currentEnvID]);

  console.log("Rendering StoreTimeline")
  console.log("livestore", liveStore)

  return (
    <React.Fragment>
      <div className="column">
        <div className="display-box">
          <div className="snapshot-wrapper is-flex">
            <input type="text" className="input is-small snapshot-btn is-primary" value={timelineLabel} onChange={(e) => setTimelineLabel(e.target.value)} placeholder="take a store snapshot"></input>
            <button className="button is-small is-link" onClick={(e) => handleClick(e)}>Snapshot</button>
          </div>
        </div>
        <div className="snapshots">
          <h2 className="slider-textcolor">Store Timeline</h2>
          <InputRange
            maxValue={timeline[currentEnvID] ? timeline[currentEnvID].length : 0}
            minValue={0}
            value={snapshotIndex}
            onChange={value => setSnapshotIndex(value)} />
          <div className="snapshot-nav">
            <button class="button is-small" onClick={() => { if (snapshotIndex !== 0) setSnapshotIndex(snapshotIndex - 1) }}>Backward</button>
            <button class="button is-small" onClick={() => setSnapshotIndex(timeline[currentEnvID].length)}>Current</button>
            <button class="button is-small" onClick={() => { if (snapshotIndex !== timeline[currentEnvID].length) setSnapshotIndex(snapshotIndex + 1) }}>Forward</button>
          </div>
          <div className="snapshot-info">
          </div>
        </div>
      </div>
      <StoreDisplayer store={(!timeline[currentEnvID] || !timeline[currentEnvID][snapshotIndex] || snapshotIndex === timeline[currentEnvID].length) ? liveStore : timeline[currentEnvID][snapshotIndex].storage} />
    </React.Fragment>
  )
}

export default StoreTimeline;