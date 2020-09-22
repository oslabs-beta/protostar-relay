import React, { useState, useEffect, useContext, useCallback } from "react";

const SnapshotLinks = ({timeline, currentEnvID, handleSnapshot}) => {
    const [active, setActive] = useState(null);

    return(
        <div>
          <aside className="menu">
            <ul className="menu-list">
      {timeline[currentEnvID].map(
        (item, i) => <li onClick={() => {
          handleSnapshot(i); 
          setActive(i);
        }}><a href="#" key={i} className={active === i && 'is-active'}>{item.date.toLocaleTimeString()}: {item.label}</a></li>
        )}
            </ul>
          </aside>
        </div>
    )
};

export default SnapshotLinks;