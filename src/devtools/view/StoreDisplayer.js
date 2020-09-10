import React, { useState, useEffect } from 'react';
// import dataObj from './sampleData'
import Record from './Components/Record';
import StoreTimeline from './Components/StoreTimeline'

const StoreDisplayer = (props) => {
    const [store, setStore] = useState(props.store);
    const [recordsList, setRecordsList] = useState(store);
    const [selection, setSelection] = useState("");

    //handle type menu click events
     function handleTypeClick(e, type) {
         //set new selection
        setSelection("type-"+type);
        //update record list to current selection
         setRecordsList(
             Object.keys(store).reduce((newRL, key) => {
               if (store[key].__typename === type)
                   newRL[key] = store[key];
             return newRL;
           }, {})
         );
    }
    //handle type menu click events
    function handleIdClick(e, id) {
        //set new selection
        setSelection("id-"+id);
        //update record list to current selection
        setRecordsList(
          Object.keys(store).reduce((newRL, key) => {
              if (store[key].__id === id) newRL[key] = store[key];
            return newRL;
          }, {})
        );
    }

    //shows you the entire store
    function handleReset(e) {
        //remove selection
        setSelection("");
        //reset back to original store
        setRecordsList(store);
    }

    //create menu list of all types
    const menuList = {}
    for (let id in store) {
        const record = store[id];
        menuList[record.__typename] ? menuList[record.__typename].push(record.__id) : menuList[record.__typename] = [record.__id];
    }

    //loop through each type and generate menu item
    const typeList = [];
    for (let type in menuList) {
        //creates an array of elements for all ids belonging to a given type
        const idList = menuList[type].map(id => {
            return (
                <li>
                    <a id={"id-" + id} className={(selection === ("id-"+id)) && "is-active"} onClick={(e) => {handleIdClick(e, id)}}>{id}</a>
                </li>
            )
        })
        //pushes the new type element with child ids to the typeList component array
        typeList.push(
          <li>
            <a id={"type-" + type} className={(selection === ("type-"+type)) && "is-active"} onClick={(e) => {handleTypeClick(e, type)}}>
              {type}
            </a>
            <ul>{idList}</ul>
          </li>
        );
    }
    console.log('envid', props.currentEnvID)
    return (
        <React.Fragment>
            <div className="column">
                <button className="button is-small is-link" onClick={(e)=>{handleReset(e)}}>Reset</button>
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
                    <Record {...recordsList} />
                </div>
            </div>
            <div className="column">
              <StoreTimeline currentEnvID={props.currentEnvID}/>
            </div>
        </React.Fragment>
    );
}

export default StoreDisplayer;
