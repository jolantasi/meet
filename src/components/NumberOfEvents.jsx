import { useState } from "react";
import PropTypes from "prop-types";

const NumberOfEvents = ({ onNumberChange }) => {
  const [number, setNumber] = useState(32);

  const handleChange = (e) => {
    const value = e.target.value;
    setNumber(value);
    if (onNumberChange) onNumberChange(value);
  };

  return (
    <div>
      <label htmlFor="number-of-events">Number of events:</label>
      <input
        id="number-of-events"
        type="number"
        value={number}
        onChange={handleChange}
      />
    </div>
  );
};

NumberOfEvents.propTypes = {
  onNumberChange: PropTypes.func,
};

export default NumberOfEvents;
