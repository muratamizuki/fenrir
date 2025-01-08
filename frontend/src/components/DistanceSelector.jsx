import React from "react";
// optionsで使ってる　忘れる
const DistanceSelector = ({ options, selectedValue, onChange }) => {
  return (
    <div>
      {options.map((option) => (
        <label key={option.value} style={{ display: "block", marginBottom: "8px" }}>
          <input
            type="radio"
            name="distance"
            value={option.value}
            checked={selectedValue === option.value}
            onChange={(e) => onChange(e.target.value)}
          />
          {option.label}
        </label>
      ))}
    </div>
  );
};

export default DistanceSelector;
