// src/App.jsx
import React, { useState, useEffect } from 'react';
import CitySearch from './components/CitySearch';
import EventList from './components/EventList';
import NumberOfEvents from './components/NumberOfEvents';
import { getEvents } from './api';

const App = () => {
  const [events, setEvents] = useState([]);
  const [numberOfEvents, setNumberOfEvents] = useState(32);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const allEvents = await getEvents();
      setEvents(allEvents.slice(0, numberOfEvents));

      // compute unique locations for CitySearch
      const allLocations = [...new Set(allEvents.map(event => event.location))];
      setLocations(allLocations);
    };
    fetchEvents();
  }, [numberOfEvents]);

  return (
    <div>
      <CitySearch allLocations={locations} data-testid="city-search" />
      <NumberOfEvents
        onNumberChange={(num) => setNumberOfEvents(Number(num))}
      />
      <EventList events={events} />
    </div>
  );
};

export default App;
