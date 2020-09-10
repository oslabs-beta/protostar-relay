import React, { useState, useEffect, useContext, useCallback } from "react";
import InputRange from 'react-input-range';
import { BridgeContext, StoreContext } from '../../context';



const StoreTimeline = (props) => {
  const [sendStore, setSendStore] = useState(store);
  const [snapshot, setSnapshot] = useState(0);
  const [, forceUpdate] = useState({});
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

  useEffect(() => {
    const refreshStore = () => {
      const allRecords = store.getRecords(props.currentEnvID);
      setLiveStore(allRecords);
      // forceUpdate({});
    };
    store.addListener('mutationComplete', refreshStore);
    return () => {
      store.removeListener('mutationComplete', refreshStore);
    };
  }, [store, liveStore]);

  useEffect(() => {
      console.log('timeline length', timeline.length)
      console.log('snapshot number', snapshot)
      if (snapshot === 0) {
        console.log('loading current...');
        // timelineStatusDisplay = Object.entries(timelineStatus('default'));
        setSendStore(liveStore);
      } else {
        console.log(timeline[snapshot].date, timeline[snapshot].label);
        console.log(JSON.stringify(timeline[snapshot]));
    //  timelineStatusDisplay = Object.entries(timelineStatus('secondary'));
        setSendStore(timeline[snapshot].storage);
    }
    // console.log(timelineStatusDisplay, 'ln 53 timelinestatusdisplay')
    }, [snapshot]);
  return (
    <div>
      <div className="display-box">
            <div className="snapshot-wrapper is-flex">
              <input type="text" className="input is-small snapshot-btn" value={timelineLabel} onChange={(e) => setTimelineLabel(e.target.value)} placeholder="take a store snapshot"></input>
              <button className="button is-small is-link" onClick={(e) => handleClick(e)}>Snapshot</button>
            </div>
            {/* <a className="button mx-1" onClick={(e) => handleClick(e)}>Timeline snapshot</a> */}
          {/* <div>{timelineLabel}</div> */}
      </div>
      <div className="snapshots">
        <h2 className="slider-textcolor">Store Timeline</h2>
        <InputRange
          maxValue={timeline.length - 1}
          minValue={0}
          value={snapshot}
          onChange={value => setSnapshot(value)} />
          <div className="snapshot-nav">
          <button class="button is-small" onClick={() => {if (snapshot !== 0) setSnapshot(snapshot - 1)}}>Backward</button>
          <button class="button is-small" onClick={() => setSnapshot(0)}>Current</button>
          <button class="button is-small" onClick={() => {if (snapshot !== timeline.length - 1) setSnapshot(snapshot + 1)}}>Forward</button>
          </div>
        <div className="snapshot-info">
               {/* {timelineStatusDisplay} */}
        {/* {
          if(snapshot === 0){
           return <p>...is loading</p>
          } else{
            return <p>{JSON.stringify(timeline[snapshot])} </p>
          }
        }
      
           */}
        </div>
      </div>
    </div>
  )
}

export default StoreTimeline;