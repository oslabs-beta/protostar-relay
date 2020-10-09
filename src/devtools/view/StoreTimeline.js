import React, { useState, useEffect, useContext, useCallback } from "react";
import InputRange from "react-input-range";
import { BridgeContext, StoreContext } from "../context";
import StoreDisplayer from "./StoreDisplayer";
import SnapshotLinks from "./Components/SnapshotLinks";
// import { detailedDiff } from 'deep-object-diff';

const StoreTimeline = ({ currentEnvID }) => {
  const store = useContext(StoreContext);
  const bridge = useContext(BridgeContext);
  const [snapshotIndex, setSnapshotIndex] = useState(0);
  const [timelineLabel, setTimelineLabel] = useState("");
  const [liveStore, setLiveStore] = useState({});

  const [timeline, setTimeline] = useState({
    [currentEnvID]: [
      {
        label: "at startup",
        date: new Date(),
        storage: liveStore,
      },
    ],
  });

  const handleClick = (e) => {
    e.preventDefault();
    const timelineInsert = {};
    const timeStamp = new Date();
    timelineInsert.label = timelineLabel;
    timelineInsert.date = timeStamp;
    timelineInsert.storage = liveStore;
    const newTimeline = timeline[currentEnvID].concat([timelineInsert]);
    setTimeline({ ...timeline, [currentEnvID]: newTimeline });
    setTimelineLabel("");
    setSnapshotIndex(newTimeline.length);
  };

  const handleSnapshot = (index) => {
    setSnapshotIndex(index);
  };

  const updateStoreHelper = (storeObj) => {
    setLiveStore(storeObj);
  };
  // testing sans set timeout... maybe put back
  React.useEffect(() => {
    const refreshLiveStore = () => {
      console.log("mutation triggered refr");
      bridge.send("refreshStore", currentEnvID);
    };
    const refreshEvents = () => {
      console.log("storeinspector refreshing due to storeDataReceived flag");
      const allRecords = store.getRecords(currentEnvID);
      updateStoreHelper(allRecords);
      console.log("REFRESH INVOKED! currentEnvID:", currentEnvID);
      // forceUpdate({});
    };

    store.addListener("storeDataReceived", refreshEvents);
    store.addListener("allEventsReceived", refreshEvents);
    store.addListener("mutationComplete", refreshLiveStore);

    return () => {
      store.removeListener("mutationComplete", refreshLiveStore);
      store.removeListener("storeDataReceived", refreshEvents);
      store.removeListener("allEventsReceived", refreshEvents);
    };
  }, [store]);

  React.useEffect(() => {
    const allRecords = store.getRecords(currentEnvID);
    setLiveStore(allRecords);

    if (!timeline[currentEnvID]) {
      const newTimeline = {
        ...timeline,
        [currentEnvID]: [
          {
            label: "current",
            date: new Date(),
            storage: allRecords,
          },
        ],
      };
      setTimeline(newTimeline);
      setSnapshotIndex(1);
    } else {
      setSnapshotIndex(timeline[currentEnvID].length);
    }
  }, [currentEnvID]);

  console.log("Rendering StoreTimeline");
  console.log("livestore", liveStore);

  return (
    <React.Fragment>
      <div className="column is-full-mobile is-one-quarter-desktop">
        <div className="display-box">
          <div className="snapshot-wrapper is-flex">
            <input
              type="text"
              className="input is-small snapshot-btn is-primary"
              value={timelineLabel}
              onChange={(e) => setTimelineLabel(e.target.value)}
              placeholder="take a store snapshot"
            ></input>
            <button
              className="button is-small is-link"
              onClick={(e) => handleClick(e)}
            >
              Snapshot
            </button>
          </div>
        </div>
        <div className="snapshots">
          <div className="timeline-nav column is-full-desktop is-flex-mobile" id="timeline-mini-col">
            <InputRange
              maxValue={
                timeline[currentEnvID] ? timeline[currentEnvID].length : 0
              }
              minValue={0}
              value={snapshotIndex}
              onChange={(value) => setSnapshotIndex(value)}
            />
            <div className="snapshot-nav has-text-centered has-text-right-mobile">
              <button
                class="button is-small is-info is-light"
                onClick={() => {
                  if (snapshotIndex !== 0) setSnapshotIndex(snapshotIndex - 1);
                }}
              >
                <span className="icon is-medium">
                  <i className="fas fa-fast-backward"></i>
                </span>
              </button>
              <button
                class="button is-small is-info is-light"
                onClick={() => setSnapshotIndex(timeline[currentEnvID].length)}
              >
                Current
              </button>
              <button
                class="button is-small is-info is-light"
                onClick={() => {
                  if (snapshotIndex !== timeline[currentEnvID].length)
                    setSnapshotIndex(snapshotIndex + 1);
                }}
              >
                <span className="icon is-medium">
                  <i className="fas fa-fast-forward"></i>
                </span>
              </button>
            </div>
          </div>
          <div className="snapshot-info is-size-7 column is-full-desktop pt-0" id="snapshot-info-col">
              <SnapshotLinks currentEnvID={currentEnvID} handleSnapshot={handleSnapshot} timeline={timeline}/>
          </div>
        </div>
      </div>
      <StoreDisplayer
        store={
          !timeline[currentEnvID] ||
            !timeline[currentEnvID][snapshotIndex] ||
            snapshotIndex === timeline[currentEnvID].length
            ? liveStore
            : timeline[currentEnvID][snapshotIndex].storage
        }
      />
    </React.Fragment>
  );
};

export default StoreTimeline;
