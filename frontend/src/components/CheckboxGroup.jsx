import React from "react";

const CheckboxGroup = ({ options, checkedStates, onChange }) => (
  <div>
    {options.map((option) => (
      <label key={option.value} style={{ display: "block", marginBottom: "8px" }}>
        <input
          type="checkbox"
          checked={checkedStates[option.value]}
          onChange={() => onChange(option.value)}
        />
        {option.label}
      </label>
    ))}
  </div>
);

export default CheckboxGroup;