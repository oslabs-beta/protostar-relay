import React, { useState, useEffect } from "react";


const NetworkDisplayer = (props) => {
  const [store, setStore] = useState(props.store);

  // useEffect(() => {
  //   setRecordsList(organizeData(store));
  // }, [store]);


  return (
    <React.Fragment>
        <p>This is the network!</p>
    </React.Fragment>
  );
};

export default NetworkDisplayer;
