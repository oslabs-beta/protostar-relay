import React, { useState, useEffect, Fragment } from "react";
// import beautify from 'json-beautify'; <-- needs to be uninstalled

function Record(props) {
  /* Maps through array and recursively calls component if the props[value] is an object, 
  otherwise, it will store a key/value pair */
  const records = Object.keys(props).map(key => {
    return typeof props[key] === "object" ? (
      <div className="nestedObject" key={key}>
        <span className="key">{key}: </span>
        <Record {...props[key]} />
      </div>
    ) : (
        <div className="objectProperty" key={key}>
          <span className="key">{key}: </span>
          <span className="value">{JSON.stringify(props[key])}</span>
        </div>
      );
  })

  return (
    <div className="records">
      {records}
    </div>
  );
}

export default Record;