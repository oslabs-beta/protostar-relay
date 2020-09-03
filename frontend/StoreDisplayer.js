import React, { useState } from 'react';
import prettyPrintJson from 'pretty-print-json';
import dataObj from './sampleData'

// console.log(dataObj);
//function to loop through data
const organizeData = (object) => {
//we want to iterate through the object - use Object.entries
    //keys need to be clickable links 
    //when we click on a key, we want to show the value
        //assume the possibility that the 0th index of all the subarrays will be the key
    console.log(Object.entries(object)[0]);
    return Object.entries(object)[0];
}

const StoreDisplayer = () => {
    const displayData = organizeData(dataObj);
    const insertCode = prettyPrintJson.toHtml(displayData);
    return (
        <div className="middleContainer">
            <h1>Store Display Here</h1>
            <div className="display-box">
                <pre>{insertCode}</pre>
                {/* {organizeData} */}
            </div>
        </div>

    )
}

export default StoreDisplayer;

/* Working on function to go through the storeDisplayer */
    //loop through the object (using entries)/ everything at the zero index for each object
    //check the typename
    //