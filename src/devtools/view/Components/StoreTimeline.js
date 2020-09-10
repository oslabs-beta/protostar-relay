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
    // const newStore = liveStore;
    timelineInsert.label = timelineLabel;
    timelineInsert.date = timeStamp;
    timelineInsert.storage = liveStore;
    setTimeline([...timeline, timelineInsert]);
  }
  // let timelineStatusDisplay;
  
  // const timelineStatus = (str) => {
  //   console.log('inside line 29');
  //     if (str === 'default') {
  //       console.log('if on line 31')
  //       return (<div>...loading store</div>);
  //   }  console.log('inside line 33');
  //   return (<div>
  //     <div>...loading snapshot, 
  //     {/* {timeline[snapshot].date, timeline[snapshot - 1].label},  */}
  //      {/* {timeline[snapshot].storage} */}
  //    </div> 
     
  //   </div>);
  // }
  useEffect(() => {
    console.log(props, 'props in storetimeline')
    const refreshStore = () => {
      const allRecords = store.getRecords(props.currentEnvID);
      setLiveStore(allRecords);
      forceUpdate({});
    };
    store.addListener('mutated', refreshStore);
    return () => {
      store.removeListener('mutated', refreshStore);
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
            <input type="text" value={timelineLabel} onChange={(e) => setTimelineLabel(e.target.value)} ></input>
            <a className="button mx-1" onClick={(e) => handleClick(e)}>Timeline snapshot</a>
          <div>{timeline.length}</div>
          <div>{timelineLabel}</div>
      </div>
      <div className="snapshots">
        <h2 className="slider-textcolor">Store Timeline</h2>
        <InputRange
          maxValue={timeline.length - 1}
          minValue={0}
          value={snapshot}
          onChange={value => setSnapshot(value)} />
          <div className="snapshot-nav">
            <a onClick={() => setSnapshot(snapshot + 1)}>forward</a>
            <a onClick={() => setSnapshot(0)}>current</a>
            <a onClick={() => setSnapshot(snapshot - 1)}>backward</a>
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