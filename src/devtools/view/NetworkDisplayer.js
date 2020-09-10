import React, { useState, useEffect, useContext } from "react";
import { StoreContext } from '../context';
import Record from './Components/Record';
import { v4 as uuidv4 } from "uuid";

  const createUUIDs = events => events.map((event) => {
      return { ...event, __id: uuidv4() };
    });



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

    setEvents(createUUIDs(store._environmentEventsMap.get(1) || []));

    return () => {
      store.removeListener('mutated', onMutated);
    };
  }, [store]);

      //handle type menu click events
    function handleIdClick(e, id) {
        //set new selection
        setSelection(id);
    }

    //shows you the entire network
    function handleReset(e) {
      //force update
      setEvents(createUUIDs(store._environmentEventsMap.get(1) || []));
        //remove selecti on;
        setSelection("");
    };

    console.log("store",store)
    
    const eventMenu = [];
    const eventsList = []

    console.log("events", events)

    //for each event - add to menu list
    events.forEach(event => {
      eventMenu.push(
          <li>
            <a id={event.__id} className={(selection === (event.__id)) && "is-active"} onClick={(e) => {handleIdClick(e, event.__id)}}>{event.name}</a>
        </li>
      );

      console.log(event.name, event.__id, selection, ((selection !== (event.__id)) && selection !== ""))

        eventsList.push(
          <div id={event.__id} className={`record-line ${((selection !== (event.__id)) && selection !== "") && "is-hidden"}`}>
            <Record {...event} />
          </div>
        );
    })



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
          <ul className="menu-list" id="menu">
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
