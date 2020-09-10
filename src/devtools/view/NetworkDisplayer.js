import React, { useState, useEffect, useContext } from "react";
import { StoreContext } from '../context';
import Record from './Components/Record';
import { v4 as uuidv4 } from "uuid";

const NetworkDisplayer = (props) => {
  // const [store, setStore] = useState(props.store);
  const [, forceUpdate] = useState({});
  const [selection, setSelection] = useState("");
  const store = useContext(StoreContext);

  useEffect(() => {
    const onMutated = () => {
      forceUpdate({});
    };
    store.addListener('mutated', onMutated);

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
        //remove selecti on;
        setSelection("");
    };

    console.log("store",store)

    const events = store._environmentEventsMap.get(1) || [];
    const eventMenu = [];
    const eventsList = []

    //for each event - add to menu list
    events.forEach(event => {
      const id = uuidv4();
      eventMenu.push(
          <li>
            <a id={id} className={(selection === (id)) && "is-active"} onClick={(e) => {handleIdClick(e, id)}}>{event.name}</a>
        </li>
      );
        eventsList.push(
          <div id={id} className={((selection !== (id)) && selection !== "") && "is-hidden"}>
            <Record {...event} />
          </div>
        );
    })

    console.log("events", events)

  return (
        <React.Fragment>
            <div className="column">
                <button className="button is-small is-link" onClick={(e)=>{handleReset(e)}}>Reset</button>
                <aside className="menu">
                <p className="menu-label">
                    Event List
                </p>
                <ul className="menu-list" id="menu">
                    {eventMenu}
                </ul>
                </aside>
            </div>
            <div className="column">
                <div className="display-box">
                    {eventsList}
                </div>
            </div>
        </React.Fragment>
  );
};

export default NetworkDisplayer;
