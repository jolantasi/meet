import PropTypes from "prop-types";

const NumberOfEvents = ({ currentNOE, setCurrentNOE }) => {
  const handleChange = (e) => {
    const value = Number(e.target.value);
    setCurrentNOE(value);
  };

  return (
    <div>
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
  currentNOE: PropTypes.number.isRequired,
  setCurrentNOE: PropTypes.func.isRequired,
};

export default NumberOfEvents;
