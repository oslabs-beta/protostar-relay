import React, { useState, useEffect } from 'react';
import Record from './Components/Record';
import { debounce } from '../utils'

const StoreDisplayer = ({ store }) => {
  const [recordsList, setRecordsList] = useState({});
  const [selection, setSelection] = useState("");
  const [searchResults, setSearchResults] = useState("");

  //update record list to current selection
  function updateRecords(selection) {
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

  //updates search results
  const debounced = debounce((val) => {
    setSelection("");
    updateRecords("");
    setSearchResults(val)
  }, 300)
  function handleSearch(e) {
    //debounce search
    debounced(e.target.value)
  }

  //create menu list of all types
  const menuList = {}
  for (let id in store) {
    const record = store[id];
    menuList[record.__typename] ? menuList[record.__typename].push(record.__id) : menuList[record.__typename] = [record.__id];
  }

  //loop through each type and generate menu item
  const typeList = [];
  console.log("menuList", menuList)
  console.log("recordsList", recordsList)
  console.log("searchResults", searchResults)
  for (let type in menuList) {
    //creates an array of elements for all ids belonging to a given type

    const idList = menuList[type]
      .filter(id => new RegExp(searchResults, "i").test(JSON.stringify(recordsList[id])))
      .map(id => {
        return (
          <li>
            <a id={"id-" + id} className={(selection === ("id-" + id)) && "is-active"} onClick={(e) => { handleMenuClick(e, ("id-" + id)) }}>{id}</a>
          </li>
        )
      })
    //pushes the new type element with child ids to the typeList component array
    if (idList.length !== 0) {
      typeList.push(
        <li>
          <a id={"type-" + type} className={(selection === ("type-" + type)) && "is-active"} onClick={(e) => { handleMenuClick(e, ("type-" + type)) }}>
            {type}
          </a>
          <ul>{idList}</ul>
        </li>
      );
    }

  }
  return (
    <React.Fragment>
      <div className="column">
        <p class="control has-icons-left">
          <input className="input is-small is-primary" type="text" placeholder="Search" onChange={(e) => { handleSearch(e) }}></input>
          <button
            className="button is-small is-link"
            onClick={(e) => {
              handleReset(e);
            }}
          >
            Reset
        </button>
          <span class="icon is-left">
            <i class="fas fa-search"></i>
          </span>
        </p>
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
