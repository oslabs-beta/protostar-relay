import React, { useState, useEffect, Fragment } from "react";
import beautify from 'json-beautify';

//https://www.artsy.net/artwork/yayoi-kusama-pumpkin-2248
// onst insertCode = prettyPrintJson.toHtml(displayData);
//          beautify(props.value, null, 2, 80)
function Record(props) {
    console.log("props:", props);

    const records = Object.keys(props).map(key => {
      return typeof props[key] === "object" ? (
        <div className="nestedObject">
          <span>{key}: </span>
          <Record {...props[key]} />
        </div>
      ) : (
        <div className="objectProperty">
          <span>{key}: </span>
          <span>{props[key]}</span>
        </div>
      );
    })
    console.log("records:",records)

    return (
      <div className="records">
        {records}
      </div>
    );
}

export default Record;

      // <div>
      //   <p>Start Object================</p>
      //   {typeof props.value === "object" ? (
      //       <li>
      //         key: {props.uniquekey} : value: <Record key={i} uniquekey={element} value={nestedObj[element]} />
      //       </li>
      //   ) : (
      //     <ol>
      //       <li>
      //         key: {props.uniquekey} : value: {props.value}
      //       </li>
      //     </ol>
      //   )}
      // </div>

    //function here to loop through the props.data at index 1
    // const values = props.data.map((el, idx) => {
    //     const details = Object.entries(el[0])
    //     // console.log(el);
    //     return (
    //         <div>
    //             <p>{el[0]}</p>
    //         </div>
    //     );
    // });
    // const propsArr = Object.entries(props.data[1])
    // console.log(propsArr, 'propsArr')
    //console.log(props.data[1], 'data1');



{/* <p>Data: {props.data[0]}</p>
            <p>Inside 0.1: {propsArr[0][1]} </p>
            <p>Inside 1: {propsArr[1]} </p>
            <p>Inside 1.1: {propsArr[1][1]} </p>
            <p>Inside 1.0: {propsArr[1][0]} </p>
            <p>Inside 01: {propsArr[0][1]} </p>
            <p>Inside 1.2: {propsArr[1][2]} </p>
            <p>Inside 5.4: {propsArr[0][4]} </p>
            {/* <p>Inside 2: {propsArr[2]} </p> <-- breaks it
            {values} */}