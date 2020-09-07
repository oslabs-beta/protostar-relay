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

// installHook()

  // // parsing information for history tab
  // useEffect(() => {
  //   let lastHistory;
  //   let stringTree = tree ? JSON.stringify(tree[1].atomVal) : null;
  //   if (history.length) {
  //     lastHistory = JSON.stringify(history[history.length - 1].tree[1].atomVal);
  //   }
  //   if (lastHistory == stringTree) return;
  //   if (history.length === 10) {
  //     const historyCopy = [...history];
  //     historyCopy.shift();
  //     setHistory([...historyCopy, { count, tree }]);
  //   } else {
  //     setHistory([...history, { count, tree }]);
  //   }
  //   setCount(count + 1);
  // }, [tree]);
  // const test = logger('hi marc')

  return (
    <p>App.jsx is loaded</p>
  );  
};

export default App;