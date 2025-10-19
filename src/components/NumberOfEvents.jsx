import React from "react";
import PropTypes from "prop-types";

const NumberOfEvents = ({ currentNOE, setCurrentNOE, setErrorText }) => {
  const handleChange = (e) => {
    const value = e.target.value; // keep as string while typing

    // allow empty string while typing
    if (value === "") {
      setCurrentNOE(value);
      setErrorText(""); 
      return;
    }

    const numberValue = Number(value);

    if (isNaN(numberValue) || numberValue <= 0 || numberValue > 32) {
      setErrorText("Please enter a valid number of events (1-32).");
    } else {
      setErrorText(""); 
      setCurrentNOE(numberValue);
    }
  };

  return (
    <div className="number-of-events">
      <label htmlFor="number-of-events">Number of events:</label>
      <input
        id="number-of-events"
        type="number"
        value={currentNOE}
        onChange={handleChange}
        aria-label="number-of-events"
      />
    </div>
  );
};

NumberOfEvents.propTypes = {
  currentNOE: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  setCurrentNOE: PropTypes.func.isRequired,
  setErrorText: PropTypes.func.isRequired,
};

export default NumberOfEvents;
