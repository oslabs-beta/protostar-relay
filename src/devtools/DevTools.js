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
import '@reach/menu-button/styles.css';
import '@reach/tooltip/styles.css';

import React, { useState, useCallback, useEffect } from 'react';
import type { FrontendBridge } from 'src/bridge';
import Store from './store';
import { BridgeContext, StoreContext } from './context';

import StoreDisplayer from './view/StoreDisplayer';
import NetworkDisplayer from './view/NetworkDisplayer';
import StoreTimeline from './view/StoreTimeline';
// import ComponentsRenderer from './ComponentsRenderer';
// import Network from './Network/Network';
// import StoreInspector from './StoreInspector/StoreInspector';
// import TabBar from './TabBar';
// import { SettingsContextController } from './Settings/SettingsContext';
// import { ModalDialogContextController } from './ModalDialog';



// export type TabID = 'network' | 'settings' | 'store-inspector';
export type ViewElementSource = (id: number) => void;

export type Props = {|
  bridge: FrontendBridge,
    // defaultTab?: TabID,
    // showTabBar?: boolean,
    store: Store,
      viewElementSourceFunction ?: ? ViewElementSource,
      viewElementSourceRequiresFileLocation ?: boolean,

      // This property is used only by the web extension target.
      // The built-in tab UI is hidden in that case, in favor of the browser's own panel tabs.
      // This is done to save space within the app.
      // Because of this, the extension needs to be able to change which tab is active/rendered.
      // overrideTab?: TabID,

      // TODO: Cleanup multi-tabs in webextensions
      // To avoid potential multi-root trickiness, the web extension uses portals to render tabs.
      // The root <DevTools> app is rendered in the top-level extension window,
      // but individual tabs (e.g. Components, Profiling) can be rendered into portals within their browser panels.
      rootContainer ?: Element,
      // networkPortalContainer?: Element,
      settingsPortalContainer ?: Element,
      storeInspectorPortalContainer ?: Element,
|};

const networkTab = {
  id: ('network': TabID),
  icon: 'network',
  label: 'Network',
  title: 'Relay Network',
};
const storeInspectorTab = {
  id: ('store-inspector': TabID),
  icon: 'store-inspector',
  label: 'Store',
  title: 'Relay Store',
};

const tabs = [networkTab, storeInspectorTab];

export default function DevTools({
  bridge,
  // defaultTab = 'store-inspector',
  rootContainer,
  networkPortalContainer,
  storeInspectorPortalContainer,
  // overrideTab,
  settingsPortalContainer,
  // showTabBar = false,
  store,
  viewElementSourceFunction,
  viewElementSourceRequiresFileLocation = false,
}: Props) {
  // const [tab, setTab] = useState(defaultTab);
  // if (overrideTab != null && overrideTab !== tab) {
  //   setTab(overrideTab);
  // }

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
    setEnv();
    const testRefresh = () => {
      console.log('hi marc... shuttin \'er down')
    }
    store.addListener('environmentInitialized', setEnv);
    store.addListener('shutdown', testRefresh);
    return () => {
      store.removeListener('environmentInitialized', setEnv);
      store.removeListener('shutdown', testRefresh);
    };
  }, [store, setEnv]);

  function handleTabClick(e, tab) {
    setSelector(tab);
  }

  const handleChange = useCallback(e => {
    setCurrentEnvID(parseInt(e.target.value));
  }, []);

  return (
    <BridgeContext.Provider value={bridge}>
      <StoreContext.Provider value={store}>
        <div className="navigation">
          <form className="env-select">
            <select className="env-select" onChange={handleChange}>
              {environmentIDs.map(id => {
                return (
                  <option key={id} value={id}>{store.getEnvironmentName(id) || id}</option>
                );
              })}
            </select>
          </form>
          <div className="tabs is-toggle">
            <ul>
              <li className={selector === "Store" && "is-active"}>
                <a id="storeSelector" onClick={(e) => handleTabClick(e, "Store")}>
                  <span className="icon is-small">
                    <i className="fas fa-database"></i>
                  </span>
                  <span>Store</span>
                </a>
              </li>
              <li className={selector === "Network" && "is-active"}>
                <a id="networkSelector"
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
        </div>
        <div className={selector === "Store" ? "columns" : "is-hidden"}>
          <StoreTimeline currentEnvID={currentEnvID} portalContainer={storeInspectorPortalContainer} />
        </div>
        <div className={selector === "Network" ? "columns" : "is-hidden"}>
          <NetworkDisplayer />
        </div>
      </StoreContext.Provider>
    </BridgeContext.Provider >
  );
}
