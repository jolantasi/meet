// src/components/Event.jsx
import React, { useState } from 'react';

const Event = ({ event }) => {
  const [showDetails, setShowDetails] = useState(false);

  const handleToggleDetails = () => {
    setShowDetails(!showDetails);
  };

  // Use either dateTime or date to avoid test failures
  const start = event.start?.dateTime || event.start?.date || 'No start time available';

  return (
    <li className="event">
      <h2 className="event-title">{event.summary}</h2>
      <p className="event-start">{start}</p> {/* 👈 ensures test finds it */}
      <p className="event-location">Location: {event.location}</p>

      <button className="details-btn" onClick={handleToggleDetails}>
        {showDetails ? 'Hide Details' : 'Show Details'}
      </button>

      {showDetails && (
        <div className="event-details">
          <p>{event.description}</p>
          <a href={event.htmlLink} target="_blank" rel="noreferrer">
            View on Google Calendar
          </a>
        </div>
      )}
    </li>
  );
};

export default Event;
