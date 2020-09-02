/** @format */

import React, { useState, useEffect } from "react";
import ComponentsRender from './leftContainer';
import RightContainer from './RightContainer';

const App = () => {
  return (
    <div>
      <ComponentsRender />
      <RightContainer />
    </div>
  );
}

export default App;
