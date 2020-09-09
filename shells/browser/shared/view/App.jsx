/** @format */
import React, { useEffect, useState } from "react";

const port = chrome.runtime.connect({ name: "test" });

const App = () => {
  const [tree, setTree] = useState();
  // const [history, setHistory] = useState([]);
  // const [count, setCount] = useState(1);

  // function is receiving fibernode state changes from backend and is saving that data to tree hook
  useEffect(() => {
    port.postMessage({
      name: "connect",
      tabID: chrome.devtools.inspectedWindow.tabId,
    });

    port.onMessage.addListener((message) => {
      if (message.length === 3) {
        setTree(message);
      }
    });

    
  }, []);
  return (<div> </div>);  
};

export default App;