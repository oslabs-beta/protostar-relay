import React, { useState, useEffect } from 'react';
// import dataObj from './sampleData'
import Record from './Components/Record';
import StoreTimeline from './Components/StoreTimeline'


const organizeData = (store, typename, id) => {
    //if no filter parameters are passed then no filtering necessary

    //take store and convert top level to a sorted array
    const newRecordsList = Object.keys(store)
      .map((key) => store[key])
      .sort((a, b) => a.__typename - b.__typename);

    return newRecordsList;
}

const StoreDisplayer = (props) => {
    const [store, setStore] = useState(props.store);
    const [recordsList, setRecordsList] = useState([]);

    useEffect(() => {
    //   setRecordsList(organizeData(store));
    }, [store]);

    // const displayData = organizeData(dataObj);
    //https://www.artsy.net/artwork/yayoi-kusama-pumpkin-2248
    console.log("storedisplayer props", props);
    console.log("recordsList", recordsList);


    return (
        <React.Fragment>
        <div className="column">
            <aside className="menu">
            <p className="menu-label">
                General
            </p>
            <ul className="menu-list">
                <li>
                <a>Dashboard</a>
                </li>
                <li>
                <a>Customers</a>
                </li>
            </ul>
            <p className="menu-label">
                Administration
            </p>
            <ul className="menu-list">
                <li>
                <a>Team Settings</a>
                </li>
                <li>
                <a className="is-active">
                    Manage Your Team
                </a>
                <ul>
                    <li>
                    <a>Members</a>
                    </li>
                    <li>
                    <a>Plugins</a>
                    </li>
                    <li>
                    <a>Add a member</a>
                    </li>
                </ul>
                </li>
                <li>
                <a>Invitations</a>
                </li>
                <li>
                <a>
                    Cloud Storage Environment
                    Settings
                </a>
                </li>
                <li>
                <a>Authentication</a>
                </li>
            </ul>
            <p className="menu-label">
                Transactions
            </p>
            <ul className="menu-list">
                <li>
                <a>Payments</a>
                </li>
                <li>
                <a>Transfers</a>
                </li>
                <li>
                <a>Balance</a>
                </li>
            </ul>
            </aside>
        </div>
        <div className="column">
            <div className="display-box">
            <ul>
                <Record {...props.store} />
            </ul>
            </div>
        </div>
        <div className="column">
          <StoreTimeline store={props.store} />
        </div>
        
        </React.Fragment>
    );
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