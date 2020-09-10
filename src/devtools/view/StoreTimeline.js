import React, { useState, useEffect, useContext, useCallback } from "react";
import InputRange from 'react-input-range';
import { BridgeContext, StoreContext } from '../context';
import StoreDisplayer from "./StoreDisplayer";



const StoreTimeline = (props) => {
  // const [sendStore, setSendStore] = useState(store.getRecords(props.currentEnvID));
  const [snapshot, setSnapshot] = useState(0);
  const [timelineLabel, setTimelineLabel] = useState('');
  const store = useContext(StoreContext);
  const bridge = useContext(BridgeContext);
  const [liveStore, setLiveStore] = useState(store.getRecords(props.currentEnvID));
  const [timeline, setTimeline] = useState([{
    label: "current",
    date: Date.now(),
    storage: liveStore,
  }]);

  const handleClick = (e) => {
    e.preventDefault();
    const timelineInsert = {};
    const timeStamp = Date.now();
    timelineInsert.label = timelineLabel;
    timelineInsert.date = timeStamp;
    timelineInsert.storage = liveStore;
    setTimeline([...timeline, timelineInsert]);
  }

  const updateStoreHelper = (storeObj) => {
    setLiveStore(storeObj);
  }

  useEffect(() => {

    const refreshLiveStore = () => {
      bridge.send('refreshStore', props.currentEnvID);
      setTimeout(() => {
        const allRecords = store.getRecords(props.currentEnvID);
        console.log('REFRESH INVOKED!!!!!?$%%@#$%')
        // console.log('new store', allRecords);
        // console.log('old store', liveStore);
        updateStoreHelper(allRecords);
      },400)
    };
    store.addListener('mutationComplete', refreshLiveStore);
    return () => {
      store.removeListener('mutationComplete', refreshLiveStore);
    };
  }, [store]);

  useEffect(() => {
      console.log('timeline length', liveStore)
      console.log('snapshot number', snapshot)
      if (snapshot === 0) {
        console.log('loading current... AND SETTING STORE TO ALL RECORDS');
        console.log(props.currentEnvID)
        setLiveStore(liveStore);
      } else {
        console.log('inside the snapshot useeffet else')
        setLiveStore(timeline[snapshot].storage);
        console.log(timeline[snapshot].date, timeline[snapshot].label);
        console.log(timeline[snapshot].storage);
    }
    }, [snapshot]);
  return (
    <React.Fragment>
      <div className="column">
        <div className="display-box">
              <div className="snapshot-wrapper is-flex">
                <input type="text" className="input is-small snapshot-btn" value={timelineLabel} onChange={(e) => setTimelineLabel(e.target.value)} placeholder="take a store snapshot"></input>
                <button className="button is-small is-primary" onClick={(e) => handleClick(e)}>Snapshot</button>
              </div>
        </div>
        <div className="snapshots">
          <h2 className="slider-textcolor">Store Timeline</h2>
          <InputRange
            maxValue={timeline.length - 1}
            minValue={0}
            value={snapshot}
            onChange={value => setSnapshot(value)} />
            <div className="snapshot-nav">
              <button class="button is-small is-primary" onClick={() => {if (snapshot !== 0) setSnapshot(snapshot - 1)}}>Backward</button>
              <button class="button is-small is-primary" onClick={() => setSnapshot(0)}>Current</button>
              <button class="button is-small is-primary" onClick={() => {if (snapshot !== timeline.length - 1) setSnapshot(snapshot + 1)}}>Forward</button>
            </div>
        </div>
      </div>
      <StoreDisplayer store={liveStore}/>
    </React.Fragment>
  )
}

export default StoreTimeline;