import React, { useState, useEffect } from "react";
import InputRange from 'react-input-range';



const StoreTimeline = ({store}) => {
  const [sendStore, setSendStore] = useState(store);
  const [snapshot, setSnapshot] = useState(0);
  const [timeline, setTimeline] = useState([]);
  const [timelineLabel, setTimelineLabel] = useState('');

  const handleClick = (e) => {
    e.preventDefault();
    const timelineInsert = {};
    const timeStamp = Date.now();
    const newStore = store;
    timelineInsert.label = timelineLabel;
    timelineInsert.date = timeStamp;
    timelineInsert.storage = newStore;
    setTimeline([...timeline, timelineInsert]);
  }

  useEffect(() => {
    console.log(timeline.length)
    if (snapshot === 0) {
      console.log('...loading store')
      setSendStore(store);
    } else {
      console.log('...loading snapshot')
      console.log(timeline[snapshot - 1].date, timeline[snapshot - 1].label)
      setSendStore(timeline[snapshot - 1].storage);
    }
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
          maxValue={timeline.length}
          minValue={0}
          value={snapshot}
          onChange={value => setSnapshot(value)} />
          <div className="snapshot-nav">
            <a onClick={() => setSnapshot(snapshot + 1)}>forward</a>
            <a onClick={() => setSendStore(store)}>current</a>
            <a onClick={() => setSnapshot(snapshot - 1)}>backward</a>
          </div>
      </div>
    </div>
  )
}

export default StoreTimeline;