/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

// Reach styles need to come before any component styles.
// This makes overridding the styles simpler.

import React, { useState, useCallback, useEffect } from "react";
import type { FrontendBridge } from "src/bridge";
import Store from "./store";
import { BridgeContext, StoreContext } from "./context";
import NetworkDisplayer from "./view/NetworkDisplayer";
import StoreTimeline from "./view/StoreTimeline";

// export type TabID = 'network' | 'settings' | 'store-inspector';
export type ViewElementSource = (id: number) => void;

export type Props = {|
  bridge: FrontendBridge,
  // defaultTab?: TabID,
  // showTabBar?: boolean,
  store: Store,
  viewElementSourceFunction?: ?ViewElementSource,
  viewElementSourceRequiresFileLocation?: boolean,

  // This property is used only by the web extension target.
  // The built-in tab UI is hidden in that case, in favor of the browser's own panel tabs.
  // This is done to save space within the app.
  // Because of this, the extension needs to be able to change which tab is active/rendered.
  // overrideTab?: TabID,

  // TODO: Cleanup multi-tabs in webextensions
  // To avoid potential multi-root trickiness, the web extension uses portals to render tabs.
  // The root <DevTools> app is rendered in the top-level extension window,
  // but individual tabs (e.g. Components, Profiling) can be rendered into portals within their browser panels.
  rootContainer?: Element,
  // networkPortalContainer?: Element,
  settingsPortalContainer?: Element,
  storeInspectorPortalContainer?: Element,
|};

const networkTab = {
  id: ("network": TabID),
  icon: "network",
  label: "Network",
  title: "Relay Network",
};
const storeInspectorTab = {
  id: ("store-inspector": TabID),
  icon: "store-inspector",
  label: "Store",
  title: "Relay Store",
};

const tabs = [networkTab, storeInspectorTab];

export default function DevTools({
  bridge,
  rootContainer,
  networkPortalContainer,
  storeInspectorPortalContainer,
  settingsPortalContainer,
  store,
  viewElementSourceFunction,
  viewElementSourceRequiresFileLocation = false,
}: Props) {
  const [environmentIDs, setEnvironmentIDs] = useState(
    store.getEnvironmentIDs()
  );
  const [currentEnvID, setCurrentEnvID] = useState(environmentIDs[0]);
  const [selector, setSelector] = useState("Store");

  const setEnv = useCallback(() => {
    const ids = store.getEnvironmentIDs();
    if (currentEnvID === undefined) {
      const firstKey = ids[0];
      setCurrentEnvID(firstKey);
    }
    setEnvironmentIDs(ids);
  }, [store, currentEnvID]);

  useEffect(() => {
    setEnv()
    store.addListener("environmentInitialized", setEnv);
    return () => {
      store.removeListener("environmentInitialized", setEnv);
    };
  }, [store, setEnv]);

  function handleTabClick(e, tab) {
    setSelector(tab);
  }

  const handleChange = useCallback((e) => {
    setCurrentEnvID(parseInt(e.target.value));
  }, []);

  console.log("currentenvid before render", currentEnvID)

  return (
    <BridgeContext.Provider value={bridge}>
      <StoreContext.Provider value={store}>
        <div className="navigation">
          <form className="env-select select is-small is-pulled-left">
            <select className="env-select" onChange={handleChange}>
              {environmentIDs.map((id) => {
                return (
                  <option key={id} value={id}>
                    {store.getEnvironmentName(id) || id}
                  </option>
                );
              })}
            </select>
          </form>
          <div className="tabs is-toggle is-small is-pulled-left">
            <ul>
              <li className={selector === "Store" && "is-active"}>
                <a
                  id="storeSelector"
                  onClick={(e) => handleTabClick(e, "Store")}
                >
                  <span className="icon is-small">
                    <i className="fas fa-database"></i>
                  </span>
                  <span>Store</span>
                </a>
              </li>
              <li className={selector === "Network" && "is-active"}>
                <a
                  id="networkSelector"
                  onClick={(e) => {
                    handleTabClick(e, "Network");
                  }}
                >
                  <span className="icon is-small">
                    <i className="fas fa-network-wired"></i>
                  </span>
                  <span>Network</span>
                </a>
              </li>
            </ul>
          </div>
          <div className="logo is-pulled-right">
            <a href="https://github.com/oslabs-beta/protostar-relay" target="_blank"><img src="../../assets/protorelay.png"></img></a>
          </div>
        </div>
        <div
          className={
            selector === "Store"
              ? "columns mb-0 is-multiline is-mobile"
              : "is-hidden"
          }
        >
          {currentEnvID && <StoreTimeline
            currentEnvID={currentEnvID}
            portalContainer={storeInspectorPortalContainer}
          />}
        </div>
        <div
          className={
            selector === "Network"
              ? "columns mb-0 is-mobile"
              : "is-hidden"
          }
        >
          {currentEnvID && <NetworkDisplayer currentEnvID={currentEnvID} />}
        </div>
      </StoreContext.Provider>
    </BridgeContext.Provider>
  );
}
