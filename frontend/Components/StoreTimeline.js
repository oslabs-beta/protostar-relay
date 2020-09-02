import React, { useState, useEffect } from "react";
import Slider from 'react-input-slider';


function StoreTimeline() {
    const [state, setState] = useState({ x: 0.3 });

    return (
        <div>
            <div>
                <code>
                    <p>insert code here...</p>
                    {/* <pre>
                        type Query {
                            getMessage(id: ID!): Message
                        }
                    </pre> */}
                </code>
            </div>
            <div>
                <p>addUser 1</p>
                <p>addUser 2</p>
            </div>
            <div>
                {/* Need to research what slider to use */}
                <Slider
                    axis="x"
                    xstep={0.1}
                    xmin={0}
                    xmax={1}
                    x={state.x}
                    onChange={({ x }) => setState({ x: parseFloat(x.toFixed(2)) })}
                />
            </div>
        </div>
    )
}

export default StoreTimeline;