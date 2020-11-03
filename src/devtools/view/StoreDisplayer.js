import React, { useState } from 'react';
import Record from './Components/Record';
import { debounce } from '../utils';

//update record list to current selection
function updateRecords(store, selection) {
  if (store) {
    if (selection === '') {
      return store;
      //id selected - filter out everything except selected id
    } else if (selection[0] === 'i') {
      const id = selection.slice(3);
      return Object.keys(store).reduce((newRL, key) => {
        if (store[key].__id === id) newRL[key] = store[key];
        return newRL;
      }, {});
      //type selected - filter out everything except selected type
    } else {
      const type = selection.slice(5);
      return Object.keys(store).reduce((newRL, key) => {
        if (store[key].__typename === type) newRL[key] = store[key];
        return newRL;
      }, {});
    }
  }
}

//generate list of menu elements
function generateComponentsList(store, searchResults, recordsList, selection, handleMenuClick) {
  //create menu list of all types
  const menuList = {};
  const typeList = [];

  for (let id in store) {
    const record = store[id];
    menuList[record.__typename]
      ? menuList[record.__typename].push(record.__id)
      : (menuList[record.__typename] = [record.__id]);
  }
  //loop through each type and generate menu item

  for (let type in menuList) {
    //creates an array of elements for all ids belonging to a given type

    const idList = menuList[type]
      .filter(id => new RegExp(searchResults, 'i').test(JSON.stringify(recordsList[id])))
      .map(id => {
        return (
          <li key={id}>
            <a
              id={'id-' + id}
              className={selection === 'id-' + id && 'is-active'}
              onClick={() => {
                handleMenuClick('id-' + id);
              }}
            >
              {id}
            </a>
          </li>
        );
      });
    //pushes the new type element with child ids to the typeList component array
    if (idList.length !== 0) {
      typeList.push(
        <li key={type}>
          <a
            id={'type-' + type}
            className={selection === 'type-' + type && 'is-active'}
            onClick={() => {
              handleMenuClick('type-' + type);
            }}
          >
            {type}
          </a>
          <ul>{idList}</ul>
        </li>
      );
    }
  }
  return typeList;
}

const StoreDisplayer = ({ store }) => {
  const [recordsList, setRecordsList] = useState({});
  const [selection, setSelection] = useState('');
  const [searchResults, setSearchResults] = useState('');

  React.useEffect(() => {
    //initialize store
    setRecordsList(store);
  }, [store]);

  //handle menu click events
  function handleMenuClick(selection) {
    //set new selection
    setSelection(selection);
    //update display with current selection
    setRecordsList(updateRecords(store, selection));
  }

  //shows you the entire store
  function handleReset(e) {
    //remove selection
    setSelection('');
    //reset back to original store
    setRecordsList(store);
  }

  //updates search results
  const debounced = debounce(val => {
    setSelection('');
    setRecordsList(store);
    setSearchResults(val);
  }, 300);
  function handleSearch(e) {
    //debounce search
    debounced(e.target.value);
  }
  //generates the menu element list

  //verify recordsList is not undefined and then generate list of components
  const typeList =
    recordsList === undefined
      ? []
      : generateComponentsList(store, searchResults, recordsList, selection, handleMenuClick);

  return (
    <React.Fragment>
      <div className="column is-half-mobile scrollable">
        <p class="control has-icons-left is-flex">
          <input
            className="input is-small is-primary"
            type="text"
            placeholder="Search"
            onChange={e => {
              handleSearch(e);
            }}
          ></input>
          <button
            className="button is-small is-link"
            onClick={e => {
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
          <p className="menu-label mt-1">Record List</p>
          <ul className="menu-list">{typeList}</ul>
        </aside>
      </div>
      <div className="column is-half-mobile scrollable">
        <div className="display-box">
          <Record {...recordsList} />
        </div>
      </div>
    </React.Fragment>
  );
};

export default StoreDisplayer;
