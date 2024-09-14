import React, { useState } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';

const MultipleSelectDropdown = ({ options, onSelect }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleOptionToggle = (option) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter((item) => item !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  return (
    <div className="dropdown">
      <button
        className="btn btn-secondary dropdown-toggle"
        type="button"
        id="multiSelectDropdown"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
      >
        {selectedOptions.length === 0
          ? 'Select options'
          : selectedOptions.join(', ')}
      </button>
      <div className="dropdown-menu" aria-labelledby="multiSelectDropdown">
        {options?.map((option) => (
          <button
            key={option}
            className={`dropdown-item ${selectedOptions.includes(option) ? 'active' : ''}`}
            onClick={() => handleOptionToggle(option)}
            type="button"
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MultipleSelectDropdown;
