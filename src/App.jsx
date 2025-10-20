import React, { useEffect, useState } from 'react';
import CitySearch from './components/CitySearch';
import EventList from './components/EventList';
import NumberOfEvents from './components/NumberOfEvents';
import { extractLocations, getEvents } from './api';
import './App.css';
import { InfoAlert, ErrorAlert, WarningAlert } from './components/Alert';

const App = () => {
  const [allLocations, setAllLocations] = useState([]);
  const [currentNOE, setCurrentNOE] = useState(32); // default number of events
  const [events, setEvents] = useState([]);
  const [currentCity, setCurrentCity] = useState('See all cities');
  const [infoAlert, setInfoAlert] = useState("");
  const [errorText, setErrorText] = useState('');
  const [warningText, setWarningText] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allEvents = await getEvents();

        if (!allEvents || allEvents.length === 0) {
          console.warn('⚠️ No events found');
          setEvents([]);
          setAllLocations([]);
          return;
        }

        const filteredEvents =
          currentCity === 'See all cities'
            ? allEvents
            : allEvents.filter((event) => event.location === currentCity);

        setEvents(filteredEvents.slice(0, currentNOE));

        setAllLocations(extractLocations(allEvents));
      } catch (error) {
        console.error('❌ Error fetching events:', error);
      }
    };

    if (navigator.onLine) {
    setWarningText(''); // clear warning if online
    } else {
    setWarningText('You are offline. Events are loaded from cache and may be outdated.');
  }

    fetchData();
  }, [currentCity, currentNOE]); // re-run when city or number of events changes

  return (
  <div className="App">
    <div className="alerts-container">
      {/* Render InfoAlert if there is info text */}
      {infoAlert.length > 0 && <InfoAlert text={infoAlert} />}
      
      {/* Render ErrorAlert if there is error text */}
      {errorText.length > 0 && <ErrorAlert text={errorText} />}
      {warningText.length > 0 && <WarningAlert text={warningText} />}
    </div>

    <CitySearch
      allLocations={allLocations}
      setCurrentCity={setCurrentCity}
      setInfoAlert={setInfoAlert}
      setErrorText={setErrorText} // pass setter to CitySearch so it can trigger error alerts
    />

    <NumberOfEvents
      currentNOE={currentNOE}
      setCurrentNOE={setCurrentNOE}
      setErrorText={setErrorText}
    />

    <EventList events={events} />
  </div>
);


}; 

export default App;
