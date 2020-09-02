/** @format */

import React, { useState, useEffect } from "react";
import ComponentsRender from './ComponentsRenderer';
import RightContainer from './RightContainer';
import StoreDisplayer from './StoreDisplayer'



const App = () => {
  return (
    <div className="columns">
      <div className="column">
        <ComponentsRender />
      </ div>
      <div className="column border">
        <StoreDisplayer />
      </div>
      <div className="column">
        <RightContainer />
      </div>
    </div>
  );  
}

export default App;
