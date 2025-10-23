import React, { useEffect, useState } from 'react';
import CitySearch from './components/CitySearch';
import EventList from './components/EventList';
import NumberOfEvents from './components/NumberOfEvents';
import { extractLocations, getEvents } from './api';
import { InfoAlert, ErrorAlert, WarningAlert } from './components/Alert';
import CityEventsChart from './components/CityEventsChart';
import EventGenresChart from './components/EventGenresChart';
import './App.css';

const App = () => {
  const [allLocations, setAllLocations] = useState([]);
  const [currentNOE, setCurrentNOE] = useState(32); // default number of events
  const [events, setEvents] = useState([]);
  const [currentCity, setCurrentCity] = useState('See all cities');
  const [infoAlert, setInfoAlert] = useState('');
  const [errorText, setErrorText] = useState('');
  const [warningText, setWarningText] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allEvents = await getEvents();
        console.log('💡 getEvents returned:', allEvents);

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

    // Functions for handling network changes
    const handleOffline = () => {
      setWarningText('You are offline. Events are loaded from cache and may be outdated.');
    };

    const handleOnline = () => {
      setWarningText('');
    };

    // ✅ Skip offline warnings in dev mode
    if (import.meta.env.DEV) {
      setWarningText('');
    } else {
      if (navigator.onLine) {
        setWarningText('');
      } else {
        setWarningText('You are offline. Events are loaded from cache and may be outdated.');
      }

      window.addEventListener('offline', handleOffline);
      window.addEventListener('online', handleOnline);
    }

    fetchData();

    // 🧹 Clean up listeners on component unmount
    return () => {
      if (!import.meta.env.DEV) {
        window.removeEventListener('offline', handleOffline);
        window.removeEventListener('online', handleOnline);
      }
    };
  }, [currentCity, currentNOE]);

  console.log('📊 Events data:', events);

  return (
    <div className="App">
      <h1>Meet App</h1>

      <div className="alerts-container">
        {infoAlert && <InfoAlert text={infoAlert} />}
        {errorText && <ErrorAlert text={errorText} />}
        {warningText && <WarningAlert text={warningText} />}
      </div>

      <CitySearch
        allLocations={allLocations}
        setCurrentCity={setCurrentCity}
        setInfoAlert={setInfoAlert}
        setErrorText={setErrorText}
      />

      <NumberOfEvents
        currentNOE={currentNOE}
        setCurrentNOE={setCurrentNOE}
        setErrorText={setErrorText}
      />

      {events?.length > 0 && (
        <div className="charts-container">
          <CityEventsChart allLocations={allLocations} events={events} />
          <EventGenresChart events={events} />
        </div>
      )}

      <EventList events={events} />
    </div>
  );
};

export default App;
