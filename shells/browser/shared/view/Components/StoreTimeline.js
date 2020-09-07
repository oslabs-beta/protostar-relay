import React, { useState, useEffect } from "react";
import Slider from 'react-input-slider';
import store from '../../../../../src/devtools/DevTools';


const StoreTimeline = () => {
  const [state, setState] = useState({ x: 0.3 });
  const [timeline, setTimeline] = useState([]);
  const [timelineLabel, setTimelineLabel] = useState('');

  const handleClick = (e) => {
    e.preventDefault();
    const timelineInsert = {};
    const timeStamp = Date.now();
    const newStore = store.getAllRecords();
    timelineInsert[label] = timelineLabel;
    timelineInsert[date] = timeStamp;
    timelineInsert[thestore] = newStore;
    setTimeline([...timeline, timelineInsert]);
  }

  // let loopedArr = timeline.map(changes => {
  //   return (<div>{JSON.stringify(changes)}</div>)
  // }); 

   //[{label: name, snapshot: our info here, date: date}] array[0].label.


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
                <a className="button mx-1" onClick={handleClick}>Timeline snapshot</a>
              <div>{timeline.length}</div>
              <div>{timelineLabel}</div>
            </div>
            <div>
                <p>addUser 1</p>
                <p>addUser 2</p>
            </div>
            <div>
                <Slider
                    axis="x"
                    xstep={0.1}
                    xmin={0}
                    xmax={1}
                    x={state.x}
                    onChange={({ x }) => setState({ x: parseFloat(x.toFixed(2)) })}
                />
                <h2 className="slider-textcolor">Store Timeline</h2>
            </div>
        </div>
    )
}

export default StoreTimeline;