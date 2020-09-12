import React, { useState, useEffect, useContext } from "react";
import { StoreContext } from '../context';
import Record from './Components/Record';
import { v4 as uuidv4 } from "uuid";
import { execute } from "graphql";

const createUUIDs = events => events.map((event) => {
  return { ...event, __id: uuidv4() };
});

const combineEvents = (events) => {
  const combinedEvents = {};
  const eventTypes = {};
  events.forEach(event => {
    const tempObj = {};
    if (event.name === "execute.start") {
      tempObj.request = event.params;
      tempObj.variables = event.variables;
    } else if (event.name === "execute.info") {
      tempObj.info = event.info
    } else if (event.name === "execute.next") {
      tempObj.response = event.response
    } else if (event.name === "execute.complete") {
      tempObj.complete = true
    }
    combinedEvents[event.transactionID] ? combinedEvents[event.transactionID] = Object.assign(combinedEvents[event.transactionID], tempObj) : combinedEvents[event.transactionID] = tempObj;
  })

  //sort by type
  Object.keys(combinedEvents).forEach(transactionID => {
    const op = combinedEvents[transactionID].request.operationKind;
    eventTypes[op] ? eventTypes[op] = Object.assign(eventTypes[op], { [transactionID]: combinedEvents[transactionID] }) : eventTypes[op] = { [transactionID]: combinedEvents[transactionID] }
  })

  return eventTypes;
}


const NetworkDisplayer = (props) => {
  // const [store, setStore] = useState(props.store);
  const [, forceUpdate] = useState({});
  const [selection, setSelection] = useState("");
  const [events, setEvents] = useState([]);
  const store = useContext(StoreContext);

  useEffect(() => {
    const onMutated = () => {
      forceUpdate({});
    };
    store.addListener('mutated', onMutated);

    setEvents(combineEvents(store._environmentEventsMap.get(1) || []));

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
    //force update
    setEvents(combineEvents(store._environmentEventsMap.get(1) || []));
    //remove selecti on;
    setSelection("");
  };

  const eventMenu = [];
  const eventsList = [];
  //for each event - add to menu list
  for (let type in events) {

    //creates an array of menu items for all events belonging to a given type
    const typeList = [];
    for (let id in events[type]) {
      typeList.push(
        <li>
          <a id={id} className={(selection === (id)) && "is-active"} onClick={(e) => { handleMenuClick(e, id) }}>{events[type][id].request.name}</a>
        </li>)
      //creates an array of elements for all events
      eventsList.push(
        <div id={id} className={`${(selection !== id && selection !== type && selection !== "") ? "is-hidden" : "record-line"}`}>
          <Record {...events[type][id]} />
        </div>
      );
    }

    //pushes the new type element with child events to the typeList component array
    eventMenu.push(
      <li>
        <a id={type} className={(selection === type) && "is-active"} onClick={(e) => { handleMenuClick(e, type) }}>
          {type}
        </a>
        <ul>{typeList}</ul>
      </li>
    );
  }



  return (
    <React.Fragment>
      <div className="column is-one-third">
        <button
          className="button is-small is-link"
          onClick={(e) => {
            handleReset(e);
          }}
        >
          Reset
        </button>
        <aside className="menu">
          <p className="menu-label">Event List</p>
          <ul className="menu-list">
            {eventMenu}
          </ul>
        </aside>
      </div>
      <div className="column">
        <div className="display-box">{eventsList}</div>
      </div>
    </React.Fragment>
  );
};

export default NetworkDisplayer;
