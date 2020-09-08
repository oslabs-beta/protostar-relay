import React, { useState, useEffect } from 'react';
// import dataObj from './sampleData'
import Record from './Components/Record';
import StoreTimeline from './Components/StoreTimeline'


const organizeData = (store, typename, id) => {
    //if no filter parameters are passed then no filtering necessary

    //take store and convert top level to a sorted array
    const newRecordsList = Object.keys(store)
        .map((key) => store[key])
        .sort((a, b)=>{ 
            if (a.__typename.toLowerCase() > b.__typename.toLowerCase()) return -1;
            else return 1;
        });
    return newRecordsList;
}


const StoreDisplayer = (props) => {
    const [store, setStore] = useState(props.store);
    const [recordsList, setRecordsList] = useState([]);

    useEffect(() => {
      setRecordsList(organizeData(store));
    }, [store]);

    //handle type menu click events
     function handleTypeClick(e, type) {
        console.log(type);
    }
    //handle type menu click events
    function handleIdClick(e, id) {
        console.log(id);
    }

    // const displayData = organizeData(dataObj);
    //https://www.artsy.net/artwork/yayoi-kusama-pumpkin-2248
    console.log("storedisplayer props", props);
    console.log("recordsList", recordsList);

    //create menu list of all types
    const menuList = {}
    for (let id in store) {
        const record = store[id];
        menuList[record.__typename] ? menuList[record.__typename].push(record.__id) : menuList[record.__typename] = [record.__id];
    }

    console.log("menuList", menuList);

    //loop through each type and generate new link
    const typeList = [];
    for (let type in menuList) {
        const idList = menuList[type].map(id => {
            return (
                <li>
                    <a onClick={(e) => {handleIdClick(e, id)}}>{id}</a>
                </li>
            )
        })

        typeList.push(
          <li>
            <a onClick={(e) => {handleTypeClick(e, type)}}>
              {type}
            </a>
            <ul>{idList}</ul>
          </li>
        );
    }

    return (
        <React.Fragment>
        <div className="column">
            <aside className="menu">
            <p className="menu-label">
                Record List
            </p>
            <ul className="menu-list">
                {typeList}
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
