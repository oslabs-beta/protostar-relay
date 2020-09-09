import React, { useState, useEffect } from "react";
import Slider from 'react-input-slider';


const StoreTimeline = ({store}) => {
  const [state, setState] = useState({ x: 0.3 });
  const [timeline, setTimeline] = useState([]);
  const [timelineLabel, setTimelineLabel] = useState('');

  const handleClick = (e) => {
    e.preventDefault();
    const timelineInsert = {};
    const timeStamp = Date.now();
    const newStore = store;
    timelineInsert.label = timelineLabel;
    timelineInsert.date = timeStamp;
    timelineInsert.store = newStore;
    setTimeline([...timeline, timelineInsert]);
  }

    return (
        <div>
            <div className="display-box">
                  
                {/* {
                    type Query {
                        getMessage(id: ID!): Message
                    }
                } */}
                code goes here....
                <input type="text" value={timelineLabel} onChange={(e) => setTimelineLabel(e.target.value)} ></input>
                <a className="button mx-1" onClick={(e) => handleClick(e)}>Timeline snapshot</a>
              <div>{timeline.length}</div>
              <div>{timelineLabel}</div>
            </div>
            <div>
                <p>addUser 1</p>
                <p>addUser 2</p>
            </div>
            <h2 className="slider-textcolor">Store Timeline</h2>
        </div>
    )
}

export default StoreTimeline;