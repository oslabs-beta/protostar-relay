import React, { useState } from 'react';
import dataObj from './sampleData'
import Record from './Components/Record';


const organizeData = (object) => {
    let i = 0;
    let j = 100000000;

    const output = [];
    for (let key in object) {
        if (typeof object[key] === 'object') {
            let nestedObj = object[key];
            for (let element in nestedObj) {
                output.push( 
                    <Record key={i} uniquekey={element} value={nestedObj[element]}/> 
                );
                i++;
            }
        }
        output.push(
            <div>
                <Record key={j} uniquekey={key} value={object[key]} /> 
            </div>
        );
        j++;
    }
    return output;
}

const StoreDisplayer = () => {
    const displayData = organizeData(dataObj);
    return (
        <div className="middleContainer">
            <h1>Store Display Here</h1>
            <div className="display-box">
                <ul>
                    {displayData}
                </ul>
            </div>
        </div>
    )
}

export default StoreDisplayer;



//console.log(dataObj);

// let arr = Object.entries(dataObj);
// const data = (el, output = []) => {
//     //we want to leave idx 0 alone. That will always be the first key.
//    //arr.forEach((el, idx) => {
//         output.push(el[0])
//         if (typeof el[1] !== 'object') return output;
//         if (typeof el[1] === 'object') {
//             let innerArr = Object.entries(el[1])
//             data(innerArr, output);
//         }
//     output.push(el[1]);
//     return output;
//   //  })
// }

// let result = data(arr);
// console.log(result);
//function to loop through data
// console.log(dataObj);