import React, { useState, useEffect } from 'react';
import Record from './Components/Record';

const StoreDisplayer = ({ store }) => {
  const [recordsList, setRecordsList] = useState({});
  const [selection, setSelection] = useState("");

  //update record list to current selection
  function updateRecords(selection) {
    console.log("selection", selection)
    if (selection === "") {
      setRecordsList(store);
      //id selected - filter out everything except selected id
    } else if (selection[0] === "i") {
      const id = selection.slice(3)
      setRecordsList(
        Object.keys(store).reduce((newRL, key) => {
          if (store[key].__id === id) newRL[key] = store[key];
          return newRL;
        }, {})
      );
      //type selected - filter out everything except selected type
    } else {
      const type = selection.slice(5);
      setRecordsList(
        Object.keys(store).reduce((newRL, key) => {
          if (store[key].__typename === type) newRL[key] = store[key];
          return newRL;
        }, {})
      );
    }
  }

  useEffect(() => {
    //initialize store
    updateRecords("");
  }, [store]);

  //handle menu click events
  function handleMenuClick(e, selection) {
    //set new selection
    setSelection(selection);
    //update display with current selection
    updateRecords(selection);
  }

  //shows you the entire store
  function handleReset(e) {
    //remove selection
    setSelection("");
    //reset back to original store
    updateRecords("");
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
          <a id={"id-" + id} className={(selection === ("id-" + id)) && "is-active"} onClick={(e) => { handleMenuClick(e, ("id-" + id)) }}>{id}</a>
        </li>
      )
    })
    //pushes the new type element with child ids to the typeList component array
    typeList.push(
      <li>
        <a id={"type-" + type} className={(selection === ("type-" + type)) && "is-active"} onClick={(e) => { handleMenuClick(e, ("type-" + type)) }}>
          {type}
        </a>
        <ul>{idList}</ul>
      </li>
    );
  }
  return (
    <React.Fragment>
      <div className="column">
        <button className="button is-small is-link" onClick={(e) => { handleReset(e) }}>Reset</button>
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
    </React.Fragment>
  );
}

export default StoreDisplayer;
