import React, { useEffect, useState } from 'react';
import CitySearch from './components/CitySearch';
import EventList from './components/EventList';
import NumberOfEvents from './components/NumberOfEvents';
import { extractLocations, getEvents } from './api';
import './App.css';

const App = () => {
  const [allLocations, setAllLocations] = useState([]);
  const [currentNOE, setCurrentNOE] = useState(32);
  const [events, setEvents] = useState([]);
  const [currentCity, setCurrentCity] = useState('See all cities');

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

    fetchData();
  }, [currentCity, currentNOE]);

  return (
    <div className="App">
      <h1 className="app-title">Meet App</h1>
      <CitySearch allLocations={allLocations} setCurrentCity={setCurrentCity} />
      <NumberOfEvents setCurrentNOE={setCurrentNOE} currentNOE={currentNOE} />
      <EventList events={events} />
    </div>
  );
};

export default App;
