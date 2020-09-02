import React, { useState, useEffect } from "react";
import Slider from 'react-input-slider';


function StoreTimeline() {
    const [state, setState] = useState({ x: 0.3 });

    return (
        <div>
            <div className="display-box">
                {/* {
                    type Query {
                        getMessage(id: ID!): Message
                    }
                } */}
                code goes here....
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