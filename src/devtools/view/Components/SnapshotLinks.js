import React, { useState } from "react";

const SnapshotLinks = ({ timeline, currentEnvID, handleSnapshot }) => {
  const [active, setActive] = useState(null);
  // Create links with date and label of snapshot; rendered in the left snapshot column using Bulma menu-list. Active state is used to toggle active link.
  return (
    <div>
      <aside className="menu">
        <ul className="menu-list">
          {timeline[currentEnvID].map(
            (item, i) => <li key={i} onClick={() => {
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