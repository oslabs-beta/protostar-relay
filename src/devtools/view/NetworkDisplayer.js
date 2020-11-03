import React, { useState, useEffect, useContext } from 'react';
import { StoreContext } from '../context';
import Record from './Components/Record';
import { execute } from 'graphql';
import { debounce } from '../utils';

//iterates over each event and joins events based on transactionID and sorts by type
const combineEvents = events => {
  const combinedEvents = {};
  const eventTypes = {};
  //join events by transactionID
  events.forEach(event => {
    const tempObj = {};
    if (event.name === 'execute.start') {
      tempObj.request = event.params;
      tempObj.variables = event.variables;
    } else if (event.name === 'execute.info') {
      tempObj.info = event.info;
    } else if (event.name === 'execute.next') {
      tempObj.response = event.response;
    } else if (event.name === 'execute.complete') {
      // tempObj.complete = true
    }
    combinedEvents[event.transactionID]
      ? (combinedEvents[event.transactionID] = Object.assign(
          combinedEvents[event.transactionID],
          tempObj
        ))
      : (combinedEvents[event.transactionID] = tempObj);
  });

  //sort by type
  Object.keys(combinedEvents).forEach(transactionID => {
    const op = combinedEvents[transactionID].request.operationKind;
    eventTypes[op]
      ? (eventTypes[op] = Object.assign(eventTypes[op], {
          [transactionID]: combinedEvents[transactionID]
        }))
      : (eventTypes[op] = { [transactionID]: combinedEvents[transactionID] });
  });

  return eventTypes;
};

//generates a list of elements for the menu and the events listing
const generateElementList = (events, searchResults, selection, handleMenuClick) => {
  const eventMenu = [];
  const eventsList = [];

  //for each event - add to menu list
  for (let type in events) {
    //creates an array of menu items for all events belonging to a given type
    const typeList = [];
    for (let id in events[type]) {
      //filter out results based on search input
      if (new RegExp(searchResults, 'i').test(JSON.stringify(events[type][id]))) {
        typeList.push(
          <li>
            <a
              id={id}
              className={selection === id && 'is-active'}
              onClick={e => {
                handleMenuClick(e, id);
              }}
            >
              {events[type][id].request.name}
            </a>
          </li>
        );
        //creates an array of elements for all events
        eventsList.push(
          <div
            id={id}
            className={`${
              selection !== id && selection !== type && selection !== ''
                ? 'is-hidden'
                : 'record-line'
            }`}
          >
            <Record {...events[type][id]} />
          </div>
        );
      }
    }

    //pushes the new type element with child events to the typeList component array
    eventMenu.push(
      <li>
        <a
          id={type}
          className={selection === type && 'is-active'}
          onClick={e => {
            handleMenuClick(e, type);
          }}
        >
          {type}
        </a>
        <ul>{typeList}</ul>
      </li>
    );
  }
  return { eventMenu, eventsList };
};

const NetworkDisplayer = ({ currentEnvID }) => {
  const [selection, setSelection] = useState('');
  const [events, setEvents] = useState([]);
  const [searchResults, setSearchResults] = useState('');
  const store = useContext(StoreContext);

  useEffect(() => {
    //on mutation all store events are pulled and processed with events state updated
    const onMutated = () => {
      setEvents(combineEvents(store._environmentEventsMap.get(currentEnvID) || []));
    };
    store.addListener('mutated', onMutated);

    return () => {
      store.removeListener('mutated', onMutated);
    };
  }, [store]);

  //handle type menu click events
  function handleMenuClick(e, id) {
    //set new selection
    setSelection(id);
  }

  //shows you the entire network
  function handleReset(e) {
    //remove selection;
    setSelection('');
  }

  //updates search results
  const debounced = debounce(val => setSearchResults(val), 300);
  function handleSearch(e) {
    //debounce search
    debounced(e.target.value);
  }

  //generate menu list and events list
  const { eventMenu, eventsList } = generateElementList(
    events,
    searchResults,
    selection,
    handleMenuClick
  );

  return (
    <React.Fragment>
      <div className="column is-one-third scrollable">
        <p class="control has-icons-left is-flex ml-2">
          <input
            className="input is-small is-primary mt-2"
            type="text"
            placeholder="Search"
            onChange={e => {
              handleSearch(e);
            }}
          ></input>
          <button
            className="button is-small is-link my-2"
            onClick={e => {
              handleReset(e);
            }}
          >
            Reset
          </button>
          <span class="icon is-left mt-2">
            <i class="fas fa-search"></i>
          </span>
        </p>
        <aside className="menu">
          <p className="menu-label ml-2">Event List</p>
          <ul className="menu-list">{eventMenu}</ul>
        </aside>
      </div>
      <div className="column scrollable">
        <div className="display-box">{eventsList}</div>
      </div>
    </React.Fragment>
  );
};

export default NetworkDisplayer;
