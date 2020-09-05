import React, { useState, useEffect } from "react";
import prettyPrintJson from 'pretty-print-json';


// onst insertCode = prettyPrintJson.toHtml(displayData);

function StoreID(props) {

    // for (let key in props.data[1]) {
    //     console.log(`key: ${key}, value: ${props.data[1][key]}`);
    // }
    return (
        <div>

        </div>
    )
}

export default StoreID;


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